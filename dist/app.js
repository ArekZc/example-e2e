var APP_NAME = 'application';
angular.module('application.pages', []);
angular.module(APP_NAME, [
    'application.pages',
    'ui.router'
])
    .config([
    '$stateProvider',
    '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("/dashboard");
        $stateProvider
            .state('dashboard', {
            url: '/dashboard',
            templateUrl: 'pages/dashboard/dashboard.html'
        });
    }
]);
angular.element(document).ready(function () {
    angular.bootstrap(document, [APP_NAME]);
});
