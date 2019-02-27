// this is the server
const express = require("express");
const app = express();

const db = require("./db");
const s3 = require("./s3");
const s3Url = require("./config");

var multer = require("multer");
var uidSafe = require("uid-safe");
var path = require("path");

var diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

var uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});

app.use(express.static("./public"));

app.post("/upload", uploader.single("file"), s3.upload, function(req, res) {
    // If nothing went wrong the file is already in the uploads directory

    console.log("req.file", req.file);
    console.log("req.body", req.body);

    if (req.file) {
        var url = s3Url.s3Url + req.file.filename;

        console.log("url", url);

        db.insertImages(
            url,
            req.body.username,
            req.body.title,
            req.body.description
        ).then(data => {
            console.log("DATA: ", data);
            // INSERT title, description, username the full s3 url and the filename
            res.json(data.rows);
            //console log data, see if stuff is there, and once it looks good, chain a then response to axios
        });
    } else {
        res.json({
            success: false
        });
    }
});

app.get("/imgpath", (req, res) => {
    db.getAll()
        .then(data => {
            res.json(data.rows);
        })
        .catch(err => {
            console.log(err);
        });
});

app.listen(process.env.PORT || 8080, () => console.log("SERVER ONLINE"));
