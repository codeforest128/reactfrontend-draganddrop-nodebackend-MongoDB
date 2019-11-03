var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var assert = require('assert');

var url = 'mongodb://localhost:27017/test';

router.post('/', function(req,res, next) {
    console.log("upload function is started", req.body);
    // var data = { name: "Company Inc", address: "Highway 37" };
    let uploadFile = req.body;

    // var file = JSON.parse(uploadFile);
    // console.log(file);
    // fs.readFile('././package.json', function (err, data) {
    //     if(!err) {
    //         console.log(data.toString());
    //     }
    // });
    mongo.connect(url, function(err, db) {
        assert.equal(null, err);
        db.collection("server-data").insertOne(uploadFile, function(err, result){ 
            assert.equal(null, err);
            console.log('Item inserted');
            res.send('success');
            db.close();
        });
    });
});

module.exports = router;