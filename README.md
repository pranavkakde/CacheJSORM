
# CacheJSORM

A JavaScript ORM with caching and connection pooling (mysql) support.
It supports multiple databases and drivers e.g. mssql and mysql.

Note: Postgress support is in progress.

This repo contains library code for ORM and examples to use this library. 

To use this ORM;

1. Clone this repo
2. run `npm install`
3. Setup database schema.
4. Setup config in `server.js`, `test.js` or `testMySQL.js` .
5. run `node server.js` to run expressjs example for using this ORM
6. Alternatively, run `node test.js` for mssql or run `node testMySQL.js` for examples on mysql
