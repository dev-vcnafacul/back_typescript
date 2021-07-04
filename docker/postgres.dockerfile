FROM postgres

COPY /docker/database/script.sh /docker-entrypoint-initdb.d/

EXPOSE 5432