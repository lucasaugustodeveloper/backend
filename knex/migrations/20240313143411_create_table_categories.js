exports.up = (knex) =>
  knex.schema.createTable('categories', (table) => {
    table.increments('id').primary();
    table.string('name').notNull();
    table.integer('parentId').references('id').inTable('categories');
  });

exports.down = (knex) => knex.schema.dropTable('categories');
