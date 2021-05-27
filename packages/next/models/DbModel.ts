import { types } from 'pg';
import { knex, Knex } from 'knex';
import moment from 'moment';
import knexStringcase from 'knex-stringcase';

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
    database = process.env.DB_DATABASE,
    host = process.env.DB_HOST,
    user = process.env.DB_USER,
    password = process.env.DB_PASSWORD,
    port = Number(process.env.DB_PORT),
  }: PgConnection) {
    types.setTypeParser(types.builtins.DATE, value => value && moment.utc(value));
    types.setTypeParser(types.builtins.TIMESTAMP, value => value && moment.utc(value));
    this.db = knex(knexStringcase({
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
    }));
  }

}
