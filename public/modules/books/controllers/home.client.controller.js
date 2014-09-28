'use strict';

angular.module('books')
    .controller('HomeController', ['$scope', 'Authentication', 'Wiki', '$sce',
	function($scope, Authentication, Wiki, $sce) {
		// This provides Authentication context. 
		$scope.authentication = Authentication;

                // Init scope vars
                $scope.wikiList = [];
                $scope.wikiPreview = {title: 'Select one book from the list'};
                
                // Display list of books
                Wiki.list().then(function(data){
                    $scope.wikiList = data;
                });
                
                // Handlers
                $scope.wikiItemHandler = function(item){
                    //display selected item content preview
                    Wiki.page(item.title).then(function(data){
                        $scope.wikiPreview.title = data.title;
                        $scope.wikiPreview.text = $sce.trustAsHtml(data.text);
                    });
                };
                
                
                
	}
]);