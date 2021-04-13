
exports.up = function(knex) {
  return Promise.all([
    knex.schema.alterTable('account', table => {
      table.string('currency');
    }),
    knex.schema.alterTable('ledger', table => {
      table.string('type');
    }),
  ]);
};

exports.down = function(knex) {
  return Promise.all([
    knex.schema.alterTable('account', table => {
      table.dropColumn('currency');
    }),
    knex.schema.alterTable('ledger', table => {
      table.dropColumn('type');
    }),
  ]);
};
