import { types } from 'pg';
import { knex, Knex } from 'knex';
import DateHelper from '../../helpers/Date';

interface PgConnection {
  database?: string;
  host?: string;
  user?: string;
  password?: string;
  port?: number;
}

/**
* Database model
*/
export default class DbModel {

  db: any;

  constructor({
    database = 'fibonacci',
    host = '127.0.0.1',
    user = 'postgres',
    password = 'Fibonacci',
    port = 5432,
  }: PgConnection) {
    types.setTypeParser(types.builtins.DATE, value => value && DateHelper.fromUTC(value));
    types.setTypeParser(types.builtins.TIMESTAMP, value => value && DateHelper.fromUTC(value));
    this.db = knex({
      client: 'pg',
      connection: {
        database,
        host,
        user,
        password,
        port,
      },
      pool: {
        afterCreate: (connection: Knex.Client, callback: (err: Knex.KnexTimeoutError, connection: Knex.Client) => void) => {
          connection.query('SET TIME ZONE \'UTC\';', (err: Knex.KnexTimeoutError) => {
            callback(err, connection);
          });
        }
      },
    });
  }

}
