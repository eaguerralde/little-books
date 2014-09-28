'use strict';

angular.module('books')
    .controller('HomeController', ['$scope', 'Authentication', 'Wiki', '$sce',
	function($scope, Authentication, Wiki, $sce) {
		// This provides Authentication context. 
		$scope.authentication = Authentication;

                $scope.wikiList = [];
                $scope.wikiPreview = {title: 'Select one book from the list'};
                
                Wiki.search().then(function(data){
                    $scope.wikiList = data.query.categorymembers;
                });
                
                $scope.wikiItemHandler = function(item){
                    Wiki.page(item.title).then(function(data){
                        //full article body
                        var article = data.parse && data.parse.text['*'],
                            infobox = $(article).filter('.infobox, p');
                        $scope.wikiPreview.title = data.parse.title;
                        $scope.wikiPreview.text = $sce.trustAsHtml(infobox[0] && infobox[0].innerHTML);

                        //infobox content
//                        $scope.wikiPreview.title = data.pages.title;
//                        $scope.wikiPreview.text = $sce.trustAsHtml(data.parse.text['*']);
                    });
                };
                
                
                
	}
]);