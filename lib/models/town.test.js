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

  it('updates a town using update', async() => {
    const county = await County.insert(
      {
        name: 'Klickitat',
        state: 'Washington'
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

    const updatedTown = await Town.update(town.id,
      {
        countyId: county.id,
        name: 'Bridal Veil2',
        populated: false,
        founded: 1886,
        class: 'A',
        img: null,
        notes: 'Everything gone',
      });

    expect(updatedTown).toEqual({
      ...town,
      name: 'Bridal Veil2',
      populated: false,
      class: 'A',
      notes: 'Everything gone',
    });
  });

  it('deletes a town from the database', async() => {

    const county = await County.insert(
      {
        name: 'Multnomah',
        state: 'Oregon'
      });

    const town = await Town.insert(
      {
        countyId: county.id,
        name: 'Town to Delete',
        populated: true,
        founded: 1886,
        class: 'D',
        img: null,
        notes: null,
      });

    const town2 = await Town.insert(
      {
        countyId: county.id,
        name: 'Bridal Veil',
        populated: true,
        founded: 1886,
        class: 'D',
        img: null,
        notes: null,
      });

    const deletedTown = await Town.delete(town.id);

    expect(deletedTown).toEqual(town);

    const foundTowns = await County.findTowns(county.id);

    expect(foundTowns).toEqual([town2]);
  });
});
