const pool = require('../utils/pool');
const Town = require('./town');

class County {
  id;
  name;
  state;

  constructor(row) {
    this.id = row.id;
    this.name = row.name;
    this.state = row.state;
  }

  static async insert(county) {
    const { rows } = await pool.query(
      'INSERT INTO counties (name, state) VALUES ($1, $2) RETURNING *',
      [county.name, county.state]
    );

    return new County(rows[0]);
  }

  static async find() {
    const { rows } = await pool.query(
      'SELECT * FROM counties'
    );

    return rows.map(row => new County(row));
  }

  static async findById(id) {
    const { rows } = await pool.query(
      'SELECT * FROM counties WHERE id=$1', [id]
    );

    if(!rows[0]) return null;
    else return new County(rows[0]);
  }

  static async update(id, updatedCounty) {
    const { rows } = await pool.query(
      `UPDATE counties
      SET name=$1,
          state=$2
      WHERE id=$3
      RETURNING *
      `, 
      [updatedCounty.name, updatedCounty.state, id]
    );

    return new County(rows[0]);
  }

  static async delete(id) {
    const { rows } = await pool.query(
      'DELETE FROM counties WHERE id=$1 RETURNING *',
      [id]
    );
    return new County(rows[0]);
  }

  static async findTowns(countyId) {
    const { rows } = await pool.query(
      'SELECT * FROM towns WHERE county_id = $1',
      [countyId]
    );

    return rows.map(row => new Town(row));
  }

}

module.exports = County;
