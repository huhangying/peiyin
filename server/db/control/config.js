/**
 * Created by hhu on 2015/12/25.
 */

//require('express-mongoose')
var Config = require('../model/config.js');
var fs = require('fs'),path = require('path');

module.exports = {

  GetAll: function (req, res) {
    var result = Config.find();
    res.send(result);
  },

  Get: function (req, res) {
    if (req.params && req.params.name) {
      var result = Config.findOne({name: req.params.name})
        .exec(function (err, data) {
          if (!data)
            return res.send('');
          res.json(data);
        });
    }
  },

  Add: function(req, res){
    var name = '', value = '';
    if (req.params){
      name = req.params.name;
      value = req.params.value;
    }

    Config.create({name: name, value: value}, function (err, raw) {
      if (err) return console.error(err);
      res.send('add config success: ', raw);
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

    Config.update(conditions, fields, options,function (err, raw) {
      if (err) return console.error(err);
      res.send('update config success: ', raw);
    });
  },

  // 下载文件功能跟config无关，只是暂时放在这里

  DownloadFile: function(req, res){
    var file = '';
    if (req.params){
      file = req.params.file;
    }

    var filePath = path.join(__dirname, '../versions/' + file);
    console.log(filePath)
    var stat = fs.statSync(filePath);

    res.writeHead(200, {
      'Content-Type': 'binary/octet-stream',
      'Content-Length': stat.size
    });

    var readStream = fs.createReadStream(filePath);
    // We replaced all the event handlers with a simple call to readStream.pipe()
    readStream.pipe(res);

  },

}
