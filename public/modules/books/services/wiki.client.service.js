'use strict';

angular.module('books').factory('Wiki', [ '$http',
	function($http) {
            var endpoint = 'http://en.wikipedia.org/w/api.php?format=json&action=query&titles=Main%20Page&prop=revisions&rvprop=content&callback=JSON_CALLBACK';
            
            // Public methods
            function search(name, success, error) {
                return $http.jsonp(endpoint)
                    .success(function(data, status, headers, config) {
                        angular.isFunction(success) && success(data.query.pages,status,headers,config);
                    })
                    .error(function(data, status, headers, config) {
                        angular.isFunction(error) && error(data,status,headers,config);
                    });
            }

            // Return public API
            return({
                search: search
            });
	}
]);