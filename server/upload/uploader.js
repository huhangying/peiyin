/**
 * Created by hhu on 2015/12/3.
 */

var formidable = require('formidable'),
  util = require('util'),
  fs = require('fs'),
  sprintf = require("sprintf-js").sprintf;
sleep= function(milliSecond) {
  var startTime = new Date().getTime();
  console.log(startTime);
  while(new Date().getTime() <= milliSecond + startTime) {
  }
  console.log(new Date().getTime());
}

module.exports = {

  receiveFile: function(req, res){
    // parse a file upload
    var form = new formidable.IncomingForm();
    form.encoding = 'utf-8';
    //form.keepExtensions = true;
    //form.uploadDir = "/home/wwwroot/product.geiliyou.com/ciwen/upload";

    form.parse(req, function(err, fields, files) {

      res.writeHead(200, {'content-type': 'text/plain'});
      //res.write('received upload:\n\n');
      res.end(util.inspect({fields: fields, files: files}));

      //fs.rename 类似于 move
      fs.rename(files.file.path, 'upload/' + files.file.name, function(err) {
        if (err) throw err;
      });
    });
    return;
  },

  receiveIconFile: function(req, res){
    // parse a file upload
    var form = new formidable.IncomingForm();
    form.encoding = 'utf-8';
    //form.keepExtensions = true;
    //form.uploadDir = "/home/wwwroot/product.geiliyou.com/ciwen/upload";

    form.parse(req, function(err, fields, files) {

      res.writeHead(200, {'content-type': 'text/plain'});
      //res.write('received upload:\n\n');
      res.end(util.inspect({fields: fields, files: files}));

      //fs.rename 类似于 move
      fs.rename(files.file.path, 'icons/' + files.file.name, function(err) {
        if (err) throw err;
      });
    });
    return;
  },

  uploaded: function(req, res, next){
    if (!req.body) return res.sendStatus(400);

    var name = req.body.name;
    var count = req.body.count;

    // 如果源视频没有相应的分离出来的单声道音频文件存在，则先生成
    fs.exists('../assets/' + name + '.mp3', function( exists ){
      //console.log( exists );

      // 如果单声道的音频文件不存在，从视频中提取音频
      if (!exists){
        cmd = sprintf('ffmpeg -i ../assets/%s.mp4 -vn -ab 64k -ac 1 -y ../assets/%s.mp3', name, name);
        console.log(cmd);
        require('child_process').exec( cmd , function(err, stdout , stderr ) {
          if (err) {
            console.log(stderr);
            res.send('{"return": "error"}');
            return;
          }
        });
      }

    });


    // ffmpeg -i upload/myrecording0.mp3 -i upload/myrecording1.mp3  -filter_complex concat=n=3:v=0:a=1 -vn -y upload/input.m4a

    var multi_audios = '';
    for (var i=0; i<count; i++){
      multi_audios += '-i upload/' + name + i + '.mp3 ';
    }
    //// 生成随机码
    //var token = '';//require('crypto').randomBytes(16);
    //var $chars = 'abcdefghijkmnopqrstuvwxyz0123456789';
    //var maxPos = $chars.length;
    //for (i = 0; i < 16; i++) {
    //  token += $chars.charAt(Math.floor(Math.random() * maxPos));
    //}
    //
    //
    //var cmd = sprintf('ff.bat %s "%s" %s %s', name, multi_audios, count, token);
    //
    //console.log(cmd);
    //require('child_process').exec( cmd , function(err, stdout , stderr ) {
    //  console.log(stdout);
    //  if (err) {
    //    console.log(stderr);
    //    res.send('{"return": "error"}');
    //    return;
    //  }
    //  res.send(sprintf('{"return": "ff%s"}', token));
    //});


        // 音频合成
    cmd = sprintf('ffmpeg %s -filter_complex concat=n=%s:v=0:a=1 -vn -ac 1 -y upload/%s.m4a', multi_audios, count, name);

    console.log(cmd);
    require('child_process').exec( cmd , function(err, stdout , stderr ) {
      if (err) {
        console.log(stderr);
        res.send('{"return": "error"}');
        return;
      }

      cmd = sprintf('ffmpeg -i ../assets/%s.mp3 -i upload/%s.m4a -filter_complex "[0:a][1:a]amerge=inputs=2[aout]" -map "[aout]" -y upload/%s.mp3',
        name, name, name);

      console.log(cmd);
      require('child_process').exec( cmd , function(err, stdout , stderr ) {
        if (err) {
          console.log( stderr );
          res.send('{"return": "error"}');
          return;
        }

        // 生成随机码
        var token = '';//require('crypto').randomBytes(16);
        var $chars = 'abcdefghijkmnopqrstuvwxyz0123456789';
        var maxPos = $chars.length;
        for (i = 0; i < 16; i++) {
          token += $chars.charAt(Math.floor(Math.random() * maxPos));
        }

        // 音视频合成
        cmd = sprintf('ffmpeg -i ../assets/%s.mp4 -i upload/%s.mp3 -c:v copy -c:a copy -map 0:v:0 -map 1:a:0  -y output/%s.mp4', name, name, token);
        //cmd = sprintf('ffmpeg -i ../assets/%s.mp4 -i upload/%s.m4a -c:v copy -c:a aac -strict experimental -map 0:v:0 -map 1:a:0 -y ../output/%s.mp4', name, name, token);
        //cmd = sprintf('ffmpeg -i ../assets/%s.mp4 -i upload/%s.m4a -profile:v high -preset slow -b:v 500k -maxrate 500k -bufsize 1000k -vf scale=-1:480 -threads 0 -codec:a libvo_aacenc -b:a 64k -map 0:v:0 -map 1:a:0 -y ../output/%s.mp4', name, name, token);
        //cmd += sprintf('\r\nFormatFactory "-> Mobile Device" "iPhone&iPad 240p AVC" "FormatFactory "-> Mobile Device" "iPhone&iPad 240p AVC" "C:\\Inetpub\\ftproot\\ciwen\\server\\output\\%s.mp4" "C:\\Inetpub\\ftproot\\ciwen\\server\\output\\ff%s.mp4" /hide', token, token);

        //转码成手机播放的视频格式
        //cmd += sprintf('\nFormatFactory "-> Mobile Device" "iPhone&iPad 240p AVC" "FormatFactory "-> Mobile Device" "iPhone&iPad 240p AVC" "C:\\Inetpub\\ftproot\\ciwen\\server\\output\\%s.mp4" "C:\\Inetpub\\ftproot\\ciwen\\server\\output\\ff%s.mp4" /hide', token, token);
        console.log(cmd);
        require('child_process').exec( cmd , function(err, stdout , stderr ) {
          if (err) {
            console.log(stderr);
            res.send('{"return": "error"}');
            return;
          }
          //转码成手机播放的视频格式
          cmd = sprintf('FormatFactory "-> Mobile Device" "iPhone&iPad 240p AVC" "C:\\Inetpub\\ftproot\\ciwen\\server\\output\\%s.mp4" "C:\\Inetpub\\ftproot\\ciwen\\server\\output\\ff%s.mp4" /hide', token, token);
          console.log(cmd);
          //sleep(1000);
          require('child_process').exec( cmd , function(err, stdout , stderr ) {
            //sleep(5000);
            if (err) {
              console.log(stderr);
              res.send('{"return": "error"}');
              return;
            }

          });
        });

        res.send(sprintf('{"return": "ff%s"}', token));
      });

    });


  },


  showFileUploadForm: function(req, res){
    // show a file upload form
    res.writeHead(200, {'content-type': 'text/html'});
    res.end(
      '<form action="/upload" enctype="multipart/form-data" method="post">'+
      '<input type="text" name="title"><br>'+
      '<input type="file" name="upload" multiple="multiple"><br>'+
      '<input type="submit" value="Upload">'+
      '</form>'
    );
  }
}
