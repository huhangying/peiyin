/**
 * Created by hhu on 2016/1/11.
 */

//require('express-mongoose')
var Tag = require('../model/tag.js');


module.exports = {

  GetAll: function (req, res) {

    var result = Tag.find()
      .exec(function (err, items) {
        if (!items)
          return res.send('null');
        res.json(items);
      });
  },

  Get: function (req, res) {
    if (req.params && req.params.cat) {
      var result = Tag.find({cat: req.params.cat})
        .sort({order: 1})
        .exec(function (err, items) {
          if (!items)
            return res.send('null');
          res.json(items);
        });

    }
  },

  Add: function(req, res){
    var tag = req.body;

    Tag.create(tag, function (err, raw) {
      if (err) return console.error(err);
      res.send('add tag success: ', raw);
    });
  },

  AddFake: function(req, res){
    var tag = {
      cat: req.params.cat,
      tag: req.params.tag,
      order: req.params.order
    };

    //console.log(JSON.stringify(tag))

    Tag.create(tag, function (err, raw) {
      if (err) return console.error(err);
      res.send('add tag success: ', raw);
    });
  },

}
