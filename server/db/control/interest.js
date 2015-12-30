/**
 * Created by hhu on 2015/12/30.
 */

var Interest = require('../model/interest.js');


module.exports = {

  GetAll: function (req, res) {

    var result = Interest.find()
      .populate('interests')
      //.populate('video')
      .exec(function (err, interest) {
        if (!interest)
          return res.send('null');
        res.json(interest);
      });
  },

  Get: function (req, res) {
    if (req.params && req.params.uid) {
      var result = Interest.find({uid: req.params.uid})
        .populate('interests')
        .exec(function (err, interest) {
          if (!interest)
            return res.send('null');
          res.json(interest);
        });

    }
  },

  Add: function(req, res){
    var interest = req.body;

    Interest.create({user: interest.uid, interest: interest.interests}, function (err, raw) {
      if (err) return console.error(err);
      res.send('关注 success: ', raw);
    });
  },

  QueryAdd: function(req, res){
    var uid = '', iid = '';
    if (req.params){
      uid = req.params.uid;
      iid = req.params.iid;
    }

    Interest.create({uid: uid, interests:[iid]}, function (err, raw) {
      if (err) return console.error(err);
      res.send('关注 success success: ', raw);
    });
  },

  Delete: function(req, res){
    if (req.params && req.params.uid) {
      var result = Interest.remove({uid: req.params.uid})
        .exec(function (err, raw) {
          if (!raw)
            return res.send('null');
          res.send('删除关注 success: ', raw);
        });
    }
  },

}
