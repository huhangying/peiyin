/**
 * Created by hhu on 2015/12/24.
 */


//var db = require('../db');
var Video = require('../model/video.js');


module.exports = {

  getOne: function(req, res){
    if (req.params && req.params.vid){
      var result = Video.find({name: req.params.vid});
      Video.find({_id: req.params.vid})
        .populate('comments')
        .exec(function (err, videos) {
          if (!videos)
            return res.send('null');
          res.json(videos);
        });
    }
  },
  getAll: function(req, res){
    Video.find()
      //.populate('comments')
      .exec(function (err, videos) {
        if (!videos)
          return res.send('null');
        res.json(videos);
      });
  },
  Add: function(req, res){
    var vid = '';
    if (req.params)
      vid = req.params.vid;
    var obj = {cat_id: '111',name: '1', desc: 'desc', url: vid};
    //console.log(JSON.stringify(obj));
    Video.create(obj);
    //var video = new Video(obj);

    //video.save();
  },
  Update: function(req, res){
    var vid = '';
    if (req.params)
      vid = req.params.vid;
    var conditions = {name : '1'};
    var fields     = {url : 'ciwen.com', desc : 'some desc',author: vid};
    var options    = {upsert : true};
    //res.send(Video.getTest());
    //Video.update(conditions, update);
    Video.update(conditions, fields, options,function (err, raw) {
      if (err) return console.error(err);
      res.send('update success: ', raw);
    });
  },
  Delete: function(req, res){
    var vid = '';
    if (req.params)
      vid = req.params.vid;
    Video.remove({url: vid}, function(err){
      if (err)
        return console.error(err);
      res.send('removed url=' + vid);
    });

  },
  AddComment: function(req, res){
    var vid = '', cid = '';
    if (req.params){
      cid = req.params.cid;
      vid = req.params.vid;
    }
    var conditions = {_id : vid};
    var fields     = {comments : [cid]};
    var options    = {upsert : true};
    //res.send(Video.getTest());
    //Video.update(conditions, update);
    Video.update(conditions, fields, options,function (err, raw) {
      if (err) return console.error(err);
      res.send('update comment success: ', raw);
    });
  },
}
