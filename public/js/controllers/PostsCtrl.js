angular.module('postsController', [])
    .controller('PostsCtrl', function($scope, $stateParams, posts, Todos){
        $scope.post = posts[$stateParams.id];
            $scope.addComment = function(){
                if($scope.comment === '') { return; }
                var postData = {comment: $scope.comment, postId: $stateParams.id};
                Todos.addComment(postData)
                    .success(function (data) {
                        $scope.comment = '';
                        posts[$stateParams.id].comments = data;
                    });
            };

        });
