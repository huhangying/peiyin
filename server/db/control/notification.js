/**
 * Created by hhu on 2016/1/14.
 */

var Notification = require('../model/notification.js');


module.exports = {

  // 取最近的一个消息
  Get: function (req, res) {
    var result = Notification.find()
        .sort({updated: -1})
        .limit(1)
        .exec(function (err, items) {
          if (!items || items.length < 1)
            return res.send('null');
          res.json(items[0]);
        });
  },

  Add: function(req, res){
    var not = req.body;

    Notification.create(not, function (err, raw) {
      if (err) return console.error(err);
      res.send('add notification success: ', raw);
    });
  },

  AddFake: function(req, res){
    var not = {
      title: req.params.title,
      text: req.params.text,
    };

    //console.log(JSON.stringify(not))

    Notification.create(not, function (err, raw) {
      if (err) return console.error(err);
      res.send('add tag success: ', raw);
    });
  },

}
