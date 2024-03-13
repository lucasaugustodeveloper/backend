const path = require('path');

module.exports = {
  client: 'postgresql',
  connection: {
    database: 'knowledge',
    user: 'postgres',
    password: 'password',
  },
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
