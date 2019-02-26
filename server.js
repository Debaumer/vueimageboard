// this is the server
const express = require("express");
const app = express();
const db = require("./db");
app.use(express.static("./public"));

app.get("/imgpath", (req, res) => {
    console.log("you did it");
    db.getAll()
        .then(data => {
            res.json(data.rows);
        })
        .catch(err => {
            console.log(err);
        });
});

app.listen(8080, () => console.log("SERVER ONLINE"));
