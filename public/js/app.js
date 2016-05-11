var meanTodo = angular.module('meanTodo', ['homeController', 'aboutController', 'contactController', 'reverseFilter', 'passwordMatchDirective', 'passwordStrengthDirective', 'fileModelDirective','multipartFormService', 'LogoutController', 'LoginController', 'SignupController', 'NavbarController', 'todoController', 'todoService', 'toastr','ngRoute', 'ngMaterial', 'satellizer']);


meanTodo.config(['$routeProvider', '$authProvider', function ($routeProvider, $authProvider) {
    $routeProvider
        .when('/', {
            templateUrl : 'partials/home.html',
            controller : 'homeCtrl'
        })
        .when('/about', {
            templateUrl : 'partials/about.html',
            controller : 'aboutCtrl'
        })
        .when('/contact', {
            templateUrl : 'partials/contact.html',
            controller : 'contactCtrl'
        })
        .when('/todoList', {
            templateUrl: 'partials/todolist.html',
            controller: 'todoCtrl',
            resolve: {
                loginRequired: loginRequired
            }
        })
        .when('/login', {
            templateUrl: 'partials/login.html',
            controller: 'LoginCtrl',
            resolve: {
                skipIfLoggedIn: skipIfLoggedIn
            }
        })
        .when('/signup', {
            templateUrl: 'partials/signup.html',
            controller: 'SignupCtrl',
            resolve: {
                skipIfLoggedIn: skipIfLoggedIn
            }
        })
        .when('/logout', {
            templateUrl: 'partials/home.html',
            controller: 'LogoutCtrl'
        });
}]);




function skipIfLoggedIn($q, $auth) {
    var deferred = $q.defer();
    if ($auth.isAuthenticated()) {
        deferred.reject();
    } else {
        deferred.resolve();
    }
    return deferred.promise;
}


function loginRequired($q, $location, $auth) {
    var deferred = $q.defer();
    if ($auth.isAuthenticated()) {
        deferred.resolve();
    } else {
        $location.path('/login');
    }
    return deferred.promise;
}
