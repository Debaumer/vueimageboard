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

module.exports.getTotalImg = function getTotal() {
    return db.query(`SELECT COUNT(*) from images`);
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

module.exports.uploadComments = function uploadComments(username, comment, id) {
    return db.query(
        `INSERT INTO comments(username, comment, image_id) VALUES ($1, $2, $3) RETURNING *`,
        [username, comment, id]
    );
};

module.exports.getComments = function getComments(id) {
    return db.query(`SELECT * FROM comments WHERE image_id = $1`, [id]);
};
