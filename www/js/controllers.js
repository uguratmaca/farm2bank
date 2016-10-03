angular.module('starter.controllers', [])


  .controller('AppCtrl', function ($scope, $ionicModal, $timeout) {


  })
  .controller('AboutCtrl', function ($scope, $ionicModal, $timeout) {

  })
  .controller('MainCtrl', function ($scope, $ionicModal, $timeout, $filter, $rootScope, $http, $state, $ionicLoading) {

    $ionicLoading.show({
      content: 'Loading',
      animation: 'fade-in',
      showBackdrop: true,
      maxWidth: 200,
      showDelay: 0
    });

    $http.get("https://glowing-heat-2126.firebaseio.com/questions.json").success(
      function (data) {

        $rootScope.questionsJSON = data;
        $ionicLoading.hide();

      });

    $scope.getSelected = function (id) {
      if (!$rootScope.answers) {
        $rootScope.answers = [];
      }
      var found = $filter('filter')($rootScope.answers, {SurveyId: id});
      if (found.length > 0) {
        return true;
      }
      return false;
    };

    if (!$rootScope.answers) {

      $rootScope.answers = [{
        "SurveyId": 1,
        "QuestionId": 1,
        "AnswerId": 34
      }];
    }


    $scope.search = function () {

      $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
      });

      $http.get("https://glowing-heat-2126.firebaseio.com/cities.json").success(
        function (data) {
          $scope.cities = data;

          $http.get("https://glowing-heat-2126.firebaseio.com/products.json").success(
            function (products) {

              var oldProds = angular.copy(products);

              angular.forEach($rootScope.answers, function (ans, index) {
                if (ans.QuestionId == 2) {
                  if (ans.AnswerId == 4) {
                    newAns = 3;
                  }
                  else {
                    newAns = ans.AnswerId;
                  }

                  products = $filter('filter')(products, { ['q' + ans.QuestionId]
                :
                  newAns
                })
                  ;
                } else if (ans.QuestionId == 1) {

                  products = $filter('filter')(products, { ['q' + ans.QuestionId]
                :
                  $scope.cities[(ans.AnswerId - 1)].Iklim
                })
                  ;


                }
                else {
                  products = $filter('filter')(products, { ['q' + ans.QuestionId]
                :
                  ans.AnswerId
                })
                  ;
                }
                if (products.length > 0) {
                  if ($rootScope.answers.length - 1 == index) {
                    var count = products.length;
                    var rand = Math.floor((Math.random() * (count)));
                    $state.go('app.result', {resultId: products[rand].Id});
                  } else {
                    oldProds = angular.copy(products);
                  }
                }
                else {
                  var count = oldProds.length;
                  var rand = Math.floor((Math.random() * (count - 1)) + 1);
                  $ionicLoading.hide();
                  $state.go('app.result', {resultId: oldProds[rand].Id});
                }
              });
            }
          );


        }
      );


    }
    ;


  })

  .
  controller('SurveyCtrl', function ($scope, $stateParams, $http, $filter, $rootScope, $state, $ionicSlideBoxDelegate) {


    var id = $stateParams.surveyId;
    $scope.surveyQuestions = $filter('filter')($rootScope.questionsJSON, {SurveyId: id});

    $scope.hasAnswer = function (questId) {

      var res = ($filter('filter')($rootScope.answers, {SurveyId: $stateParams.surveyId, QuestionId: questId}));
      return res && res.length > 0;

    };

    $scope.clearAnswer = function (questId) {
      var found = $filter('filter')($rootScope.answers, {SurveyId: id, QuestionId: questId});
      if (found.length > 0) {
        $rootScope.answers.pop(found[0]);
      }
    };

    function removeFromArray(array, value) {
      var idx = array.indexOf(value);
      if (idx !== -1) {
        array.splice(idx, 1);
      }
      return array;
    }

    $scope.saveAnswer = function (ansId, quest) {

      var found = $filter('filter')($rootScope.answers, {SurveyId: id, QuestionId: quest.Id});
      if (found.length > 0) {
        var fnew = angular.copy(found[0]);
        removeFromArray($rootScope.answers, found[0]);
        fnew.AnswerId = ansId;
        $rootScope.answers.push(fnew);
      }
      else {
        $rootScope.answers.push(
          {
            "SurveyId": id,
            "QuestionId": quest.Id,
            "AnswerId": ansId
          }
        );
      }

      $scope.next();

    };

    $scope.next = function () {

      if ($scope.surveyQuestions.length - 1 == $ionicSlideBoxDelegate.currentIndex()) {
        $state.go('app.main');
      }
      else {
        $scope.$broadcast('slideBox.nextSlide');
      }
    };

    $scope.getSelected = function (qId, aId) {
      if (!$rootScope.answers) {
        $rootScope.answers = [];
      }
      var found = $filter('filter')($rootScope.answers, {QuestionId: qId, AnswerId: aId});
      if (found.length > 0) {
        return true;
      }
      return false;
    };

    $scope.getSelectedOption = function (qId, aId) {

      var found = $filter('filter')($rootScope.answers, {QuestionId: qId, AnswerId: aId});
      if (found.length > 0) {
        return found[0].AnswerId;
      }
    }

  })

  .controller('ResultCtrl', function ($scope, $stateParams, $http, $state, $ionicLoading, $rootScope) {

    $ionicLoading.hide();
    var id = parseInt($stateParams.resultId) - 1;

    $http.get("https://glowing-heat-2126.firebaseio.com/products/" + id + ".json").success(
      function (data) {

        $scope.resultProd = data;

      });

    $scope.next = function () {

      $state.go('app.banking');

    };

    $scope.back = function () {
      $rootScope.answers = [{
        "SurveyId": 1,
        "QuestionId": 1,
        "AnswerId": 34
      }];
      $state.go('app.main');
    };

  })

  .controller('BankingCtrl', function ($scope, $state, $rootScope, $http, $ionicPopup, $ionicLoading) {

    $scope.credit = {};

    $scope.cancel = function () {
      $scope.credit = {};
      $rootScope.answers = [{
        "SurveyId": 1,
        "QuestionId": 1,
        "AnswerId": 34
      }];
      $state.go('app.main');
    };

    $scope.save = function () {

      $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
      });

      var data = {
        "credit": $scope.credit,
        "survey": $rootScope.answers
      };

      $http.post('https://glowing-heat-2126.firebaseio.com/credits.json', data).then(function () {

        $rootScope.answers = [{
          "SurveyId": 1,
          "QuestionId": 1,
          "AnswerId": 34
        }];

        $ionicLoading.hide();

        var alertPopup = $ionicPopup.alert({
          title: 'Sonuç',
          template: 'Başvurunuz alınmıştır.'
        });

        alertPopup.then(function (res) {
          $state.go('app.main');
          $scope.credit = {};
        });


      }, function () {

      });

    };


  })

  .controller('AnalyzeCtrl', function ($scope, $stateParams) {
  });
