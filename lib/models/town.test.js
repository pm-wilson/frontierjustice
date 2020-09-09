const fs = require('fs');
const Town = require('./town');
const County = require('./county');
const pool = require('../utils/pool');

describe('Town model', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });

  it('adds a town to the town table', async() => {
    const county = await County.insert(
      {
        name: 'Multnomah',
        state: 'Oregon'
      });

    const town = await Town.insert(
      {
        countyId: county.id, 
        name: 'Bridal Veil', 
        populated: true, 
        founded: 1886, 
        class: 'D', 
        img: null, 
        notes: null, 
      });

    const { rows } = await pool.query('SELECT * FROM towns WHERE id=$1', [town.id]
    );

    expect(rows[0]).not.toBeUndefined();
    expect(town).toEqual({
      id: expect.any(String),
      countyId: county.id, 
      name: 'Bridal Veil', 
      populated: true, 
      founded: 1886, 
      class: 'D', 
      img: null, 
      notes: null,
    });
  });
});
