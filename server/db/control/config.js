/**
 * Created by hhu on 2015/12/25.
 */

//require('express-mongoose')
var Config = require('../model/config.js');


module.exports = {

  GetAll: function (req, res) {
    var result = Config.find();
    res.send(result);
  },

  Get: function (req, res) {
    if (req.params && req.params.name) {
      var result = Config.find({name: req.params.name});
      res.send(result);
    }
  },

  Add: function(req, res){
    var name = '', value = '';
    if (req.params){
      name = req.params.name;
      value = req.params.value;
    }

    Config.create({name: name, value: value}, function (err, raw) {
      if (err) return console.error(err);
      res.send('add config success: ', raw);
    });
  },

  Update: function(req, res){
    var name = '', value = '';
    if (req.params){
      name = req.params.name;
      value = req.params.value;
    }

    var conditions = {name :name};
    var fields     = {value : value};
    var options    = {};

    Config.update(conditions, fields, options,function (err, raw) {
      if (err) return console.error(err);
      res.send('update config success: ', raw);
    });
  },
}
