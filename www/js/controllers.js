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
    $scope.step = 1;
  $scope.chat = Chats.get($stateParams.catId);
    //alert($scope.chat.url);
    $scope.mode = '';
    if (!$rootScope.count) $rootScope.count = 0;
    $rootScope.count++;
    $scope.videoid = $rootScope.count;

    //$scope.my_player = videojs("my_video");

    //音量改变时
    //my_player.on("volumechange", function(){
    //  $scope.volume = my_player.volume();//获取当前音量
    //});

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

    $scope.prepare = function(){
      $scope.currentTime = 0;
      $scope.recordReady = true;
      //$scope.volume = my_player.volume();

      $scope.myRecord = 'myrecording.mp3';
      $scope.prepareAudiofile();

      $scope.src = ''+ $rootScope.rootDir + $scope.myRecord;
      //alert($scope.src);
      $scope.mediaRec = new Media($scope.src,
        // success callback
        function() {

          if ($scope.mode == 'record'){ //录完
            //alert("录音完成");
            $scope.recordStatus = 5;
          }
          else if ($scope.mode == 'preview'){ //播完
            //alert("录音播放完成");
            $scope.recordStatus = 6;
            if ($scope.my_player)
             $scope.my_player.pause();
          }
          $scope.$apply();
        },
        // error callback
        function(err) {
          alert("录音失败: "+ err.code);
          $scope.recordStatus = -1;
          $scope.$apply();
        }
        //,function(status){
        //  //alert("现在：" + status);
        //  $scope.recordStatus = status;
        //  $scope.$apply();
        //}
      );
    }

    $scope.prepare();
    $scope.currentRecord = false;

    $scope.resetRecord = function() {
      $scope.recordStatus = 0;

      $scope.my_player.pause();
      $scope.my_player.currentTime(0);

      //$scope.mediaRec.seekTo(0);
      //$scope.mediaRec.pause();

      $scope.currentRecord = false;

      $scope.step++;

    }

    $scope.previewRecord = function() {
      $scope.mode = 'preview';

      $scope.my_player.currentTime(0);
      //$scope.mediaRec.stopRecord();
      //$scope.mediaRec.seekTo(0); // 这个操作自动停止本次录制
      $scope.my_player.play();
      $scope.mediaRec.play();

      $scope.currentRecord = false;
      $scope.recordReady = false;

      $scope.recordStatus = 7;
      $scope.$apply();
    }

    $scope.stopRecording = function(){
      $scope.recordStatus = 4;

      $scope.my_player.pause();
      $scope.my_player.currentTime(0);
      $scope.mediaRec.stopRecord();
      $scope.mediaRec.release();
      //$scope.mediaRec.seekTo(0);

      $scope.currentRecord = false;
      $scope.recordReady = false;
    }

    //Media 不支持在录制过程中暂停，所以暂停其实是停止录制. 继续录制其实是开始录制
    $scope.captureAudio = function() {
      $scope.mode = 'record';

      if (!$scope.currentRecord){

        if (!$scope.recordReady){
          $scope.prepare();
        }

        $scope.my_player.currentTime(0);
        $scope.my_player.play();

        // Record audio
        $scope.mediaRec.startRecord();
        $scope.recordStatus = 1;

      }
      else{
        $scope.my_player.pause();
        $scope.mediaRec.stopRecord();
        $scope.mediaRec.release();
        $scope.recordReady = false;
        $scope.mode = '';
        $scope.recordStatus = 4;
      }
      $scope.currentRecord = !$scope.currentRecord;
    }

    $scope.getStatus = function(id){

      switch (id){
        case -1:
              return '录音失败';
        case 0:
              return '等待视频加载...';
        case 1:
              return '开始';
        case 2:
              return '运行';
        case 3:
              return '暂停';
        case 4:
              return '停止';
        case 5:
          return '录音完成';
        case 6:
          return '录音播放完成';
        case 7:
              return '开始播放';
        default :
              return '';
      }
    }

    var tmp_count=0;
    $scope.$on('ngRenderFinished', function (scope, element, attrs) {
      // render完成后执行的js
      //alert($scope.videoid)
      $scope.my_player = videojs('my_video'+ $scope.videoid);

      $scope.my_player.on("loadedmetadata", function(a){
        $scope.duration = parseInt($scope.my_player.duration());//获取总时长
        $scope.$apply();

        //setTimeout(function(){
        //  $scope.resetRecord();
        //},1000)
      });
      $scope.my_player.on("timeupdate", function(a){
        $scope.currentTime = parseInt($scope.my_player.currentTime());//获取当前播放时间
        if (tmp_count !=  $scope.currentTime)
          $scope.$apply();
        tmp_count = $scope.currentTime;

      });
    });

    //var my_timer = setInterval(function() {
    //  //todo:
    //
    //}, 1000);


    $scope.$on('$ionicView.unloaded', function () {
      // render完成后执行的js
      $scope.my_player.destroy();

    });
  //============================================================================================================
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
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
  });;
