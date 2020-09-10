const pool = require('../utils/pool');

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

  static async update(updatedTownId, updatedTown) {
    const { rows } = await pool.query(
      `UPDATE towns
          SET county_id = $1,
              name = $2,
              populated = $3,
              founded = $4,
              class = $5,
              img = $6,
              notes = $7
          WHERE id = $8
          RETURNING *`,
      [updatedTown.countyId, updatedTown.name, updatedTown.populated, updatedTown.founded, updatedTown.class, updatedTown.img, updatedTown.notes, updatedTownId]
    );

    return new Town(rows[0]);
  }

  static async delete(id) {
    const { rows } = await pool.query(
      'DELETE FROM towns WHERE id = $1 RETURNING *',
      [id]
    );

    return new Town(rows[0]);
  }

  static async find() {
    const { rows } = await pool.query(
      'SELECT * FROM towns'
    );

    return rows.map(row => new Town(row));
  };

  static async findById(id) {
    const { rows } = await pool.query(
      'SELECT * FROM towns WHERE id=$1', [id]
    );

    if(!rows[0]) return null;
    else return new Town(rows[0]);
  };
}

module.exports = Town;
