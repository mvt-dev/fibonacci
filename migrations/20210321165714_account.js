
exports.up = (knex) => {
  return knex.schema.createTable('account', table => {
    table.increments();
    table.string('name');
    table.string('type');
  });
};

exports.down = (knex) => {
  return knex.schema.dropTableIfExists('account');
};
