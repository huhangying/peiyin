angular.module('starter.services', [])

.factory('Videos', function($http, $q){
  var videos = [];

  return {

    all: function(type){
      var deferred = $q.defer(); // 声明延后执行，表示要去监控后面的执行
      $http.get('http://182.92.230.67:33445/videos/' + type)
        .success(function(data, status, headers, config){
          //videos = data;
          deferred.resolve(data);  // 声明执行成功，即http请求数据成功，可以返回数据了
        })
        .error(function(data, status, headers, config){
          deferred.reject(data);   // 声明执行失败，即服务器返回错误
        });
      return deferred.promise;   // 返回承诺，这里并不是最终数据，而是访问最终数据的API
    },

    remove: function(video) {
      videos.splice(videos.indexOf(video), 1);
    },

    get: function(vid) {
      var deferred = $q.defer(); // 声明延后执行，表示要去监控后面的执行
      $http.get('http://182.92.230.67:33445/video/' + vid)
        .success(function(data, status, headers, config){
          deferred.resolve(data);  // 声明执行成功，即http请求数据成功，可以返回数据了
        })
        .error(function(data, status, headers, config){
          deferred.reject(data);   // 声明执行失败，即服务器返回错误
        });
      return deferred.promise;   // 返回承诺，这里并不是最终数据，而是访问最终数据的API
    },

    add: function(video){
      Object.toParams = function ObjecttoParams(obj) {
        var p = [];
        for (var key in obj) {
          p.push(key + '=' + encodeURIComponent(obj[key]));
        }
        return p.join('&');
      };

      var deferred = $q.defer(); // 声明延后执行，表示要去监控后面的执行
      $http.post('http://182.92.230.67:33445/video', Object.toParams(video), {
          dataType: 'json',
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        })
        .success(function(data, status, headers, config){
          deferred.resolve(data);  // 声明执行成功，即http请求数据成功，可以返回数据了
        })
        .error(function(data,status, headers, config){
          alert('error' + status)
          deferred.reject(data);   // 声明执行失败，即服务器返回错误
        });
      return deferred.promise;   // 返回承诺，这里并不是最终数据，而是访问最终数据的API
    },

    getCommentsByVid: function (vid){

      var deferred = $q.defer(); // 声明延后执行，表示要去监控后面的执行
      $http.get('http://182.92.230.67:33445/comment/' + vid)
        .success(function(data, status, headers, config){
          deferred.resolve(data);  // 声明执行成功，即http请求数据成功，可以返回数据了
        })
        .error(function(data, status, headers, config){
          deferred.reject(data);   // 声明执行失败，即服务器返回错误
        });
      return deferred.promise;   // 返回承诺，这里并不是最终数据，而是访问最终数据的API
    },

    addComment: function (comment){
      var deferred = $q.defer(); // 声明延后执行，表示要去监控后面的执行
      $http.post('http://182.92.230.67:33445/comment',Object.toParams(comment), {
          dataType: 'json',
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        })
        .success(function(data, status, headers, config){
          deferred.resolve(data);  // 声明执行成功，即http请求数据成功，可以返回数据了
        })
        .error(function(data,status, headers, config){
          deferred.reject(data);   // 声明执行失败，即服务器返回错误
        });
      return deferred.promise;   // 返回承诺，这里并不是最终数据，而是访问最终数据的API
    },

    vote: function(vid){
      $http.get('http://182.92.230.67:33445/vote/' + vid)
        .success(function(data, status, headers, config){
        })
        .error(function(data, status, headers, config){
        });
    }

  }
})

  .factory('Users', function($http, $q) {
    var users = [];

    return {

      all: function () {
        var deferred = $q.defer(); // 声明延后执行，表示要去监控后面的执行
        $http.get('http://182.92.230.67:33445/user')
          .success(function (data, status, headers, config) {
            //videos = data;
            deferred.resolve(data);  // 声明执行成功，即http请求数据成功，可以返回数据了
          })
          .error(function (data, status, headers, config) {
            deferred.reject(data);   // 声明执行失败，即服务器返回错误
          });
        return deferred.promise;   // 返回承诺，这里并不是最终数据，而是访问最终数据的API
      },
    }
  })

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: '地球1小时',
    lastText: '内容简介1',
    url: 'http://101.200.81.99:8080/ciwen/assets/shutdown1h.mp4',
    file_no_ext: 'shutdown1h',
    face: 'img/shutdown1h.JPG'
  }, {
    id: 1,
    name: '长留冰红茶',
    lastText: '内容简介2',
    url: 'http://101.200.81.99:8080/ciwen/assets/icetea.mp4',
    file_no_ext: 'icetea',
    face: 'img/icetea.JPG'
  }, {
    id: 2,
    name: '爱护公物',
    lastText: '内容简介3',
    url: 'http://101.200.81.99:8080/ciwen/assets/takecare.mp4',
    file_no_ext: 'takecare',
    face: 'img/takecare.JPG'
  }, {
    id: 3,
    name: '花千骨2015 MV',
    lastText: '内容简介4!',
    url: 'http://101.200.81.99:8080/ciwen/assets/mv_hjg.mp4',
    file_no_ext: 'mv_hjg',
    face: 'img/mv_hqg.jpg'
  }, {
    id: 4,
    name: '花千骨2015 MV 片段',
    lastText: '内容简介5',
    url: 'http://101.200.81.99:8080/ciwen/assets/mvtest.mp4',
    file_no_ext: 'mvtest',
    face: 'img/mv_hqg.jpg'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
});



// FUNCTIONS


