const pool = require('../utils/pool');
const County = require('./county');

class Town {
  id;
  countyId;
  name;
  populated;
  founded;
  class;
  img;
  notes;

  constructor(row) {
    this.id = String(row.id);
    this.countyId = String(row.county_id);
    this.name = row.name;
    this.populated = row.populated;
    this.founded = row.founded;
    this.class = row.class;
    this.img = row.img;
    this.notes = row.notes;
  }

  static async insert(town) {
    const { rows } = await pool.query(
      'INSERT INTO towns (county_id, name, populated, founded, class, img, notes) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [town.countyId, town.name, town.populated, town.founded, town.class, town.img, town.notes]
    );

    return new Town(rows[0]);
  }

  static async findByCounty(countyId) {
    const { rows } = await pool.query(
      'SELECT * FROM towns WHERE county_id = $1',
      [countyId]
    );

    return rows.map(row => new Town(row));
  }
}

module.exports = Town;
