FROM node:14

ENV NODE_ENV=development

COPY /build /var/www

WORKDIR /var/www

RUN yarn install

RUN yarn global add pm2

COPY .env .

EXPOSE 3333

