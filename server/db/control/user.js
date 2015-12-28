/**
 * Created by hhu on 2015/12/28.
 */

//require('express-mongoose')
var User = require('../model/user.js');


module.exports = {

  GetAll: function (req, res) {
    var result = User.find();
    res.send(result);
  },

  Get: function (req, res) {
    if (req.params && req.params.uid) {
      var result = User.find({name: req.params.uid});
      res.send(result);
    }
  },

  Add: function(req, res){
    var name = '', password = '',icon='';
    if (req.params){
      name = req.params.name;
      password = req.params.password;
      icon = req.params.icon;
    }

    User.create({name: name, password: password, icon: icon}, function (err, raw) {
      if (err) return console.error(err);
      res.send('add user success: ', raw);
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

    User.update(conditions, fields, options,function (err, raw) {
      if (err) return console.error(err);
      res.send('update user success: ', raw);
    });
  },
}
