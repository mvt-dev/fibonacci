
exports.up = function(knex) {
  return knex.schema.raw(`
    CREATE VIEW v_investment_current AS SELECT
    ledger.description AS asset,
    asset.type AS type,
    account.currency AS currency,
    SUM(CASE WHEN ledger.type = 'SELL' THEN ledger.amount * -1 ELSE ledger.amount END) AS amount,
    (
      SELECT SUM(ledger_avg.value * ledger_avg.amount * -1) / SUM(CASE WHEN ledger_avg.type = 'SELL' THEN ledger_avg.amount * -1 ELSE ledger_avg.amount END)
      FROM ledger ledger_avg
      WHERE ledger_avg.description = ledger.description AND (ledger_avg.type = 'BUY' OR ledger_avg.type = 'SELL')
    ) AS average,
    SUM(ledger.value * ledger.amount * -1) AS value,
    (
      SELECT SUM(value) FROM ledger ledger_profit
      WHERE ledger_profit.description = ledger.description
      AND (ledger_profit.type = 'PROFIT' OR ledger_profit.type = 'JCP' OR ledger_profit.type = 'DIVIDEND') 
    ) AS profit
    FROM ledger
    LEFT JOIN account ON (account.id = ledger.account)
    LEFT JOIN asset ON (asset.name = ledger.description)
    WHERE (ledger.type = 'BUY' OR ledger.type = 'SELL')
    GROUP BY ledger.description, asset.type, account.currency
    HAVING SUM(CASE WHEN ledger.type = 'SELL' THEN ledger.amount * -1 ELSE ledger.amount END) > 0
    ORDER BY value desc;
  `);
};

exports.down = function(knex) {
  return knex.schema.raw('DROP VIEW IF EXISTS v_investment_current');
};
