angular.module('NavbarController', [])
    .controller('NavbarCtrl', [
        '$scope',
        '$auth',
        function($scope, $auth) {
            $scope.isAuthenticated = function() {
                return $auth.isAuthenticated();
            };
        }]);