// this is the server
const express = require("express");
const app = express();
const db = require("./db");
app.use(express.static("./public"));
var multer = require("multer");
var uidSafe = require("uid-safe");
var path = require("path");

app.use(express.static(__dirname + "/public"));

var diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.origionalname));
        });
    }
});

var uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});

app.post("/upload", uploader.single("file"), function(req, res) {
    if (req.file) {
        res.json({
            success: true
        });
    } else {
        res.json({
            success: false
        });
    }
});

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

app.listen(process.env.PORT || 8080, () => console.log("SERVER ONLINE"));
