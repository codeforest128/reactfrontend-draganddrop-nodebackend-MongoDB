var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var assert = require('assert');

var url = 'mongodb://localhost:27017/test';

router.post('/', function(req,res, next) {
    console.log("updatedata function is started", req.body);
    // var data = { name: "Company Inc", address: "Highway 37" };
    let updatedata = req.body;
    console.log(updatedata._id);
    // var file = JSON.parse(uploadFile);
    // console.log(file);
    // fs.readFile('././package.json', function (err, data) {
    //     if(!err) {
    //         console.log(data.toString());
    //     }
    // });
    mongo.connect(url, function(err, db) {
        assert.equal(null, err);
        var query = { _id: mongo.ObjectID(updatedata._id)};
        // var newvalues = { $set: {category: updatedata.category, id: updatedata.id, name: updatedata.name, version: updatedata.version, base_config:updatedata.base_config, base_commands:updatedata.base_commands } };
        var json = req.body;
        var key = "_id";
        delete json[key];
        var newvalues = { $set: json };
        console.log(json);
        db.collection("server-data").updateOne(query, newvalues, function(err, obj) {
            if (err) throw err;
            console.log("1 document updated");
            res.send('success');
            db.close();
          });
    });
});

module.exports = router;