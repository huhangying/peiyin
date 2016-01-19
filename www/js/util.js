/**
 * Created by hhu on 2016/1/18.
 */

angular.module('util', [])

  .factory('Util', function() {
    return {

      //++++++++++++++++++++++++++++++++++++++++++++++++++++++
      // 公用函数
      //++++++++++++++++++++++++++++++++++++++++++++++++++++++

      videoHeight: function(){
        var winWidth = 0;
        //获取窗口宽度
        if (window.innerWidth)
          winWidth = window.innerWidth;
        else if ((document.body) && (document.body.clientWidth))
          winWidth = document.body.clientWidth;
        //通过深入Document内部对body进行检测，获取窗口大小
        if (document.documentElement && document.documentElement.clientHeight && document.documentElement.clientWidth){
          winWidth = document.documentElement.clientWidth;
        }
        return winWidth * 9 / 16;
      },

      object2Params: function (obj) {
        var p = [];
        for (var key in obj) {
          p.push(key + '=' + encodeURIComponent(obj[key]));
        }
        return p.join('&');
      },

      randomId: function(){
        // 生成随机码
        var token = '';//require('crypto').randomBytes(16);
        var $chars = 'abcdefghijkmnopqrstuvwxyz0123456789';
        var maxPos = $chars.length;
        for (i = 0; i < 16; i++) {
          token += $chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return token;
      },

    }
  });

