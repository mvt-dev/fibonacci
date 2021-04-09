
exports.up = function(knex) {
  return knex.schema.createTable('category', table => {
    table.increments();
    table.string('name');
    table.string('color');
    table.string('tag');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('category');
};
