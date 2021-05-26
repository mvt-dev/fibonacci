
exports.up = function(knex) {
  return knex.schema.createTable('asset_price', table => {
    table.increments();
    table.integer('asset').unsigned().references('asset.id').onDelete('CASCADE');
    table.date('date');
    table.float('open');
    table.float('high');
    table.float('low');
    table.float('close');
    table.float('close_adjusted');
    table.float('volume');
    table.index('asset');
    table.index('date');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('asset_price');
};
