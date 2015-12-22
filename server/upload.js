/**
 * 提供同数据库交互的APIs：
 *    - 用户注册
 *    - 视频内容管理
 *    - 投票和评论
 * Created by hhu on 2015/11/13
 */

var express = require('express');
var http = require('http');
var path = require('path');
var app = express();
//app.set('views', path.join(__dirname, 'views'));
//app.set("view engine","ejs");
//app.use(express.static(__dirname + '/static'));
//设置跨域访问
app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By",' 3.2.1')
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});

var bodyParser = require('body-parser');
//通常 POST 内容的格式是 application/x-www-form-urlencoded, 因此要用下面的方式来使用
var urlencodedParser = bodyParser.urlencoded({ extended: false })
// parse application/json
var jsonParser = bodyParser.json()


var Uploader = require('./uploader');
var Player = require('./player');

// 设置URL路由

////ejs的路由
//app.get('/play/:vid', function(req, res){
//  res.render('player', {vid: req.params.vid, title: 'tttt'});
//});

var router = express.Router();
// REST API
router.route('/upload')
  .get(Uploader.showFileUploadForm)
  .post(Uploader.receiveFile);
router.route('/uploaded')
  .post(urlencodedParser, Uploader.uploaded);
router.route('/player/:vid')
  .get(Player.videoTemplate);
router.route('/video/:vid')
  .get(Player.videoPlayer);


app.use('/', router);


// 启动服务器
http.createServer(app).listen(8888,function(){
  console.log("CIWEN媒体处理及上传服务器开启. 监听端口: 8888...")
});



