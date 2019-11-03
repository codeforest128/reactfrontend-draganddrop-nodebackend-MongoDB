var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var assert = require('assert');

var url = 'mongodb://localhost:27017/test';
/* GET home page. */
router.get('/:id', function(req, res, next) {
    let delid = req.params.id;
    console.log(delid);
    mongo.connect(url, function(err, db) {
        assert.equal(null, err);
        var query = { _id: mongo.ObjectID(delid)};
        db.collection("server-data").deleteOne(query, function(err, obj) {
            if (err) throw err;
            console.log("1 document deleted");
            res.send('success');
            db.close();
          });
    });
});

module.exports = router;
