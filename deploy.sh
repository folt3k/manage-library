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
npm install
rm -rf ./dist
npm run build
pm2 start  --name api
pm2 list all
systemctl restart nginx.service