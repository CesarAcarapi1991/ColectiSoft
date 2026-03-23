const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  password: "Admin",
  host: "localhost",
  port: 5432,
  database: "seguros_db"
});

module.exports = pool;