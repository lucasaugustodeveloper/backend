require('dotenv').config();
const path = require('path');

module.exports = {
  client: 'pg',
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    ssl: true,
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
