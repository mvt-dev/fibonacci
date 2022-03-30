import DbModel from './DbModel';

describe('DbModel', () => {

  const dbModel = new DbModel({ database: 'fibonacci' });

  test('Check connection with database', async () => {
    const query = await dbModel.db.raw('select 1+1 as result');
    expect(query.rows[0].result).toBe(2);
  });

});
