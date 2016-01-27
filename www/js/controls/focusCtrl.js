/**
 * Created by hhu on 2016/1/22.
 */

angular.module('focusCtrl', [])


  // 包含 关注页 和 个人主页
  .controller('FocusCtrl', function($scope, Users, $state, Videos, $stateParams,$ionicNavBarDelegate) {
    var uid = window.localStorage['uid'];


    $scope.videos = [];
    $scope.getAllFocusVideos = function() {

      Videos.all(0).then(function(videos){
        $scope.videos = [];

        if (videos == 'null'){
          $state.go('tab.focusAdd')
          $cordovaToast.showShortCenter('没有视频');
          return;
        }

        videos.forEach(function(video){

          if (video.author){
            // 视频有主，并且并关注
            //alert(video.author._id)
            Users.checkFocus(uid, video.author._id)
              .then(function(data){
                if (data == 'true' || data == true){
                  $scope.videos.push(video);
                }

                if (!$scope.videos || $scope.videos.length < 1){
                  //$state.go('tab.focusAdd');
                  //$cordovaToast.showShortCenter('没有关注视频，请先关注');
                }

              });
          }
        });

      });
    }


      $scope.title = '关注';

      // 没有设置 author， 则显示全部关注的视频
      Users.getUserInterests(uid)
        .then(function(data){
          //alert(JSON.stringify(data))
          if (!data || data.length < 1){
            // go and add more interest
            $state.go('tab.focusAdd');
            return;
          }
          $scope.getAllFocusVideos();
        });


  })

  .controller('FocusAddCtrl', function($scope,$rootScope,$http,$cordovaToast, Users,$state, Videos) {
    var uid = window.localStorage['uid'];

    $scope.setAuthorVideos = function(index, uid){
      var author_votes = 0;
      Videos.getAuthorVideos($scope.users[index]._id)
        .then(function (author_videos) {

          $scope.users[index].videoNo = author_videos.length;
          for (var j = 0; j < author_videos.length; j++) {
            author_votes += author_videos[j].vote;
          }
          $scope.users[index].totalVotes = author_votes;

        });
    }

    $scope.checkIfFocus = function(authorId){
      //alert(JSON.stringify($scope.user_interests) + ':' + authorId)
      //alert(($scope.user_interests.indexOf(authorId) > -1))
      var len = $scope.user_interests.length;
      for (var i=0; i<len; i++){
        if ($scope.user_interests[i]._id == authorId) {
          //alert(authorId)
          return true;
        }
      }
      return false;

    }

    $scope.user_interests = [];
    Users.getUserInterests(uid)
      .then(function(data){
        $scope.user_interests = data[0].interests;
        //alert(JSON.stringify($scope.user_interests))

        Users.all().then(function(data){

          $scope.users = data;
          var length = $scope.users.length;

          for (var i=0; i<length; i++) {

            $scope.setAuthorVideos(i, $scope.users[i]._id);
            $scope.users[i].checked = $scope.checkIfFocus($scope.users[i]._id);
          }

        });
      });



    $scope.modifyInteres = function(){
      var _interests = [];
      $scope.users.forEach(function(usr){
        if (usr.checked){
          _interests.push(usr._id);
        }
      });

      var interest = {
        uid: uid,
        interests: _interests
      };

      Users.addInterest(interest)
        .then(function(data){
          if (data && data != 'error'){
            $state.go('tab.focus');
            $cordovaToast.showShortCenter('成功的增加关注');
          }
          else {
            $cordovaToast.showShortCenter('请选择关注，然后添加')
          }
        });

    }

    $scope.InterestChanged = function(index, authorId){
      //alert(index + ':' + $scope.users[index].checked)
      $scope.users[index].checked = !$scope.users[index].checked;
    }
  })

  .controller('PersonCtrl', function($scope, Users, $state, Videos, $stateParams,$ionicNavBarDelegate) {
    var uid = window.localStorage['uid'];
    var author_id = $stateParams.author;
    if (author_id === '0') author_id = uid;
    var mode_id = $stateParams.mode || 1;

    $scope.yourVideos = []; // 作品
    $scope.yourVotedVideos = []; // 喜欢
    $scope.yourVotedVideos = []; //
    $scope.fans = []; //


    $scope.title = '个人主页';

    Users.GetById(author_id).then(function(author){
      if (author != 'error' && author != 'null'){
        $scope.author = author;
      }

      // 根据情况添加关注
      if ($scope.author){
        // 不能关注自己
        if ( $scope.author._id == uid){
          $scope.showFocus = false;
        }
        else { // 关注别人
          $scope.showFocus = true;
          // check if focus already
          var isFocus = Users.checkFocus(uid, $scope.author._id)
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

      // 该作者的作品
      Videos.getAuthorVideos(author_id).then(function(videos){
        if (videos== 'null'){
          $cordovaToast.showShortCenter('没有发现该作者相关的视频');
          return;
        }
        $scope.yourVideos = videos;

        if (mode_id == 1)
          $scope.setMode(1); // default=1: 显示该作者的作品

      });

      // 该作者点过赞的作品
      Videos.getVotedVideos(author_id).then(function(videos){
        if (videos== 'null'){
          $cordovaToast.showShortCenter('没有发现该作者喜欢的视频');
          return;
        }
        $scope.yourVotedVideos = videos;

        if (mode_id == 2)
          $scope.setMode(2);
      });

      // 该作者关注的人
      Users.getUserInterests(author_id)
        .then(function(data){
          //alert(JSON.stringify(data))
          if (data && data.length > 0){
            $scope.authorInterestedUsers = data[0].interests;
            //
            $scope.setFocus($scope.authorInterestedUsers);
          }
          if (mode_id == 3)
            $scope.setMode(3);
        });

      // 该作者的粉丝（关注改作者的人）
      Users.getFans(author_id)
        .then(function(fans){
          //alert(JSON.stringify(data))
          if (fans && fans.length > 0){
            $scope.fans = fans;
            //
            $scope.setFocus($scope.fans);
          }
          if (mode_id == 4){
            $scope.setMode(4);
          }
        });


    });



    // set 作者关注的人 or 作者的粉丝 的关注情况
    $scope.setFocus = function(usrs){
      for(var i=0; i<usrs.length; i++){
        // check if focus already
        var isFocus = Users.checkFocus(uid, usrs[i]._id)
          .then(function(data){
            if (data == true){
              usrs[i].noFocus = false;
            }
            else{
              usrs[i].noFocus = true;
            }
          });
      }
    }

    $scope.setMode = function(mode){
      // mode: 1: 作品； 2：喜欢； 3：关注； 4：粉丝
      $scope.mode = mode;
      switch(mode){
        case 1: // 显示该作者的作品
          $scope.videos = $scope.yourVideos;
          break;
        case 2: // 该作者点过赞的作品
          $scope.videos = $scope.yourVotedVideos;
          break;
        case 3: // 该作者关注的人
          $scope.users = $scope.authorInterestedUsers;
          //alert(JSON.stringify($scope.users))

          break;
        case 4: // 该作者的粉丝（关注改作者的人）
          $scope.users =  $scope.fans;
          break;
      }
      if (mode == 3 || mode == 4){
        var length = $scope.users.length;

        for (var i=0; i<length; i++) {
          //$scope.users[i].checked = $scope.checkIfFocus($scope.users[i]._id);
          $scope.setAuthorVideos(i, $scope.users[i]._id);
        }
      }
      $scope.$apply();
    }

    $scope.modifyInterest = function(noFocus, author_id){
      var _author_id = $scope.author._id;
      if (author_id) _author_id = author_id;
      var interest = {
        uid: uid,
        interests:_author_id.split(',')
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

    $scope.goBack = function(){
      $ionicNavBarDelegate.back();
    }

    // 公用的函数
    $scope.setAuthorVideos = function(index, uid){
      var author_votes = 0;
      Videos.getAuthorVideos($scope.users[index]._id)
        .then(function (author_videos) {

          $scope.users[index].videoNo = author_videos.length;
          for (var j = 0; j < author_videos.length; j++) {
            author_votes += author_videos[j].vote;
          }
          $scope.users[index].totalVotes = author_votes;

        });
    }
  })
