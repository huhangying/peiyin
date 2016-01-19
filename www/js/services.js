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

    getByTag: function(type, tag){
      var deferred = $q.defer(); // 声明延后执行，表示要去监控后面的执行
      $http.get('http://182.92.230.67:33445/videos/tag/'+ type + '/' + tag)
        .success(function(data, status, headers, config){
          //videos = data;
          deferred.resolve(data);  // 声明执行成功，即http请求数据成功，可以返回数据了
        })
        .error(function(data, status, headers, config){
          deferred.reject(data);   // 声明执行失败，即服务器返回错误
        });
      return deferred.promise;   // 返回承诺，这里并不是最终数据，而是访问最终数据的API
    },

    getVotedVideos: function(uid) {
      var deferred = $q.defer(); // 声明延后执行，表示要去监控后面的执行
      $http.get('http://182.92.230.67:33445/videos/voted/' + uid)
        .success(function(data, status, headers, config){
          deferred.resolve(data);  // 声明执行成功，即http请求数据成功，可以返回数据了
        })
        .error(function(data, status, headers, config){
          deferred.reject(data);   // 声明执行失败，即服务器返回错误
        });
      return deferred.promise;   // 返回承诺，这里并不是最终数据，而是访问最终数据的API
    },

    getAuthorVideos: function(uid) {
      var deferred = $q.defer(); // 声明延后执行，表示要去监控后面的执行
      $http.get('http://182.92.230.67:33445/videos/author/' + uid)
        .success(function(data, status, headers, config){
          deferred.resolve(data);  // 声明执行成功，即http请求数据成功，可以返回数据了
        })
        .error(function(data, status, headers, config){
          deferred.reject(data);   // 声明执行失败，即服务器返回错误
        });
      return deferred.promise;   // 返回承诺，这里并不是最终数据，而是访问最终数据的API
    },

    getBrotherVideos: function(vid, sort) { // by parent_id
      var deferred = $q.defer(); // 声明延后执行，表示要去监控后面的执行
      if (!sort) sort = 'vote';
      $http.get('http://182.92.230.67:33445/videos/parent/' + vid + '/' + sort)// sort currently supports: datetime & vote
        .success(function(data, status, headers, config){
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

    vote: function(vid, uid){
      // 更新video table
      $http.get('http://182.92.230.67:33445/vote/' + vid + '/' + uid)
        .success(function(data, status, headers, config){
        })
        .error(function(data, status, headers, config){
        });
    },
    devote: function(vid, uid){
      // 更新video table
      $http.get('http://182.92.230.67:33445/devote/' + vid + '/' + uid)
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

      GetById: function (uid) {
        var deferred = $q.defer(); // 声明延后执行，表示要去监控后面的执行
        $http.get('http://182.92.230.67:33445/userid/' + uid)
          .success(function (data, status, headers, config) {
            deferred.resolve(data);  // 声明执行成功，即http请求数据成功，可以返回数据了
          })
          .error(function (data, status, headers, config) {
            deferred.reject(data);   // 声明执行失败，即服务器返回错误
          });
        return deferred.promise;   // 返回承诺，这里并不是最终数据，而是访问最终数据的API
      },

      checkFocus: function(uid, authorId){
        //alert(uid + ':' +authorId)
        var deferred = $q.defer(); // 声明延后执行，表示要去监控后面的执行
        $http.get('http://182.92.230.67:33445/interest/' + uid + '/' +authorId)
          .success(function (data, status, headers, config) {
            deferred.resolve(data);  // 声明执行成功，即http请求数据成功，可以返回数据了
          })
          .error(function (data, status, headers, config) {
            deferred.reject(data);   // 声明执行失败，即服务器返回错误
          });
        return deferred.promise;   // 返回承诺，这里并不是最终数据，而是访问最终数据的API
      },

      getUserInterests: function(uid){
        var deferred = $q.defer(); // 声明延后执行，表示要去监控后面的执行
        $http.get('http://182.92.230.67:33445/interest/' + uid)
          .success(function (data, status, headers, config) {
            deferred.resolve(data);  // 声明执行成功，即http请求数据成功，可以返回数据了
          })
          .error(function (data, status, headers, config) {
            deferred.reject(data);   // 声明执行失败，即服务器返回错误
          });
        return deferred.promise;   // 返回承诺，这里并不是最终数据，而是访问最终数据的API
      },

      getFans: function(uid){
        var deferred = $q.defer(); // 声明延后执行，表示要去监控后面的执行
        $http.get('http://182.92.230.67:33445/fans/' + uid)
          .success(function (data, status, headers, config) {
            deferred.resolve(data);  // 声明执行成功，即http请求数据成功，可以返回数据了
          })
          .error(function (data, status, headers, config) {
            deferred.reject(data);   // 声明执行失败，即服务器返回错误
          });
        return deferred.promise;   // 返回承诺，这里并不是最终数据，而是访问最终数据的API
      },

      updateIcon: function (cell) {
        var deferred = $q.defer(); // 声明延后执行，表示要去监控后面的执行
        $http.get('http://182.92.230.67:33445/usericon/' + cell)
          .success(function (data, status, headers, config) {
            deferred.resolve(data);  // 声明执行成功，即http请求数据成功，可以返回数据了
          })
          .error(function (data, status, headers, config) {
            deferred.reject(data);   // 声明执行失败，即服务器返回错误
          });
        return deferred.promise;   // 返回承诺，这里并不是最终数据，而是访问最终数据的API
      },

      addInterest: function (interest){
        var deferred = $q.defer(); // 声明延后执行，表示要去监控后面的执行
        $http.post('http://182.92.230.67:33445/interest',Object.toParams(interest), {
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

      removeInterest: function (interest){
        var deferred = $q.defer(); // 声明延后执行，表示要去监控后面的执行
        $http.post('http://182.92.230.67:33445/interest/delete',Object.toParams(interest), {
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
    }
  })

  .factory('Tags', function($http,$q){
    var tags = [];

    return {

      get: function (cat) {
        var deferred = $q.defer(); // 声明延后执行，表示要去监控后面的执行
        $http.get('http://182.92.230.67:33445/tag/' + cat)
          .success(function (data, status, headers, config) {
            deferred.resolve(data);  // 声明执行成功，即http请求数据成功，可以返回数据了
          })
          .error(function (data, status, headers, config) {
            deferred.reject(data);   // 声明执行失败，即服务器返回错误
          });
        return deferred.promise;   // 返回承诺，这里并不是最终数据，而是访问最终数据的API
      }
    }
  })

  .factory('App', function($http,$q){
    var tags = [];

    return {

      getConfig: function (name) {
        var deferred = $q.defer(); // 声明延后执行，表示要去监控后面的执行
        $http.get('http://182.92.230.67:33445/config/' + name)
          .success(function (data, status, headers, config) {
            if (!data || data.length < 1){
              deferred.resolve('')
            }
            else{
              deferred.resolve(data.value);  // 声明执行成功，即http请求数据成功，可以返回数据了
            }
          })
          .error(function (data, status, headers, config) {
            deferred.reject(data);   // 声明执行失败，即服务器返回错误
          });
        return deferred.promise;   // 返回承诺，这里并不是最终数据，而是访问最终数据的API
      },

      downloadFile: function (file) {
        var deferred = $q.defer(); // 声明延后执行，表示要去监控后面的执行
        $http.get('http://182.92.230.67:33445/download/' + file)
          .success(function (data, status, headers, config) {
            //return data;
            deferred.resolve(data);  // 声明执行成功，即http请求数据成功，可以返回数据了
          })
          .error(function (data, status, headers, config) {
            deferred.reject(data);   // 声明执行失败，即服务器返回错误
          });
        return deferred.promise;   // 返回承诺，这里并不是最终数据，而是访问最终数据的API
      },

      getNotification: function () {
        var deferred = $q.defer(); // 声明延后执行，表示要去监控后面的执行
        $http.get('http://182.92.230.67:33445/noti')
          .success(function (data, status, headers, config) {
            deferred.resolve(data);  // 声明执行成功，即http请求数据成功，可以返回数据了
          })
          .error(function (data, status, headers, config) {
            deferred.reject(data);   // 声明执行失败，即服务器返回错误
          });
        return deferred.promise;   // 返回承诺，这里并不是最终数据，而是访问最终数据的API
      },
    }
  })

.service('resourceFilterService', function() {
  var filter = 0;
  return {
    getFilter: function () {
      return filter;
    },
    setFilter: function(value) {
      filter = value;
    }
  }
});



