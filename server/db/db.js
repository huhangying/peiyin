/**
 * Created by hhu on 2015/12/24.
 */

var express = require("express");
var http = require('http');
var app = express();

var bodyParser = require('body-parser');
//通常 POST 内容的格式是 application/x-www-form-urlencoded, 因此要用下面的方式来使用
var urlencodedParser = bodyParser.urlencoded({ extended: false })


global.mongoose = require('mongoose');
require('express-mongoose')
global.mongoose.connect('mongodb://182.92.230.67:27017/chang');

//var db = global.mongoose.connect;
//db.on('error', console.error.bind(console, '数据库连接失败:'));
//db.once('open', function() {
//  console.log("数据库连接成功");
//});


var Video = require('./control/video');
var Config = require('./control/config');
var Comment = require('./control/comment');


var router = express.Router();
// REST API
router.route('/video')
  .get(Video.getAll);
router.route('/video/add/:vid')
  .get(Video.Add);
router.route('/video/update/:vid')
  .get(Video.Update);
router.route('/video/delete/:vid')
  .get(Video.Delete);
router.route('/video/addcomment/:vid/:cid')
  .get(Video.AddComment);

router.route('/config')
  .get(Config.GetAll);
router.route('/config/:name')
  .get(Config.Get);
router.route('/config/add/:name/:value')
  .get(Config.Add);
router.route('/config/update/:name/:value')
  .get(Config.Update);

router.route('/comment')
  .get(Comment.GetAll);
router.route('/comment/:vid')
  .get(Comment.Get);
router.route('/comment/add/:vid/:title/:content')
  .get(Comment.Add);



app.use('/', router);

http.createServer(app).listen(33445, function(){
  console.log("DB服务器开启. 监听端口: 33445...")
});
