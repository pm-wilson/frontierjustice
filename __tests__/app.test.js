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
});
