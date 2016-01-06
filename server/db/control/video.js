/**
 * Created by hhu on 2015/12/24.
 */


//var db = require('../db');
var Video = require('../model/video.js');
var Vote = require('../model/vote.js')


module.exports = {

  getOne: function(req, res){
    if (req.params && req.params.vid){
      var result = Video.find({name: req.params.vid, apply: true});
      Video.find({_id: req.params.vid})
        .populate('author')
        .exec(function (err, videos) {
          if (!videos)
            return res.send('null');
          res.json(videos[0]);
        });
    }
  },
  getAll: function(req, res){
    var type = '';
    if (req.params)
      type = req.params.type;
    Video.find({type: type})
      .populate('author')
      .exec(function (err, videos) {
        if (!videos)
          return res.send('null');
        res.json(videos);
      });
  },

  getAuthorVideos: function(req, res){
    var uid = '';
    if (req.params)
      uid = req.params.uid;
    Video.find({author: uid, type: 0})  // 非源视频
      .populate('author')
      .exec(function (err, videos) {
        if (!videos)
          return res.send('null');
        res.json(videos);
      });
  },

  getAuthorVotedVideos: function(req, res){
    var uid = '';
    if (req.params)
      uid = req.params.uid;

    Vote.find({user: uid})
      .populate('video')
      .exec(function(err, votes){
        if (!votes)
          return res.send('null');
        var videos = [];
        votes.forEach(function(vote) {
          videos.push(vote.video);
        });

        // 深层次的 populate!
        Video.populate(videos, 'author', function(err, _videos){
          res.json(_videos);
        });

      });
  },

  getBrotherVideos: function(req, res){
    var vid = '';
    if (req.params)
      vid = req.params.vid;
    Video.find({type: 0, parent: vid})
      .populate('author')
      .exec(function (err, videos) {
        if (!videos)
          return res.send('null');
        res.json(videos);
      });
  },

  Add: function(req, res){
    var video = req.body;
    //console.log(JSON.stringify(video));
    if (!video) return res.sendStatus(400);

    Video.create(video, function(err, data){
        if (err){
          res.send('error');
          return console.error(err);
        }
        res.json(data);
      });

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

  Vote : function(req, res){
    var vid = '', uid = '';
    if (req.params){
      vid = req.params.vid;
      uid = req.params.uid;
    }

    var conditions = {_id : vid};
    var fields     = {$inc: { vote: 1 }};
    var options    = {upsert : true};
    //res.send(Video.getTest());
    //Video.update(conditions, update);
    Video.update(conditions, fields, options,function (err, raw) {
      if (err) return console.error(err);
      //res.send('video vote success: ', raw);
    });

    conditions = {video : vid, user: uid};
    Vote.update(conditions, fields, options,function (err, raw) {
      if (err) return console.error(err);
      res.send('vote success: ', raw);
    });
  },
  Devote : function(req, res){
    var vid = '', uid = '';
    if (req.params){
      vid = req.params.vid;
      uid = req.params.uid;
    }

    var conditions = {_id : vid};
    var fields     = {$inc: { vote: -1 }};
    var options    = {upsert : true};
    //res.send(Video.getTest());
    //Video.update(conditions, update);
    Video.update(conditions, fields, options,function (err, raw) {
      if (err) return console.error(err);
      //res.send('vote success: ', raw);
    });

    conditions = {video : vid, user: uid};
    Vote.update(conditions, fields, options,function (err, raw) {
      if (err) return console.error(err);
      res.send('vote success: ', raw);
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
