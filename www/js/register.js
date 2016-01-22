/**
 * Created by hhu on 2015/12/29.
 */

//var SITE_API_URL = "http://182.92.230.67:33445";
var reCell = new RegExp(/^0?(13[0-9]|15[012356789]|17[0678]|18[0-9]|14[57])[0-9]{8}$/);



angular.module('starter.register', ['ngCordova'])

  .controller('SignInCtrl', function($scope, $state, $http,$cordovaToast,$rootScope) {
    //初始化 手机号和密码 for test
    $scope.user ={cell: "15601811217", password: "111111", authorized: false};

    var user = $scope.user;
    $scope.signIn = function(user) {

      if (user.cell == ''){
        $cordovaToast.showShortCenter('手机号不能为空');
        return;
      }
      if (!reCell.test(user.cell)){
        //alert(user.cell);
        $cordovaToast.showShortCenter('手机号不合法');
        return;
      }
      if (user.password == ''){
        $cordovaToast.showShortCenter('密码不能为空');
        return;
      }
      $http.get(SITE_API_URL + '/user/'+ user.cell).then(function(response){
        var users = response.data;
        if (!users || users.length < 1){
          $cordovaToast.showShortCenter('用户不存在');
          return;
        }
        if (users[0].password == user.password){

          localStorage['uid'] = users[0]._id;
          localStorage['cell'] = user.cell;
          localStorage['name'] = users[0].name;
          localStorage['icon'] = users[0].icon;
          localStorage['gender'] = users[0].gender;
          localStorage['authorized'] = 'yes';

          // 如果状态是播放视频页，改到视频分类页（因为视频页带参数）
          //if ($rootScope.previousState == 'tab.video-detail')
          //  $rootScope.previousState = 'tab.cat';

          $state.go($rootScope.previousState != '' ? $rootScope.previousState : 'tab.home'); // 回到要求鉴权的页面
        }
        else{
          storage['uid'] = '';
          storage['cell'] = user.cell;
          storage['name'] = '';
          storage['authorized'] = 'no'
          // warning
          $cordovaToast.showShortCenter('手机号或密码错误');
        }
      });
    };


  })

  // 注册 控制模块
  .controller('RegisterCtrl', function($scope, $state, $http, $cordovaToast,$rootScope,Util) {
    //初始化 手机号和密码 for test
    $scope.user ={cell: "15601811217", password: "111111", name: 'test'};

    var user = $scope.user;
    $scope.register = function(user) {

      if (!user.cell) {
        $cordovaToast.showShortCenter('手机号不能为空');
        return;
      }
      if (!reCell.test(user.cell)){
        $cordovaToast.showShortCenter('手机号不合法');
        return;
      }
      if (!user.name) {
        $cordovaToast.showShortCenter('用户名不能为空');
        return;
      }
      if (!user.password) {
        $cordovaToast.showShortCenter('密码不能为空');
        return;
      }

      $http.post(SITE_API_URL + '/user',Util.object2Params(user), {
          dataType: 'json',
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        })
        .success(function(data, status, headers, config){
          if (data.return == 'existed')
            $cordovaToast.showShortCenter('用户已经存在');
          else if (data.return == 'error')
            $cordovaToast.showShortCenter('用户注册出错');
          else{
            $cordovaToast.showShortCenter('用户注册成功');

            localStorage['uid'] = data[0]._id;
            localStorage['cell'] = user.cell;
            localStorage['name'] = user.name;
            localStorage['icon'] = data[0].icon;
            localStorage['gender'] = data[0].gender;
            localStorage['authorized'] = 'yes';

            // 特殊处理
            if ($rootScope.previousState == 'tab.record'){
              $rootScope.previousState = 'tab.cats';
            }

            $state.go($rootScope.previousState != '' ? $rootScope.previousState : 'tab.home'); // 回到要求鉴权的页面
          }
        })
        .error(function(data,status, headers, config){
          console.log('insert user error');
          $cordovaToast.showShortCenter('用户注册出错');
        });

    }
  });

