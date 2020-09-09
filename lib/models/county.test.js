const fs = require('fs');
const County = require('./county');
const pool = require('../utils/pool');

describe('County model', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });

  it('adds a county to the county table', async() => {
    const county = await County.insert(
      {
        name: 'Multnomah',
        state: 'Oregon'
      });

    const { rows } = await pool.query('SELECT * FROM counties');

    expect(county).toEqual(rows[0]);
  });

  it('finds all counties', async() => {
    await Promise.all([
      County.insert({
        name: 'King',
        state: 'Washington'
      }),
      County.insert({
        name: 'Multnomah',
        state: 'Oregon'
      })
    ]);

    const counties = await County.find();

    expect(counties).toEqual(expect.arrayContaining([
      {
        id: expect.any(String),
        name: 'King',
        state: 'Washington'
      }, {
        id: expect.any(String),
        name: 'Multnomah',
        state: 'Oregon'
      }
    ]));
  });

  it('finds a county by id', async() => {
    const county = await County.insert(
      {
        name: 'Multnomah',
        state: 'Oregon'
      });

    const foundCounty = await County.findById(county.id);
    expect(foundCounty).toEqual(county);  
  });

  it('can update a county with the update method', async() => {
    const county = await County.insert({
      name: 'King', 
      state: 'Washington'
    });

    const updatedCounty = await County.update(county.id, {
      name: 'Multnomah',
      state: 'Oregon'
    });

    expect(updatedCounty).toEqual({
      ...county, 
      name: 'Multnomah',
      state: 'Oregon'
    });
  });

  it('deletes a county with the delete method', async() => {
    await County.insert({
      name: 'King',
      state: 'Washington'
    });

    const county = await County.insert({
      name: 'Multnomah',
      state: 'Oregon'
    });

    const deletedCounty = await County.delete(county.id);
    expect(deletedCounty).toEqual(county);

    const foundCounty = await County.findById(county.id);
    expect(foundCounty).toBeNull();

    const counties = await County.find();
    expect(counties).toEqual([
      { id: expect.any(String), name: 'King', state:'Washington' }
    ]);
  });
});
