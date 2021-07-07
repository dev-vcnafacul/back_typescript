FROM node:14

ENV NODE_ENV=development

COPY /build /var/www

WORKDIR /var/www

RUN yarn install

RUN yarn global add pm2

RUN yarn build

COPY /docker/config/ecosystem.config /build

COPY .env .

EXPOSE 3333

