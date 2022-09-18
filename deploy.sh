#!/bin/bash

ssh root@145.239.86.58 << 'ENDSSH'
cd /var/www/library-cms/backend

git stash
git fetch
git checkout main
git pull
kill -9 $(sudo lsof -t -i:8000)
pm2 delete api
rm -rf node_modules
rm -rf ./dist
npm install
npm run build
pm2 start ./dist/index.js --name api
pm2 list all
sudo service nginx restart
