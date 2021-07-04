FROM nginx:1.10.1-alpine

RUN addgroup -g 1000 -S www \
 && adduser -u 1000 -D -S -G www www

COPY /docker/config/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80 443

ENTRYPOINT ["nginx"]

CMD ["-g","daemon off;"]