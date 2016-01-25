/**
 * Created by hhu on 2015/12/25.
 */

//require('express-mongoose')
var Comment = require('../model/comment.js');
var Video = require('../model/video.js');


module.exports = {

  GetAll: function (req, res) {

    var result = Comment.find()
      .populate('author')
      //.populate('video')
      .exec(function (err, comments) {
        if (!comments)
          return res.send('null');
        res.json(comments);
      });
  },

  Get: function (req, res) {
    if (req.params && req.params.vid) {
      var result = Comment.find({video: req.params.vid})
        .sort({created: -1})
        .populate('author')
        //.populate('video')
        .exec(function (err, comments) {
          if (!comments)
            return res.send('null');
          res.json(comments);
        });

    }
  },

  getMyComments: function (req, res) {
    var uid = '';
    if (req.params && req.params.uid) {
      uid = req.params.uid;

      var vlist = [];
      Video.find({author: uid, type: 0})  // 非源视频
        .exec(function (err, videos) {
          if (!videos || videos.length < 1)
            return res.send('null');

          videos.forEach(function(vid){
            vlist.push(vid._id);
          });

          var result = Comment.find({viewed: false, video: {$in: vlist}})
            .sort({created: -1})
            .populate('author')
            .populate('video')
            //.populate('video')
            .exec(function (err, comments) {
              if (!comments)
                return res.send('null');
              res.json(comments);
            });
        });

    }
  },

  Add: function(req, res){
    var comment = req.body;

    Comment.create({video: comment.video, author: comment.author, comment: comment.comment}, function (err, raw) {
      if (err) return console.error(err);
      res.send('add comment success: ', raw);
    });
  },

}
