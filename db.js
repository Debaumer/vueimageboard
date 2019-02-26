//// TODO: create db in postgres, create db queries here
const spicedPg = require("spiced-pg");
const db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/testImages"
);

module.exports.getAll = function() {
    const qs = "SELECT * FROM images";
    return db.query(qs);
};
