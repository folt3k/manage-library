FROM node:14.18-alpine

RUN mkdir -p /home/app

WORKDIR /home/app
COPY . /home/app

RUN npm install

ENV DATABASE_URL="mongodb://admin:password@library-cms-mongo:27017/library-cms?authSource=admin"
ENV JWT_SECRET=secret_key_dev_2022
ENV PORT=8000
ENV APP_URL=http://localhost:8000

RUN rm -rf ./dist
RUN npx prisma generate
RUN npm run build

CMD ["./docker/app-setup.sh"]

