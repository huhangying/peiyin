// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services','ngCordova', 'starter.register'])

.run(function($ionicPlatform,$cordovaMedia, $rootScope) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
    if (ionic.Platform.isAndroid()) {
      $rootScope.rootDir = cordova.file.externalDataDirectory;
    }
    else if (ionic.Platform.isIOS()){
      $rootScope.rootDir = cordova.file.documentsDirectory;
    }
  });

  // 记住上一页
  $rootScope.$on('$stateChangeSuccess', function (ev, to, toParams, from, fromParams) {
    if (to.name == 'signin' && to.name != 'register' && to.name != 'forgotpassword')
      $rootScope.previousState = from.name; // 记住要求鉴权的页面
    else
      $rootScope.previousState = '';
  });

})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.home', {
    url: '/home',
    views: {
      'tab-home': {
        templateUrl: 'templates/tab-home.html',
        controller: 'HomeCtrl'
      }
    }
  })

    .state('tab.focus', {
      url: '/focus',
      views: {
        'tab-focus': {
          templateUrl: 'templates/tab-focus.html',
          controller: 'FocusCtrl'
        }
      }
    })

    .state('tab.focusAdd', {
      url: '/focus/add',
      views: {
        'tab-focus': {
          templateUrl: 'templates/tab-focus-add.html',
          controller: 'FocusAddCtrl'
        }
      }
    })

  .state('tab.cats', {
      url: '/cats',
      views: {
        'tab-cats': {
          templateUrl: 'templates/tab-cats.html',
          controller: 'CatsCtrl'
        }
      }
    })

    .state('tab.record', {
      url: '/record/:catId',
      views: {
        'tab-cats': {
          templateUrl: 'templates/record.html',
          controller: 'RecordCtrl'
        }
      }
    })

    //
    .state('tab.video', {
      url: '/video/:vid',
      views: {
        'tab-noshow': {
          templateUrl: 'templates/video.html',
          controller: 'VideoCtrl'
        }
      }
    })

    // 纯单个视频的播放(不包括用户和评论等，没有数据库)
    .state('tab.player', {
      url: '/player/:vid',
      views: {
        'tab-noshow': {
          templateUrl: 'templates/player.html',
          controller: 'PlayerCtrl'
        }
      }
    })

  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  })


  // 用户注册相关
    .state('signin', {
      url: '/sign-in',
      templateUrl: 'templates/register/sign-in.html',
      controller: 'SignInCtrl'
    })
    .state('register', {
      url: '/register',
      templateUrl: 'templates/register/register.html',
      controller: 'RegisterCtrl'
    })
    .state('forgotpassword', {
      url: '/forgot-password',
      templateUrl: 'templates/register/forgot-password.html'
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/home');

  // 解决Android设备上tab变到上面去的问题
  $ionicConfigProvider.platform.android.tabs.position("bottom");
  $ionicConfigProvider.tabs.style('standard');


});
