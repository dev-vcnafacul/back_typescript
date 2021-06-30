FROM node:14

ENV NODE_ENV=development

COPY . /var/www

WORKDIR /var/www

RUN yarn install

EXPOSE 3333

