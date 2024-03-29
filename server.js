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
            res.json(data.rows);
        });
    } else {
        res.json({
            success: false
        });
    }
});

app.post("/insert-comment", function(req, res) {
    db.insertComment(req.body.username, req.body.comment, req.body.id)
        .then(data => {
            res.json(data);
        })
        .catch(err => {
            console.log(err);
        });
});

app.post("/get-comments", function(req, res) {
    db.getComments(req.body.id)
        .then(data => {
            res.json(data);
        })
        .catch(err => {
            console.log(err);
        });
});

app.post("/recent-comments", function(req, res) {
    db.getRecentComments(req.body.id)
        .then(data => {
            res.json(data);
        })
        .catch(err => {
            console.log(err);
        });
});

app.post("/getImage", (req, res) => {
    console.log(req.body.image);
    db.getImage(req.body.image)
        .then(data => {
            res.json(data.rows[0]);
        })
        .catch(err => {
            console.log(err);
        });
});

app.get("/get-count", (req, res) => {
    db.getTotalImg(req.body.id)
        .then(data => {
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

app.get("/get-img-hash/:id", (req, res) => {
    let id = req.params.id;

    db.getImageId(id)
        .then(data => {
            res.json(data.rows);
            console.log("IMG-DATA", data);
        })
        .catch(err => {
            console.log("ERROR in GET /images/:id", err);
        });
});

app.post("/load-more", (req, res) => {
    db.getMore(req.body.id)
        .then(data => {
            for (var i = 0; i < data.rows.length; i++) {
                console.log("created at", data.rows[i]["created_at"]);
            }
            res.json(data);
        })
        .catch(err => {
            console.log(err);
        });

    // db.getRecentComments(req.body.id)
    //     .then(data => {
    //         console.log("recent comments", data.rows);
    //     })
    //     .catch(err => {
    //         console.log(err);
    //     });
});

app.listen(process.env.PORT || 8080, () => console.log("SERVER ONLINE"));
