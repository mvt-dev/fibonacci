
exports.up = function(knex) {
  return knex.schema.createTable('ledger', table => {
    table.increments();
    table.date('date');
    table.integer('account').unsigned();
    table.foreign('account').references('account.id');
    table.integer('category').unsigned();
    table.foreign('category').references('category.id');
    table.string('description');
    table.float('amount');
    table.float('value');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('ledger');
};
