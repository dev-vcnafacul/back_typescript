#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$PG_USER" <<-EOSQL
    CREATE DATABASE adonis;
    GRANT ALL PRIVILEGES ON DATABASE adonis TO vcnafacul;
EOSQL