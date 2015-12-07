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

  .controller('CatDetailCtrl', function($scope, $rootScope,$stateParams, Chats,$cordovaMedia, $cordovaFile,$cordovaFileTransfer,$ionicLoading,$http) {
    var UPLOAD_URL = 'http://101.200.81.99:8888'
    $scope.step = 0;
    $scope.pauseCount = 0;
    $scope.info = [];
    $scope.preview_flag = false;
    $scope.preview_inprocess = false;
    $scope.file_no_ext = 'ocean';

    $scope.chat = Chats.get($stateParams.catId);
    //alert($scope.chat.url);
    $scope.mode = '';
    if (!$rootScope.count) $rootScope.count = 0;
    $rootScope.count++;
    $scope.videoid = $rootScope.count;
    $scope.output_video = ''; // actually URL

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
              //alert('创建文件成功');
            }, function (error) {
              // error
              alert('创建文件失败');
            });
        });
    };

    $scope.prepare = function(pause_count,time){
      //$scope.currentTime = 0;
      //$scope.volume = my_player.volume();

      $scope.myRecord = $scope.file_no_ext + pause_count + '.mp3';
      $scope.prepareAudiofile();

      $scope.mediaRec = new Media($rootScope.rootDir + $scope.myRecord,
        // success callback
        function() {
          if ($scope.mode == 'record'){ //录完
            //alert("录音完成");
            $scope.recordStatus = 5;
          }
          else if ($scope.mode == 'preview'){ //播完
            //alert("录音播放完成");
            $scope.recordStatus = 6;
            //if ($scope.my_player)
            //  $scope.my_player.pause();
          }
        },
        // error callback
        function(err) {
          alert("录音失败: "+ err.code);
          $scope.recordStatus = -1;
          $scope.$apply();
        }
        ,function(status){
        }
      );

      if (!$scope.preview_flag){
        var _info = {
          count: pause_count,
          start_time: time,
          name: $scope.myRecord
        };
        $scope.info.push(_info);
      }

    }

    $scope.currentRecord = false;

    $scope.resetRecord = function() {
      $scope.recordStatus = 0;

      $scope.my_player.pause();
      $scope.my_player.currentTime(0);

      //$scope.mediaRec.seekTo(0);
      //$scope.mediaRec.pause();

      $scope.currentRecord = false;

      $scope.step = 1;

    }

    // 支持preview播放
    $scope.previewRecord = function() {
      $scope.mode = 'preview';
      $scope.my_player.currentTime(0);
      $scope.my_player.play();

      // 放到“timeupdate”事件触发时播放
      $scope.preview_flag = true;
      $scope.preview_inprocess = false;
      $scope.pauseCount = 0; //不能再录了

      $scope.currentRecord = false;
      $scope.recordStatus = 7;
      $scope.step = 3; // 可以上传

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
      $scope.pauseCount++;
      $scope.step = 2; // 可以预览
    }

    //Media 不支持在录制过程中暂停，所以暂停其实是停止录制. 继续录制其实是开始录制
    $scope.captureAudio = function() {
      $scope.mode = 'record';

      if (!$scope.currentRecord){

        // 录制第一个录音，清空先
        if ($scope.pauseCount == 0){
          $scope.info = []; //
        }

        $scope.prepare($scope.pauseCount, $scope.my_player.currentTime());

        //$scope.my_player.currentTime(0);
        $scope.my_player.play();

        // Record audio
        $scope.mediaRec.startRecord();
        $scope.recordStatus = 1;

      }
      else{
        $scope.my_player.pause();
        $scope.mediaRec.stopRecord();
        $scope.mediaRec.release();
        $scope.mode = '';
        $scope.recordStatus = 3; // 暂停
        $scope.pauseCount++;
        $scope.step = 2; // 可以预览
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
        $scope.step = 0; // 可以上传
        $scope.$apply();

        //setTimeout(function(){
        //  $scope.resetRecord();
        //},1000)
      });

      $scope.my_player.on("timeupdate", function(a){
        var current_time = $scope.my_player.currentTime();//获取当前播放时间

        // 在这里播放录音 preview，因为时间跟视频同步，比较准确
        // 步骤:
        //    1. 获取当前视频播放时间；
        //    2. 查表获取与之对应的录音（文件名，开始时间）；
        //    3. 关掉前面的录音，开始播放新的
        if ($scope.preview_flag && !$scope.preview_inprocess){
          for(var i=$scope.info.length-1; i >= 0 ; i--){
            if ($scope.info[i].start_time <= current_time){ // 如果current_time到达或过了 start_time，则开始播放
              $scope.start_time = $scope.info[i].start_time;
              $scope.current_time = current_time
              $scope.info_pause_count = $scope.info[i].count;

              $scope.pauseCount = $scope.info[i].count;
              $scope.preview_inprocess = true;


              // 获取录音文件和开始播放时间
              $scope.mediaRec = new Media($rootScope.rootDir + $scope.info[i].name, null, null, $scope.mediaStatusCallback);
              //$scope.prepare($scope.pauseCount, $scope.info[i].start_time);

              $scope.mediaRec.seekTo((current_time - $scope.info[i].start_time) * 1000);
              $scope.mediaRec.play();

              $scope.$apply(); // for test
              return;
            }
          }
        }

        // 以下是更新信息
        $scope.currentTime = parseInt(current_time);
        if (tmp_count !=  $scope.currentTime)
          $scope.$apply();
        tmp_count = $scope.currentTime;

      });

      $scope.mediaStatusCallback = function(status){
        if (status == 0 || status == 4 ){//Media.MEDIA_NONE = 0; Media.MEDIA_STOPPED = 4;
          $scope.preview_inprocess = false; //播放完的话就把flag设置回来
          $scope.$apply();
        }
      }

      $scope.my_player.on("ended", function(a){
        if ($scope.currentRecord){
          $scope.stopRecording();
        }
        $scope.preview_flag = false;
        $scope.pauseCount = 0; //不能再录了
        $scope.preview_inprocess = false;

        $scope.$apply();// for test

      });
    });


    $scope.$on('$ionicView.unloaded', function () {
      // render完成后执行的js
      $scope.my_player.destroy();

    });

    $scope.uploaded_count = 0;
    $scope.upload = function(file_name) {

      var options = {
        fileName: file_name,
        chunkedMode: false,
        mimeType: "audio/mpeg",
        httpMethod: "post"
      };

      //$cordovaFileTransfer.upload( "http://182.92.230.67:8888/upload",$rootScope.rootDir + options.fileName, options, true)
      $cordovaFileTransfer.upload( "http://101.200.81.99:8888/upload",$rootScope.rootDir + options.fileName, options, true)
        .then(function(result) {
          $ionicLoading.hide();

          $scope.uploaded_count++; // 成功的上传个数
          // 判断一下，如果全部传完，给服务器发个消息，要求进行音频的组合以及同视频的合成
          if ($scope.uploaded_count == $scope.pauseCount){
            $scope.uploaded();
          }
        }, function(err) {
          $ionicLoading.hide(); // hide it in case
          alert("ERROR: " + JSON.stringify(err));
        }, function (progress) {
          // constant progress updates
          if (progress.lengthComputable) {
            $ionicLoading.show({
              template: (progress.loaded / progress.total).toFixed(2) * 100 + '%上传'
            });
          } else {
            $ionicLoading.show({
              template: '上传中...'
            });
          }
        });
    }

    $scope.uploads = function() {

      $scope.uploaded_count = 0;
      for (var i=0; i< $scope.info.length; i++){
        $scope.upload($scope.info[i].name);
      }

      $scope.step = 4; // 可以分享

    }

    Object.toParams = function ObjecttoParams(obj) {
      var p = [];
      for (var key in obj) {
        p.push(key + '=' + encodeURIComponent(obj[key]));
      }
      return p.join('&');
    };

    $scope.uploaded = function(){
      $http.post('http://101.200.81.99:8888/uploaded',Object.toParams({name:$scope.file_no_ext, count: $scope.pauseCount}), {
          dataType: 'json',
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        })
        .success(function(data, status, headers, config){
          if (!data || data.return == 'error'){
            alert('转码失败!');
            return;
          }

          //
          $scope.output_video = UPLOAD_URL + '/player/'+ data.return;
          $scope.$apply();
          //alert($scope.output_video)
        })
        .error(function(data,status, headers, config){
          console.log('uploaded ('+$scope.file_no_ext+') error');
        });


    }

    $scope.getInfo = function(){
      alert(JSON.stringify($scope.info));
    }
  })

  //============================================================================================================

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
