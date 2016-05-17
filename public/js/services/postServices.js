angular.module('postServices', [])
.factory('blogPosts', function() {
    var blogPost= {
            post: []
        };
    return blogPost;
});