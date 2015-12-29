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
    if (req.params && req.params.cell) {
      var result = User.find({cell: req.params.cell, apply: true});
      res.send(result);
    }
  },

  Add: function(req, res){
    // 获取user数据（json）
    var user = req.body;
    if (!user) return res.sendStatus(400);

    //验证手机号码
    if (!user.cell){
      res.send('error');
      return;
    }

    User.find({cell: user.cell, apply: true}) // check if registered
      .exec(function(err, users){
        if (err) {
          res.send('error');
          return;
        }
        if (users && users.length > 0){
          res.send('existed');
          return;
        }

        User.create({cell: user.cell, name: user.name, password: user.password}, function (err, raw) {
          if (err) return console.error(err);
          res.send(raw);
        });

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

    User.update(conditions, fields, options, function (err, raw) {
      if (err) return console.error(err);
      res.send('update user success: ', raw);
    });
  },
}

