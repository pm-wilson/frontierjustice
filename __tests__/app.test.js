const fs = require('fs');
const pool = require('../lib/utils/pool');
const request = require('supertest');
const app = require('../lib/app');
const County = require('../lib/models/county');

describe('frontierjustice routes', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });

  it('creates a new county via POST', async() => {
    const response = await request(app)
      .post('/api/v1/counties')
      .send({ name: 'King', state: 'Washington' });

    expect(response.body).toEqual({
      id: expect.any(String),
      name: 'King', 
      state: 'Washington'
    });
  });

  it('finds all counties via get', async() => {
    await request(app)
      .post('/api/v1/counties')
      .send({ name: 'Multnomah', state: 'Oregon' });

    const allCounties = await request(app)
      .get('/api/v1/counties')
      .send();

    expect(allCounties.body).toEqual([
      {
        'id': '1',
        'name': 'Multnomah',
        'state': 'Oregon'
      }
    ]);
  });

  it('finds a county by id via get', async() => {
    const newCounty = await request(app)
      .post('/api/v1/counties')
      .send({ name: 'Multnomah', state: 'Oregon' });

    const idToFind = newCounty.id;
//check this.
    const foundCounty = await request(app)
      .get('/api/v1/counties/:id')
      .send(idToFind);

    expect(foundCounty.body).toEqual([
      {
        'id': 1,
        'name': 'Multnomah',
        'state': 'Oregon'
      }
    ]);
  });


});
