/**
 * Created by hhu on 2015/12/25.
 */

//require('express-mongoose')
var Comment = require('../model/comment.js');


module.exports = {

  GetAll: function (req, res) {
    var result = Comment.find();
    res.send(result);
  },

  Get: function (req, res) {
    if (req.params && req.params.vid) {
      var result = Comment.find({video_id: req.params.vid});
      res.send(result);
    }
  },

  Add: function(req, res){
    var video_id='', title = '', content = '';
    if (req.params){
      video_id = req.params.vid;
      title = req.params.title;
      content = req.params.content;
    }

    Comment.create({video_id: video_id, title: title, comment: content}, function (err, raw) {
      if (err) return console.error(err);
      res.send('add comment success: ', raw);
    });
  },

}
