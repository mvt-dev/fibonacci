// Update with your config settings.

module.exports = {

  development: {
    client: 'postgresql',
    connection: {
      database: 'fibonacci',
      user:     'postgres',
      password: 'Fibonacci'
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};
