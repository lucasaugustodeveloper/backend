exports.up = (knex) =>
  knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('name').notNull();
    table.string('email').notNull().unique();
    table.string('password').notNull();
    table.boolean('admin').notNull().defaultTo(false);
  });

exports.down = (knex) => knex.schema.dropTable('users');
