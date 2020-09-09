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

    it('finds a county by id', async () => {
      const county = await County.insert(
        {
          name: 'Multnomah',
          state: 'Oregon'
        });





        
    });
  });
});
