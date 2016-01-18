/**
 * Created by hhu on 2016/1/18.
 */

angular.module('util', [])

  .factory('Util', function() {
    return {

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
      }

    }
  });

