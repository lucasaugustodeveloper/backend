const path = require('path');

module.exports = {
  client: 'pg',
  connection: {
    host: 'localhost',
    user: 'postgres',
    password: 'postgres',
    database: 'knowledge',
  },
  searchPath: ['knex', 'public'],
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    directory: path.join(__dirname, 'knex/migrations'),
    tableName: 'knex_migrations',
  },
  seed: {
    directory: path.join(__dirname, 'knex/seed'),
  },
};
