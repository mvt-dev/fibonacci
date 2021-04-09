import { types } from 'pg';
import { knex, Knex } from 'knex';
import DateHelper from '../../helpers/Date';
import moment from 'moment';

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
    types.setTypeParser(types.builtins.DATE, value => value && moment.utc(value));
    types.setTypeParser(types.builtins.TIMESTAMP, value => value && moment.utc(value));
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
        afterCreate: (connection: Knex.Client, callback: (err: Error, connection: Knex.Client) => void) => {
          connection.query('SET TIME ZONE \'UTC\';', (err: Error) => {
            callback(err, connection);
          });
        }
      },
    });
  }

}
