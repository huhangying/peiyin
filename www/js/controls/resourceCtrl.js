/**
 * Created by hhu on 2016/1/12.
 */

angular.module('resourceCtrl', [])

  .controller('ResourceCtrl', function($scope, Users, $state, Videos, $stateParams,$ionicNavBarDelegate) {
    var uid = window.localStorage['uid'];
    var vid = $stateParams.vid;
    $scope.myvideo = {};
    $scope.myvideo.name = '';
    $scope.childVideos = [];

    Videos.get(vid).then(function(data){
      $scope.myvideo = data;
    });

    $scope.setMode = function(mode){
      var sort = 'vote';

      // mode: 1: 最赞； 2：最新；
      $scope.mode = mode;
      switch(mode){
        case 1:
          $scope.videos = $scope.childVideos;
          sort = 'vote';
          break;
        case 2:
          $scope.videos = $scope.childVideos;
          sort = 'datetime';
          break;
      }

      Videos.getBrotherVideos(vid, sort).then(function(data){
        if (data== 'null'){
          $cordovaToast.showShortCenter('还没有人为该视频配音');
          return;
        }
        $scope.videos = data;
      });
    }

    // 获取为该视频配音的全部视频
    $scope.setMode(1);
    $scope.$apply();

    $scope.goBack = function(){
      $ionicNavBarDelegate.back();
    }
  });


