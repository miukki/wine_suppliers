angular
  .module('app', [
    'ui.router',
    'lbServices'//depends on the Angular resource script (angular-resource.js)
  ])
  .config(['$stateProvider', '$urlRouterProvider',  'LoopBackResourceProvider', function($stateProvider,
      $urlRouterProvider, LoopBackResourceProvider) {

    // Use a custom auth header instead of the default 'Authorization'
    LoopBackResourceProvider.setAuthHeader('X-Access-Token');

    // Change the URL where to access the LoopBack REST API server
    //LoopBackResourceProvider.setUrlBase('http://api.example.com/');

    $stateProvider
      .state('all-wines', {
        url: '/all-wines',
        templateUrl: 'views/all-wines.html',
        controller: 'AllWinesController'
      });

      /*
      .state('forbidden', {
        url: '/forbidden',
        templateUrl: 'views/forbidden.html',
      })
      .state('login', {
        url: '/login',
        templateUrl: 'views/login.html',
        controller: 'AuthLoginController'
      })
      .state('logout', {
        url: '/logout',
        controller: 'AuthLogoutController'
      })
      .state('my-reviews', {
        url: '/my-reviews',
        templateUrl: 'views/my-reviews.html',
        controller: 'MyReviewsController',
        authenticate: true
      })
      .state('sign-up', {
        url: '/sign-up',
        templateUrl: 'views/sign-up-form.html',
        controller: 'SignUpController',
      })
      .state('sign-up-success', {
        url: '/sign-up/success',
        templateUrl: 'views/sign-up-success.html'
      });
      */

    $urlRouterProvider.otherwise('all-wines');
  }])
  .run(['$rootScope', '$state', function($rootScope, $state) {
    $rootScope.$on('$stateChangeStart', function(event, next) {
      // redirect to login page if not logged in
      /*
      reject auth now
      if (next.authenticate && !$rootScope.currentUser) {
        event.preventDefault(); //prevent current page from loading
        $state.go('forbidden');
      }

      */

    });
  }]);
