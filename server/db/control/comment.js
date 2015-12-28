/**
 * Created by hhu on 2015/12/25.
 */

//require('express-mongoose')
var Comment = require('../model/comment.js');


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

  Add: function(req, res){
    var comment = req.body;

    Comment.create({video: comment.video, author: comment.author, comment: comment.comment}, function (err, raw) {
      if (err) return console.error(err);
      res.send('add comment success: ', raw);
    });
  },

}
