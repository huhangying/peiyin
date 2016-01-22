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
  })

  .controller('EditmeCtrl', function($scope, Users, $ionicActionSheet,$cordovaCamera,$cordovaFileTransfer,$cordovaToast) {

    $scope.icon = localStorage['icon'];
    $scope.cell = localStorage['cell'];
    $scope.name = localStorage['name'];
    $scope.gender = localStorage['gender'] || '';

    $scope.changeGender = function(gender){
      $scope.gender = gender;
    }

    $scope.updateName = function(txt){
      $scope.name = txt;
    }

    $scope.updatePerson  = function(){

      var usr = {
        cell: localStorage['cell'],
        name: $scope.name,
        gender: $scope.gender
      };

      //alert(JSON.stringify(usr));
      localStorage['name'] = $scope.name;
      localStorage['gender'] = $scope.gender;

      Users.updateUser(usr).then(function(res){


        $cordovaToast.showShortCenter('你更新了个人资料');

      });

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
        //alert(imagePath + '>>' +  new_file_name)
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


  .controller('MessageCtrl', function($scope, Users, $state, $rootScope, Videos, $stateParams,$ionicNavBarDelegate) {

  })

  .controller('MessageDetailCtrl', function($scope, App) {
    //var uid = ;

    App.getMyNotifications('111111111111111111111111').then(function(data){
      alert(JSON.stringify(data))
      $scope.notifications = data;
    });
  })
