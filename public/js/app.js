var meanTodo = angular.module('meanTodo', ['ngStorage', 'postServices', 'ui.router', 'postsController', 'homeController', 'aboutController', 'contactController', 'reverseFilter', 'passwordMatchDirective', 'passwordStrengthDirective', 'fileModelDirective','multipartFormService', 'LogoutController', 'LoginController', 'SignupController', 'NavbarController', 'todoController', 'todoService', 'toastr','ngRoute', 'ngMaterial', 'satellizer']);


meanTodo.config(['$urlRouterProvider', '$stateProvider', '$locationProvider', '$provide', function ($urlRouterProvider, $stateProvider, $locationProvider, $provide) {
    $locationProvider.html5Mode(true);
    $stateProvider
        .state('main', {
            url: '/',
            templateUrl : 'partials/home.html',
            controller : 'homeCtrl'
        })
        .state('about', {
            url: '/about',
            templateUrl : 'partials/about.html',
            controller : 'aboutCtrl',
            resolve: {
                loginRequired: loginRequired
            }
        })
        .state('contact', {
            url: '/contact',
            templateUrl : 'partials/contact.html',
            controller : 'contactCtrl',
            resolve: {
                loginRequired: loginRequired
            }
        })
        .state('todoList', {
            url: '/todoList',
            templateUrl: 'partials/todolist.html',
            controller: 'todoCtrl',
            resolve: {
                loginRequired: loginRequired
            }
        })
        .state('login', {
            url: '/login',
            templateUrl: 'partials/login.html',
            controller: 'LoginCtrl',
            resolve: {
                skipIfLoggedIn: skipIfLoggedIn
            }
        })
        .state('signup', {
            url: '/signup',
            templateUrl: 'partials/signup.html',
            controller: 'SignupCtrl',
            resolve: {
                skipIfLoggedIn: skipIfLoggedIn
            }
        })
        .state('logout', {
            url: '/logout',
            templateUrl: 'partials/home.html',
            controller: 'LogoutCtrl'
        })
        .state('posts/:id', {
            url: '/posts/:id',
            templateUrl: 'partials/posts.html',
            controller: 'PostsCtrl',
            resolve: {
                loginRequired: loginRequired,
                posts: ['$localStorage', 'blogPosts', function($localStorage, blogPosts) {
                    if (blogPosts.post.length != 0) {
                        $localStorage.blogPosts = blogPosts.post;
                    }
                    return $localStorage.blogPosts;
                }]
            }
        });

    $provide.decorator('$state', function ($delegate, $stateParams) {
        $delegate.forceReload = function () {
            return $delegate.go($delegate.current, $stateParams, {
                reload: true,
                inherit: false,
                notify: true
            })
        };
        return $delegate;
    }) ;



    $urlRouterProvider.otherwise('/');
}]);

/*meanTodo.config(['$routeProvider', '$authProvider', function ($routeProvider, $authProvider) {
    $routeProvider
        .when('/', {
            templateUrl : 'partials/home.html',
            controller : 'homeCtrl'
        })
        .when('/about', {
            templateUrl : 'partials/about.html',
            controller : 'aboutCtrl',
            resolve: {
                loginRequired: loginRequired
            }
        })
        .when('/contact', {
            templateUrl : 'partials/contact.html',
            controller : 'contactCtrl',
            resolve: {
                loginRequired: loginRequired
            }
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
        })
        .when('/posts/:id', {
            templateUrl: 'partials/posts.html',
            controller: 'PostsCtrl',
            resolve: {
                loginRequired: loginRequired
            }
        });
}]);*/




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
