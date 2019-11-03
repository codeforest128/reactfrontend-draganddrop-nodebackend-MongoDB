var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var assert = require('assert');

var url = 'mongodb://localhost:27017/test';

router.post('/', function(req,res, next) {
    console.log("upload function is started", req.body);
    let data = req.body;

    mongo.connect(url, function(err, db) {
        assert.equal(null, err);
        db.collection("experiment-data").insertOne(data, function(err, result){ 
            assert.equal(null, err);
            console.log('Item inserted');
            res.send('success');
            db.close();
        });
    });
});

module.exports = router;