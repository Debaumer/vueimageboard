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

module.exports.insertImages = function insertImages(
    url,
    username,
    title,
    description
) {
    return db.query(
        "INSERT INTO images (url, username, title, description) VALUES($1, $2, $3, $4) RETURNING * ",
        [url, username, title, description]
    );
};
