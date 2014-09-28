'use strict';

angular.module('books').factory('Wiki', [ '$http', '$q',
    function($http, $q) {
        var endpoint = 'http://en.wikipedia.org/w/api.php?format=json&callback=JSON_CALLBACK';

        // Public methods
        function search(page) {
            //return $http.jsonp(endpoint + '&action=query&list=categorymembers&cmtitle=Category:20th-century British children\'s literature&cmlimit=20')
            return $http.jsonp(endpoint + '&action=query&list=categorymembers&cmtitle=Category:Children\'s books&cmlimit=50')
                .then(handleSuccess, handleError);
        }
        
        function page(page) {
            //full article content
             return $http.jsonp(endpoint + '&action=parse&page=' + page + '&prop=text')
             //infobox in wikitext format
             //return $http.jsonp(endpoint + '&action=query&prop=revisions&rvprop=content&titles=' + page)
                .then(handleSuccess, handleError);
        }
        
        // Private methods
        function handleSuccess(response) {
            if (typeof response.data === 'object') {
                return response.data;
            } else {
                // invalid response
                return $q.reject(response.data);
            }
        }
        
        function handleError(response) {
            // something went wrong
            return $q.reject(response.data);
        }

        // Return public API
        return({
            search: search,
            page: page
        });
    }
]);