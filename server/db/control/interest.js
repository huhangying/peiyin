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
      Interest.find({uid: req.params.uid})
        //.populate('interests')
        .exec(function (err, interest) {
          if (!interest)
            return res.send('null');
          res.json(interest);
        });

    }
  },

  CheckIfFocus: function(req, res){
    var uid = '', authorid = '';
    if (req.params){
      uid = req.params.uid;
      authorid = req.params.authorid;
    }

    Interest.find({uid: req.params.uid})
      .exec(function (err, interestList) {
        var ret = false;

        if (interestList && interestList.length > 0) {

          interestList[0].interests.forEach(function(interest){
            //console.log(interest)
            if (interest == authorid){
              ret = true;
            }
          });
        }
        //console.log(ret)
        return res.send(ret);
      });
  },

  Add: function(req, res){
    var interest = req.body;
    // interests: 'xyz' => interests: ['xyz']
    interest.interests = interest.interests.split(',');

    Interest.find({uid: interest.uid}).then(function(data){
      if (data == null || data.length < 1){
        Interest.create({uid: interest.uid, interest: interest.interests}, function (err, raw) {
          if (err){
            console.error(err);
            return res.send('error')
          }
          return res.send(raw);
        });
      }
      else { // 已经有关注的人
        var existed_interest = data[0];

        //console.log(JSON.stringify(interest));
        interest.interests.forEach(function(_interest){
          var index = existed_interest.interests.indexOf(_interest);
          if (index < 0) { //找不到！
            existed_interest.interests.push(_interest);
            //console.log(index + ': ' + JSON.stringify(existed_interest.interests));
          }
        });

        // Update it then
        var conditions = {uid: interest.uid};
        var fields     = {interests: existed_interest.interests};
        var options    = {upsert : true};
        //res.send(Video.getTest());
        //Video.update(conditions, update);
        Interest.update(conditions, fields, options,function (err, raw) {
          if (err){
            console.error(err);
            return res.send('error')
          }
          return res.send(raw);
        });
      }
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

  DeleteInterests: function(req, res){
    var interest = req.body;
    // interests: 'xyz' => interests: ['xyz']
    interest.interests = interest.interests.split(',');

    Interest.find({uid: interest.uid}).then(function(data){
      if (data == null || data.length < 1){
          return res.send('error')
      }
      else { // 已经有关注的人
        var existed_interest = data[0];

        interest.interests.forEach(function(_interest){
          //console.log(JSON.stringify(interest));

          var index = existed_interest.interests.indexOf(_interest);
          if (index >= 0) { //找到！
            existed_interest.interests.splice(index, 1);
            //console.log(index + ': ' + JSON.stringify(existed_interest.interests));
          }
        });

        // Update it then
        var conditions = {uid: interest.uid};
        var fields     = {interests: existed_interest.interests};
        var options    = {upsert : true};
        //res.send(Video.getTest());
        //Video.update(conditions, update);
        Interest.update(conditions, fields, options,function (err, raw) {
          if (err){
            console.error(err);
            return res.send('error')
          }
          res.send('删除关注 success: ', raw);
        });
      }
    });
  },

}
