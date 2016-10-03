angular.module('starter', ['ionic', 'starter.controllers'])

  .run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);

      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }
    });
  })

  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider

      .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl'
      })

      .state('app.main', {
        url: '/main',
        views: {
          'menuContent': {
            templateUrl: 'templates/main.html',
            controller: 'MainCtrl'
          }
        }
      })

      .state('app.analyze', {
        url: '/analyze',
        views: {
          'menuContent': {
            templateUrl: 'templates/analyze.html',
            controller: 'AnalyzeCtrl'
          }
        }
      })

      .state('app.banking', {
        url: '/banking',
        views: {
          'menuContent': {
            templateUrl: 'templates/banking.html',
            controller: 'BankingCtrl'
          }
        }
      })
      .state('app.result', {
        url: '/result/:resultId',
        views: {
          'menuContent': {
            templateUrl: 'templates/result.html',
            controller: 'ResultCtrl'
          }
        }
      })

      .state('app.about', {
        url: '/about',
        views: {
          'menuContent': {
            templateUrl: 'templates/about.html',
            controller: 'AboutCtrl'
          }
        }
      })

      .state('app.single', {
        url: '/survey/:surveyId',
        views: {
          'menuContent': {
            templateUrl: 'templates/survey.html',
            controller: 'SurveyCtrl'
          }
        }
      });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/main');
  });
