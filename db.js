//// TODO: create db in postgres, create db queries here
const spicedPg = require('spiced-pg');
const db = spicedPg('postgres:postgres:postgres@localhost:5432/testImages');


console.log(db);

module.exports.getAll = function() {
  const qs = "SELECT * FROM images"
  return db.query(qs);
}
