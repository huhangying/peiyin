/**
 * Created by hhu on 2016/1/21.
 */

angular.module('settingsCtrl', [])

  .controller('SettingsCtrl', function($scope, Users, $state, $rootScope, Videos, $stateParams,$ionicNavBarDelegate) {




    // MUTED related!
    if (window.localStorage.getItem('muted') ==  null){
      $scope.muted = true; //default
      window.localStorage.setItem('muted',true);
    }

    $scope.muted = ('true' == window.localStorage.getItem('muted'));

    $scope.updateMuted = function(){
      $scope.muted = !$scope.muted;
      window.localStorage.setItem('muted',$scope.muted);
    }

    $scope.logout = function(){
      localStorage['cell'] = '';
      localStorage['name'] = '';
      localStorage['authorized'] = '';
      localStorage['uid'] = '';
      $rootScope.previousState = '';
      $state.go('tab.home');
    }
  });
