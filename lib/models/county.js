const pool = require('../utils/pool');

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



}

module.exports = County;
