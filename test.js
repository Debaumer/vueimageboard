const s3Request = client.put(req.file.filename, {
    "Content-Type": req.file.mimetype,
    "Content-Length": req.file.size,
    "x-amz-acl": "public-read"
});
