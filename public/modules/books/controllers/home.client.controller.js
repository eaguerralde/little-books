'use strict';

angular.module('books').controller('HomeController', ['$scope', 'Authentication', 'Wiki',
	function($scope, Authentication, Wiki) {
		// This provides Authentication context.
		$scope.authentication = Authentication;

                $scope.wikiList = [];
                
                Wiki.search('', function(data){
                    $scope.wikiList = data;
                });
                
                
	}
]);