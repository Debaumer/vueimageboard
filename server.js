// this is the server
const express = require("express");
const app = express();

const db = require("./db");
const s3 = require("./s3");
const s3Url = require("./config");
var bodyparser = require("body-parser");

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

app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

app.post("/upload", uploader.single("file"), s3.upload, function(req, res) {
    // If nothing went wrong the file is already in the uploads directory

    if (req.file) {
        var url = s3Url.s3Url + req.file.filename;

        db.insertImages(
            url,
            req.body.username,
            req.body.title,
            req.body.description
        ).then(data => {
            //console.log("DATA: ", data);
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

app.post("/insert-comment", function(req, res) {
    console.log("req.body", req.body);
    db.insertComment(req.body.username, req.body.comment, req.body.id)
        .then(data => {
            console.log("data rows", data.rows);
        })
        .catch(err => {
            console.log(err);
        });
    res.end();
});

app.post("/get-comments", function(req, res) {
    console.log("reqbodyId", req.body.id);
    db.getComments(req.body.id)
        .then(data => {
            console.log(data);
            res.json(data);
        })
        .catch(err => {
            console.log(err);
        });
});

app.get("/get-count", (req, res) => {
    db.getTotalImg(req.body.id)
        .then(data => {
            console.log(data);
            res.json(data);
        })
        .catch(err => {
            console.log("get count err", err);
        });
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
