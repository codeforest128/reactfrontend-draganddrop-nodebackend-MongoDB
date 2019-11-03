var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var assert = require('assert');

var url = 'mongodb://localhost:27017/test';
/* GET home page. */
router.get('/', function(req, res, next) {
    mongo.connect(url, function(err, db) {
        assert.equal(null, err);
        db.collection("server-data").find({}).toArray(function(err, result){ 
            assert.equal(null, err);
            console.log('get data');
            res.json(result);
            db.close();
        });
    });
});

module.exports = router;
