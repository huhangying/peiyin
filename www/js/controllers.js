angular.module('starter.controllers', ['ngCordova'])

.controller('HomeCtrl', function($scope) {})

.controller('CatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('CatDetailCtrl', function($scope, $rootScope,$stateParams, Chats,$cordovaMedia, $cordovaFile) {
  $scope.chat = Chats.get($stateParams.catId);
    var my_player = videojs("my_video");
    $scope.currentTime = 0;
    $scope.currentRecord = false;
    $scope.volume = my_player.volume();
    $scope.myRecord = 'myrecording.mp3';
    $scope.prepareAudiofile = function(){

      $cordovaFile.checkFile($rootScope.rootDir, $scope.myRecord)
        .then(function (success) {
          // success
        }, function (error) {
          // error
          $cordovaFile.createFile($rootScope.rootDir, $scope.myRecord, true)
            .then(function (success) {
              // success
              alert('创建文件成功');
            }, function (error) {
              // error
              alert('创建文件失败');
            });
        });
    };
    $scope.prepareAudiofile();

    $scope.src = ''+ $rootScope.rootDir + $scope.myRecord;
    //alert(src);
    $scope.mediaRec = new Media($scope.src,
      // success callback
      function() {
        alert("recordAudio():Audio Success");
      },

      // error callback
      function(err) {
        alert("recordAudio():Audio Error: "+ err.code);
      });

    // 获取视频总时长 => $scope.duration
    my_player.on("loadedmetadata", function(a){
      $scope.duration = my_player.duration();//获取总时长
      //console.log($scope.duration);
      //alert(a)
    });
    my_player.on("timeupdate", function(a){
      $scope.currentTime = my_player.currentTime();//获取当前播放时间
    });
    //音量改变时
    //my_player.on("volumechange", function(){
    //  $scope.volume = my_player.volume();//获取当前音量
    //});

    $scope.resetRecord = function() {
      my_player.currentTime(0);
      my_player.pause();
      $scope.currentRecord = false;
      $scope.mediaRec.seekTo(0);
      $scope.mediaRec.pause();
    }

    $scope.previewRecord = function() {
      my_player.currentTime(0);
      $scope.mediaRec.seekTo(0);
      my_player.play();
      $scope.mediaRec.play();
      $scope.currentRecord = true;
    }

    $scope.stopRecording = function(){
      $scope.mediaRec.stopRecord();
      $scope.mediaRec.release();
      my_player.stop();
      $scope.currentRecord = false;
    }
    $scope.captureAudio = function() {

      if (!$scope.currentRecord){
        my_player.play();

        // Record audio
        $scope.mediaRec.startRecord();
      }
      else{
        my_player.pause();
        $scope.mediaRec.pause();
      }
      $scope.currentRecord = !$scope.currentRecord;
    }

  //============================================================================================================
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
