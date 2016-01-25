/**
 * Created by hhu on 2015/11/17.
 */

app = angular.module('admin', ['ui.bootstrap', 'isteven-multi-select']);
var API_URL = 'http://182.92.230.67:33445';
var UPLOAD_URL = 'http://101.200.81.99:8888';

app.controller('adminCtrl', function($scope, $http) {
  $scope.optionCat = '';
  $scope.tags = [];
  $scope.initTags = [];
  $scope.selectedTags = [];

  $http.get(API_URL + '/tag')
    .then(function(response){
      if (response.data.return == 'empty'){
        alert('没有视频数据');
      }
      else{
        $scope.tags = response.data;
        if ($scope.tags && $scope.tags.length > 0){
          $scope.optionCat = $scope.tags[0].tag;

          // 新建Videos时，选择 tags
          angular.forEach($scope.tags, function(value){
            $scope.initTags.push({ticked : false, tag: value.tag})
          });
        }
      }
    });

  getVideos($scope,$http);

  $scope.showEdit = true;
  $scope.master = {};


  //$scope.selectTags = [
  //  {	name: "Opera",	ticked: true	},
  //  {	name: "Firefox",	ticked: true	},
  //  {	name: "Chrome",	ticked: true	}
  //];
});


app.directive("add",function($document){
  return{
    restrict: 'AE',
    require: 'ngModel',
    link: function(scope,element,attrs,ngModel){
      element.bind("click",function(){
        scope.$apply(function(){
          var video = ngModel.$modelValue;
          video.cat_id = '111';
          video.type = 1;
          video.author = '111111111111111111111111';
          video.poster = 'assets/' + video.url + '.jpg';
          video.icon = 'assets/' + video.url + '.icon.jpg';
          var _tags = [];
          angular.forEach(scope.selectedTags, function(item){
            _tags.push(item.tag);
          });
          video.tags = _tags.join(',');
          if (!video.name){
            alert('标题不能为空');
            return;
          }

          insertVideo(video, scope.http);
          extractImage(video.url, scope.http);
          scope.videos.push(0, 0, video);

          $('#addVideo').modal('hide'); // call jquery function. weired, change it later!
          alert('创建视频成功，如需更新请F5刷新页面。');
        })
      });
    }
  }
});

app.directive("edit",function($document){
  return{
    restrict: 'AE',
    require: 'ngModel',
    link: function(scope,element,attrs,ngModel){
      element.bind("click",function(){
        var classid = "class" + ngModel.$modelValue._id;
        scope.$apply(function(){
          angular.copy(ngModel.$modelValue,scope.master);
          //console.log(scope.master);
        })
        //console.log(id);
        var obj = $("."+classid);
        obj.removeClass("inactive");
        obj.addClass("active");
        obj.removeAttr("readOnly");
        scope.$apply(function(){
          scope.showEdit = false;
        })
      });
    }
  }
});

app.directive("update",function($document){
  return{
    restrict: 'AE',
    require: 'ngModel',
    link: function(scope,element,attrs,ngModel,http){
      element.bind("click",function(){
        var classid = "class" + ngModel.$modelValue._id;
        var obj = $("."+classid);
        obj.removeClass("active");
        obj.addClass("inactive");
        obj.attr("readOnly",true);
        scope.$apply(function(){
          //alert(JSON.stringify(ngModel))

          updateVideo(ngModel,scope.http);
          scope.showEdit = true;
        })
      })
    }
  }
});

app.directive("cancel",function($document){
  return{
    restrict: 'AE',
    require: 'ngModel',
    link: function(scope,element,attrs,ngModel){
      element.bind("click",function(){
        scope.$apply(function(){
          angular.copy(scope.master,ngModel.$modelValue);
        })

        var classid = "class" +ngModel.$modelValue._id;
        var obj = $("."+classid);
        obj.removeClass("active");
        obj.addClass("inactive");
        obj.prop("readOnly",true);
        scope.$apply(function(){
          scope.showEdit = true;
        })
      })
    }
  }
});

app.directive("delete",function($document){
  return{
    restrict:'AE',
    require: 'ngModel',
    link:function(scope, element, attrs,ngModel){
      element.bind("click",function(){
        var id = ngModel.$modelValue._id;
        //alert("delete item where id:=" + id);
        scope.$apply(function(){
          if(!confirm('您确定删除这条记录？'))
            return;

          // delete form the db
          deleteVideo(id,scope);

          for(var i=0; i<scope.videos.length; i++){
            if(scope.videos[i]._id==id){
              //console.log(scope.videos[i])
              scope.videos.splice(i,1);
            }
          }
        })
      })
    }
  }
});


// FUNCTIONS

Object.toParams = function ObjecttoParams(obj) {
  var p = [];
  for (var key in obj) {
    p.push(key + '=' + encodeURIComponent(obj[key]));
  }
  return p.join('&');
};

var getVideos = function($scope,$http){
  $http.get(API_URL + '/videos/1')
    .then(function(response){
      if (response.data.return == 'empty'){
        alert('没有视频数据');
      }
      else{
        $scope.videos = response.data;
        $scope.http = $http;
      }
    });
}

var updateVideo = function(ngModel,$http){
  //ngModel.$modelValue.content = '';
  //alert(Object.toParams(ngModel.$modelValue));

  var video = ngModel.$modelValue;
  video.author = '111111111111111111111111';
  video.poster = 'assets/' + video.url + '.jpg';
  video.icon = 'assets/' + video.url + '.icon.jpg';
  //video.tags = video.tags.join(',');

  //alert(JSON.stringify(video))

  $http.put(API_URL + '/video',
    //ngModel.$modelValue,{
    Object.toParams(video),{
      dataType: 'json',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    })
    .success(function(data, status, headers, config){
      if (response.data == 'error'){
        alert('没有视频数据');
      }
      else {
        //$scope.videos = response.data;
      }
    })
    .error(function(data,status, headers, config){
      alert('update video error');
    });
}

var insertVideo = function(model,$http){
  $http.post(API_URL + '/video',
    Object.toParams(model),{
      dataType: 'json',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    })
    .success(function(data, status, headers, config){
      if (response.data.return == 'error'){
        alert('insert error');
      }
      else {
        alert('done');
        //$scope.videos = response.data;
      }
    })
    .error(function(data,status, headers, config){
      alert('insert video error');
    });
}

var extractImage = function(fileName,$http){

  $http.get(UPLOAD_URL + '/extractimg/' + fileName)
    .success(function(data, status, headers, config){
      if (response.data.return != undefined){
        alert('extract image error');
      }
      else {
        //$scope.videos = response.data;
      }
    })
    //.error(function(data,status, headers, config){
    //  alert('extract image error');
    //});
}

var deleteVideo = function(id,$scope){

  $scope.http.delete(API_URL + '/video/' + id)
    .success(function(data, status, headers, config){
      if (response.data == 'error'){
        alert('没有视频数据');
      }
      else {
        //alert('delete done');
        $scope.videos = response.data;
      }
    })
    //.error(function(data,status, headers, config){
    //  alert('delete video error');
    //});
}
