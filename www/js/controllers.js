var SITE_API_URL = "http://182.92.230.67:33445";
var VIDEO_URL_ROOT = "http://101.200.81.99:808";
var UPLOAD_URL = 'http://101.200.81.99:8888';

angular.module('starter.controllers', ['ngCordova','ngSanitize','resourceCtrl','recordCtrl', 'focusCtrl','settingsCtrl','util'])

  .controller('HomeCtrl', function($scope,$rootScope,$http,$cordovaToast,$ionicHistory,$cordovaAppVersion, App,$ionicPopup,$cordovaFileTransfer,$cordovaFileOpener2,$cordovaLocalNotification,$timeout,Util,$ionicSlideBoxDelegate) {
    $scope.title = '<img src="img/logo.png" alt="首页" height="40px" />'

    /*
     * 更新APP版本
     * */
    document.addEventListener("deviceready", function () {
      $cordovaAppVersion.getVersionNumber().then(function (version) {
//        alert(version)
//var version = '0.0.2'
        App.getConfig('version').then(function(lastest_version){
          if (lastest_version.localeCompare(version) > 0){
            // 如果有更新的版本, for Android
            if (ionic.Platform.isAndroid()){
              App.getConfig('version_file').then(function(download_file) {
                // 一个确认对话框
                var confirmPopup = $ionicPopup.confirm({
                  title: '新版本',
                  template: ' 发现有新的版本，确认要更新?',
                  buttons: [
                    { text: '取消' },
                    { text: '确定', type: 'button-positive',
                      onTap: function(e) {

                        var url = 'http://182.92.230.67:33445/download/' + download_file;
                        var targetPath = $rootScope.rootDir + download_file;
                        var trustHosts = true
                        var options = {};

                        $cordovaFileTransfer.download(url, targetPath, options, trustHosts)
                          .then(function(result) {

                            $cordovaFileOpener2.open(
                              targetPath,
                              'application/vnd.android.package-archive'
                            ).then(function() {
                              // Success!
                              //alert('success')
                              //return;
                            }, function(err) {
                              // An error occurred. Show a message to the user
                            });

                          }, function(err) {
                            // Error
                          }, function (progress) {

                            $scope.downloadProgress = (progress.loaded / progress.total) * 100;
                          });
                      }}
                  ]
                });

              });
            }

          }
        })


      });
    }, false);



    $scope.slideHeight = Util.slideHeight();
    $scope.navSlide = function(index) {
      $ionicSlideBoxDelegate.slide(index, 500);
    }

    $scope.getVideos = function() {


      $http.get(SITE_API_URL + '/videos/0').then(function(response){

        if (response.data.return == 'empty'){
          $scope.videos = [];
          $cordovaToast.showShortCenter('没有视频');
          return;
        }

        $scope.videos = response.data;

        if ($scope.videos && $scope.videos.length > 0){
          $scope.videos = response.data;

          $scope.video = $scope.videos[0];
          if (!$rootScope.count) $rootScope.count = 0;
          $rootScope.count++;
          $scope.videoid = $rootScope.count;
        }
      });
    };

    $scope.getVideos();


    $scope.$on('$ionicView.unloaded', function () {
      // render完成后执行的js
      //$scope.player.destroy();
      $ionicHistory.clearCache();
    });

    $scope.doRefresh = function(){
      this.getVideos();

      //Stop the ion-refresher from spinning
      $scope.$broadcast('scroll.refreshComplete');
    }

    // Nofiticatioin, 五分钟检测一次
    $timeout(function(){
      App.getNotification().then(function(noti){
        if (!window.localStorage['notificationid'] || window.localStorage['notificationid'] != noti._id){

          var currentDatetime = new Date().toISOString();
          if (currentDatetime.localeCompare(noti.updated) >= 0){ //当前时间比设定时间要晚。设定时间已经到了
            $cordovaLocalNotification.schedule({
              id: 1,
              title: noti.title,
              text: noti.text,
              //icon:
            }).then(function (result) {
              // ...
              window.localStorage['notificationid'] = noti._id;
            });
          }

        }
      });
    }, 300000);
  })

  .controller('CatsCtrl', function($scope, $http,$q, Videos, Tags) {
    $scope.selectedTagIndex = 0;
    Tags.get('常用').then(function(data){
      $scope.tags = data;
    });


    // by default
    Videos.all(1).then(function(data){
      $scope.videos = data;
    });

    $scope.setContent = function(tag, index){
      $scope.selectedTagIndex = index;
      if (tag == '排行'){  // 最近更新
        Videos.all(1).then(function(data){
          $scope.videos = data;
        });
      }
      else{
        Videos.getByTag(1, tag).then(function(data){
          $scope.videos = data;
        });
      }
    }
  })

  .controller('VideoCtrl', function($scope, $stateParams, Videos, $cordovaToast,$state, Users,$ionicNavBarDelegate,$ionicHistory,$ionicPopup,Util) {
    var uid = window.localStorage["uid"];
    $scope.init = function(){
      $scope.videoid = Util.randomId();
      $scope.videoheight = Util.videoHeight();
      $scope.showFocus = false; // 加关注
      //$scope.$apply();
    }

    $scope.loadVideoByid = function () {

      Videos.get($stateParams.vid).then(function (data) {
        $scope.myvideo = data;

        // 根据情况添加关注
        if ($scope.myvideo.author){
          // 不能关注自己
          if ( $scope.myvideo.author._id == uid){
            $scope.showFocus = false;
          }
          else { // 关注别人
            $scope.showFocus = true;
            // check if focus already
            var isFocus = Users.checkFocus(uid, $scope.myvideo.author._id)
              .then(function(data){
                if (data == true){
                  $scope.noFocus = false;
                }
                else{
                  $scope.noFocus = true;
                }
                $scope.$apply();
              });
          }

        }

        // 加载别人玩的视频
        if ($scope.myvideo.parent && $scope.myvideo.parent != ''){
          //
          Videos.getBrotherVideos($scope.myvideo.parent).then(function(bvideos){
            //alert(JSON.stringify(bvideos));
            $scope.brotherVideos = bvideos;
          });
        }


        //alert(JSON.stringify($scope.myvideo))
        $scope.myplayer.src({type: 'video/mp4', src: VIDEO_URL_ROOT + '/server/output/' +  $scope.myvideo.url +'.mp4'});
        $scope.myplayer.play();
      });
    }

    //$scope.loadVideoByid();
    Videos.getCommentsByVid($stateParams.vid).then(function (data) {
      $scope.comments = data;
    });
    $scope.$apply();

    $scope.isVoted = false;
    $scope.vote = function(){
      $scope.isVoted = !$scope.isVoted;

      if ($scope.isVoted){
        // if vote
        Videos.vote($scope.myvideo._id, uid);
        $scope.myvideo.vote++;
      }
      else{
        // if de-vote
        Videos.devote($scope.myvideo._id, uid);
        $scope.myvideo.vote--;
      }

      $scope.$apply();
    }

    $scope.$on('ngRenderFinished', function (scope, element, attrs) {
      // render完成后执行的js
      $scope.myplayer = videojs($scope.videoid);
      $scope.loadVideoByid();
    });

    $scope.$on('$ionicView.unloaded', function () {
      $ionicHistory.clearCache();
      $ionicHistory.clearHistory();
      if ($scope.myplayer){
        $scope.myplayer.dispose();
      }
    });

    $scope.playIt = function(){
      $scope.myplayer.play();
    }


    $scope.sendMyComment = function(){
      if ($scope.$root.myComment == '' || !$scope.$root.myComment){
        $cordovaToast.showShortCenter('评论内容不能为空');
        return;
      }

      // 评论前要求先登录
      if (window.localStorage['authorized'] != 'yes'){
        $state.go('signin');
        return;
      }

      var comment ={
        video: $stateParams.vid,
        author:window.localStorage['uid'],
        comment: $scope.$root.myComment
        };

      Videos.addComment(comment).then(function(data){
      });

      //????
      // 更新 comments
      Videos.getCommentsByVid($stateParams.vid).then(function (data) {
        $scope.comments = data;
        $scope.$apply();
      });

      $scope.$root.myComment = '';
    }

    //TODO: same as in FocusControl
    $scope.modifyInterest = function(noFocus){
      var interest = {
        uid: uid,
        interests: $scope.myvideo.author._id.split(',')
      };
      $scope.noFocus = !noFocus;

      if (noFocus){
        Users.addInterest(interest)
          .success(function(data){
            alert('added: ' + data)
          })
          .error(function(data){
            alert('error: ' + data)
          });
      }
      else{
        //alert(JSON.stringify(interest))
        Users.removeInterest(interest)
          .success(function(data){
            alert('removed: ' + data)
          })
          .error(function(data){
            alert('error: ' + data)
          });
      }

      $scope.$apply();
    }

    // 触发一个按钮点击，或一些其他目标
    $scope.complain = function() {

      // 一个确认对话框
      var confirmPopup = $ionicPopup.confirm({
        title: '举报视频',
        template: '该视频包含不适宜的内容，确认要举报?',
        buttons: [
          { text: '取消' },
          { text: '确定', type: 'button-positive' }
          ]
      });
      confirmPopup.then(function(res) {
        if(res) {
          alert(res)
        }
      });
    }

    // a filter
    $scope.excludeSelf = function(video){
      if (video._id != $scope.myvideo._id)
        return video;
    }

    $scope.goBack = function(){
      $ionicNavBarDelegate.back();
    }

  })

  .controller('PlayerCtrl', function($scope, $stateParams,Videos, $ionicNavBarDelegate,Util) {
    $scope.videoid = Util.randomId();
    $scope.videoheight = Util.videoHeight();


    $scope.$on('ngRenderFinished', function (scope, element, attrs) {
      // render完成后执行的js
      Videos.get($stateParams.vid).then(function(data){
        $scope.myvideo = data;

        $scope.myplayer = videojs($scope.videoid);
        $scope.myplayer.src({type: 'video/mp4', src: VIDEO_URL_ROOT + '/server/output/' +  $scope.myvideo.url +'.mp4'});
        $scope.myplayer.play();
      });

    });

    $scope.playIt = function(){
      $scope.myplayer.play();
    }
    $scope.goBack = function(){
      $ionicNavBarDelegate.back();
    }
  })

  //============================================================================================================

  // 用户账号管理
  .controller('AccountCtrl', function($scope,$state,$rootScope,$http,$cordovaToast,Videos,Users, $ionicActionSheet,$cordovaCamera,$cordovaFileTransfer) {

    // 如果没有登录，去登录
    if (!localStorage['authorized'] || localStorage['authorized'] != 'yes'){
      $state.go('signin');
      return;
    }

    //alert($scope.volume.video)
    // 公用的函数
    $scope.setAuthorVideos = function(uid){
      var author_votes = 0;
      $scope.usr = [];
      Videos.getAuthorVideos(uid)
        .then(function (author_videos) {
          $scope.usr.videoNo = author_videos.length;
          for (var j = 0; j < author_videos.length; j++) {
            author_votes += author_videos[j].vote;
          }
          $scope.usr.totalVotes = author_votes;

        });
    }

    $scope.cell = '';
    if (!localStorage['cell'])
      $scope.user_name = '我未登录';
    else{
      $scope.icon = localStorage['icon'];
      $scope.user_name = localStorage['name'];
      $scope.cell = localStorage['cell'];
      var uid = window.localStorage["uid"];
      $scope.setAuthorVideos(uid);
    }



    $scope.changeIcon = function(){
      // 显示操作表
      $ionicActionSheet.show({
        titleText: '更新你的头像',
        buttons: [
          { text: '拍照上传' },
          { text: '手机相册上传' },
        ],
        cancelText: '取消',
        buttonClicked: function(index) {
          if (index == 0) {//拍照上传
            $scope.takePhoto();
          }
          else if (index == 1){ //手机相册上传
            $scope.choosePhoto();
          }
          return true;
        }
      });
    }

    $scope.takePhoto = function () {
      var options = {
        quality: 75,
        destinationType: Camera.DestinationType.FILE_URI,
        sourceType: Camera.PictureSourceType.CAMERA,
        allowEdit: true,
        encodingType: Camera.EncodingType.JPEG,
        targetWidth: 100,
        targetHeight: 100,
        popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: false
      };

      $cordovaCamera.getPicture(options).then(function (imagePath) {
        $scope.icon = imagePath;
        var new_file_name = $scope.cell + '.jpg';
        // 上传文件，并修改数据库
        $scope.uploadMyIcon(imagePath, new_file_name);

      }, function (err) {
        // An error occured. Show a message to the user
      });
    }

    $scope.choosePhoto = function () {
      var options = {
        quality: 75,
        destinationType: Camera.DestinationType.FILE_URI,
        sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
        allowEdit: true,
        encodingType: Camera.EncodingType.JPEG,
        targetWidth: 100,
        targetHeight: 100,
        popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: false
      };

      $cordovaCamera.getPicture(options).then(function (imagePath) {
        $scope.icon = imagePath;
        var new_file_name = $scope.cell + '.jpg';
        alert(imagePath + '>>' +  new_file_name)
        $scope.uploadMyIcon(imagePath, new_file_name);
      }, function (err) {
        // An error occured. Show a message to the user
      });
    }

    $scope.uploadMyIcon = function(path, new_file_name){
      var options = {
        fileName: new_file_name,
        chunkedMode: false,
        mimeType: "image/jpg",
        httpMethod: "post"
      };
      $cordovaFileTransfer.upload(UPLOAD_URL + "/uploadicon",path, options, true)
        .then(function(result) {

          // update the database
          Users.updateIcon($scope.cell);

        }, function(err) {
          alert("上传icon失败: " + JSON.stringify(err));
        });

    }

  })

  //--------------------------------------------------------------------------------------------------------------
  .directive('onFinishRender', function () {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        if (scope.$last) setTimeout(function(){
          scope.$emit('ngRenderFinished', element, attrs);
        }, 1);
      }
    };
  });

