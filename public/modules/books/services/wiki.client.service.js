'use strict';

angular.module('books').factory('Wiki', [ '$http', '$q',
    function($http, $q) {
        var endpoint = 'http://en.wikipedia.org/w/api.php?format=json&callback=JSON_CALLBACK';

        // Public methods
        function list(page) {
            //return $http.jsonp(endpoint + '&action=query&list=categorymembers&cmtitle=Category:20th-century British children\'s literature&cmlimit=20')
            return $http.jsonp(endpoint + '&action=query&list=categorymembers&cmtitle=Category:Children\'s books&cmlimit=50')
                .then(function(response){
                    var result = handleSuccess(response);
                    return result.ok ? response.data.query.categorymembers : []; 
                }, handleError);
        }
        
        function page(title) {
            // extracts
            return $http.jsonp(endpoint + '&action=query&prop=extracts&format=json&exlimit=1&exintro=&exsectionformat=plain&titles=' + title)
            
            //full article content
            //return $http.jsonp(endpoint + '&action=parse&prop=text&page=' + page)

            //infobox in wikitext format
            //return $http.jsonp(endpoint + '&action=query&prop=revisions&rvprop=content&titles=' + page)

               .then(function(response){
                   var title = '',
                       text = '',
                       result = handleSuccess(response);

                       if(result.ok){
                       //extracts
                       var temp = extractFirstObjectProperty(response.data.query.pages);
                       
                       title = temp.title;
                       text = temp.extract;
                       
//                       //full article body
//                       var title = response.data.parse.title,
//                           article = response.data.parse.text['*'],
//                           pageContentSelection = $(article).filter('.infobox, p'),
//                           text = pageContentSelection[0].innerHTML;
                       }

                   return {title: title, text: text}; 
               }, handleError);
        }
        
        // Private methods
        function extractFirstObjectProperty (obj){
            for(var prop in obj){
                return obj[prop];}
        }
        
        function handleSuccess(response) {
            if (typeof response.data === 'object') {
                return {ok: true, response: response.data};
            } else {
                // invalid response
                return {ok: false, response: $q.reject(response.data)};
            }
        }
        
        function handleError(response) {
            // something went wrong
            return $q.reject(response.data);
        }

        // Return public API
        return({
            list: list,
            page: page
        });
    }
]);