angular.module('todoController', [])
.controller('todoCtrl', ['$scope', 'toastr', '$http', 'Todos', 'multipartForm', 'blogPosts', '$stateParams', function ($scope, toastr, $http, Todos, multipartForm, blogPosts) {
    $scope.formData = {};
    Todos.getUserId()
        .success(function (data) {
            $scope.userId = data;
        });

    Todos.get()
        .success(function (data) {
            $scope.todos = data;
            for (var i=0; i < data.length; i++){
                blogPosts.post[i] = data[i];
            }
        });


    $scope.submitBlog = function () {
        if(!$.isEmptyObject($scope.formData.body) && !$.isEmptyObject($scope.formData.title) && !($scope.formData.file == null)) {
            $scope.formData.date = getCurrentDate(new Date());
            $scope.formData.userId = $scope.userId;
            var uploadUrl = '/upload';
            multipartForm.post(uploadUrl, $scope.formData)
                .success(function (data) {
                    $scope.formData = {};
                    $scope.todos = data;
                    for (var i=0; i < data.length; i++){
                        blogPosts.post[i] = data[i];
                    }

                })
        }

    };



    $scope.deleteTodo = function (id) {
        Todos.delete(id)
            .success(function (data) {
                $scope.todos = data;
                for (var i=0; i < data.length; i++){
                    blogPosts.post[i] = data[i];
                }
            });
    };

    function getCurrentDate(date) {
        var mm = parseInt(date.getMonth());
        mm = mm + 1;
        return date.getDate()+'/'+mm+'/'+date.getFullYear();
    }

}]);