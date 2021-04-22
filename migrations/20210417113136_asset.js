
exports.up = function(knex) {
  return knex.schema.createTable('asset', table => {
    table.increments();
    table.string('name');
    table.string('symbol');
    table.string('type');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('asset');
};