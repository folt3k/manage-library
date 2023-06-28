#!/bin/bash

ssh root@57.128.201.16 << 'ENDSSH'
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
npx prisma generate
npm run build
pm2 start ./dist/src/index.js --name api
pm2 list all
systemctl restart nginx.service
