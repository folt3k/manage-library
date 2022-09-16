#!/bin/bash

ssh ubuntu@145.239.86.58 << 'ENDSSH'
cd /var/www/library-cms/backend

git stash
git fetch
git checkout main
git pull
npm install
rm -rf ./dist
npm run build
pm2 start node ./dist/index.js --name api
pm2 list all
pm2 restart api
sudo service nginx restart
