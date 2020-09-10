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

    const foundCounty = await request(app)
      .get('/api/v1/counties/1')
      .send(idToFind);

    expect(foundCounty.body).toEqual(
      {
        'id': '1',
        'name': 'Multnomah',
        'state': 'Oregon'
      }
    );
  });

  it('deletes a county by id via delete method', async() => {
    const createdCounty = await County.insert({
      name: 'Multnomah',
      state: 'Oregon'
    });

    const response = await request(app)
      .delete(`/api/v1/counties/${createdCounty.id}`);

    expect(response.body).toEqual({
      id: createdCounty.id,
      name: 'Multnomah',
      state: 'Oregon'
    });

  });

  it('updates a county by id via PUT', async() => {
    const createdCounty = await County.insert({
      name: 'Multnomah',
      state: 'Oregon'
    });

    const response = await request(app)
      .put(`/api/v1/counties/${createdCounty.id}`)
      .send({ name: 'APPOCALYTPO', state: 'DECAY' });

    expect(response.body).toEqual({
      id: createdCounty.id,
      name: 'APPOCALYTPO',
      state: 'DECAY'
    });
  });

  it('creates a new town via POST', async() => {
    const county = await request(app)
      .post('/api/v1/counties')
      .send({ name: 'Baker', state: 'Oregon' });

    const response = await request(app)
      .post('/api/v1/towns')
      .send({ 
        countyId: county.id,
        name: 'Sumpter',
        populated: true,
        founded: 1889,
        class: 'E',
      });

    expect(response.body).toEqual({
      id: expect.any(String),
      countyId: county.id,
      name: 'Sumpter',
      populated: true,
      founded: 1889,
      class: 'E',
      img: null,
      notes: null
    });
  });

});
