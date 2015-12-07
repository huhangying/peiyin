/**
 * Created by hhu on 2015/12/3.
 */

var sprintf = require("sprintf-js").sprintf;

module.exports = {

  // 返回一个播放器的页面
  load: function(req, res){
    if (req.params && req.params.vid){
      res.writeHeader(200, {'content-type': 'text/html;charset=utf-8'});

      res.end('<!DOCTYPE html>' +
        '<html lang="en">' +
        '<head>'+
        '<title>播放器</title>' +
        '<meta charset="UTF-8">' +
        '<meta name="viewport" content="initial-scale=1, maximum-scale=1, user-scalable=no, width=device-width">' +
        '<link href="http://101.200.81.99/lib/video.js/video-js.min.css" rel="stylesheet" type="text/css">'+
        '<script src="http://101.200.81.99/lib/video.js/video.min.js"></script>' +
        '<script>function play(){videojs("my_video").play();}</script>' +
        '</head>' +
        '<body onload="play()">'+
        '<video class="video-js vjs-default-skin vjs-big-play-centered" id="my_video"'+
        'controls preload="auto" style="width:100%;"'+
        'poster="http://video-js.zencoder.com/oceans-clip.png"' +
        'data-setup=\'{"example_option":true}\'> '+
        '<source src="http://101.200.81.99:8080/ciwen/output/' + req.params.vid + '.mp4" type="video/mp4">' +
        '</video>' +
        '</body>' +
        '</html>'
      );
    }

  }
}
