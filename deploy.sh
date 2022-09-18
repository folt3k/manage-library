#!/bin/bash

ssh root@145.239.86.58 << 'ENDSSH'
cd /var/www/library-cms/backend

git stash
git fetch
git checkout main
git pull
kill -9 $(sudo lsof -t -i:4000)
pm2 delete api
pm2 kill
rm -rf ~/.pm2
rm -rf node_modules
npm install
rm -rf ./dist
npm run build
pm2 start node ./dist/index.js --name api --no-autorestart
pm2 list all
sudo service nginx restart
