'use strict';

//Setting up route
angular.module('books').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/');
                
		// Books state routing
		$stateProvider.
		state('home', {
			url: '/',
			templateUrl: 'modules/books/views/home.client.view.html'
		}).
		state('listBooks', {
			url: '/books',
			templateUrl: 'modules/books/views/list-books.client.view.html'
		}).
		state('createBook', {
			url: '/books/create',
			templateUrl: 'modules/books/views/create-book.client.view.html'
		}).
		state('viewBook', {
			url: '/books/:bookId',
			templateUrl: 'modules/books/views/view-book.client.view.html'
		}).
		state('editBook', {
			url: '/books/:bookId/edit',
			templateUrl: 'modules/books/views/edit-book.client.view.html'
		});
	}
]);