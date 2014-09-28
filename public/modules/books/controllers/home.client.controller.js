'use strict';

angular.module('books')
    .controller('HomeController', ['$scope', 'Authentication', '$sce', 'Wiki', 'Books',
	function($scope, Authentication, $sce, Wiki, Books) {
            // Init scope vars
            // This provides Authentication context. 
            $scope.authentication = Authentication;
            
            // Book list and preview display holders 
            $scope.booksList = [];
            $scope.wikiPreview = {title: 'Select one book from the list'};

            // Handlers
            //display selected item content preview when items are selected
            $scope.wikiItemHandler = function(item){
                itemSelectionHandler(item);
                
                Wiki.page(item.title).then(function(data){
                    $scope.wikiPreview.title = data.title;
                    $scope.wikiPreview.text = $sce.trustAsHtml(data.text);
                });
            };
            
            // handle checkbox for read books
            $scope.bookIsReadHandler = function(book){
                var userRead = {
                    user: $scope.authentication.user,
                    isRead: book.isRead
                };
                
                if(book.users != undefined){
                    //Update user book data
                    book.$update({$push: {users: userRead}})
                    .then(function(sb, b){
                        
                    });
                }else{
                    // No user data so create new Book object
                    var newBook = new Books ({
                            title: book.title,
                            pageid: book.pageid
                            ,
                            users: {$push: {users: userRead}}
                    });

                    // Save Book
                    newBook.$save().then(function(sb, b){
                        book = newBook;
                    });
                }
            };
            
            // Private methods
            function itemSelectionHandler(selectedBook){
                if(selectedBook.itemSelected){
                   selectedBook.itemSelected = false; 
                }else{
                    $.each($scope.booksList, function(i, book){
                        book.itemSelected && (book.itemSelected = false);
                    });
                    
                   selectedBook.itemSelected = true;
                }
            }
            
            function mergeWikiBooks(wikiPages, books){
                var booksList = $scope.booksList;
                if(wikiPages){
                    if(booksList){
                        //add wiki page if not in list
                        $.each(wikiPages, function(index, page){
                            var match = $.grep(booksList, function(book){
                                return book.pageid == page.pageid; 
                            });
                            
                            if (!match.length){
                               $scope.booksList.push(page); 
                            }
                        });
                    }else{
                        $scope.booksList = wikiPages;
                    }
                }
                
                if(books){
                    if(booksList){
                        //add wiki page if not in list
                        $.each(books, function(index, book){
                            $.each(booksList, function(i, page){
                                if(book.pageid == page.pageid){
                                    //Update list, replace with new Book object
                                    booksList[i] = book;
                                } 
                            });
                        });
                    }else{
                        $scope.booksList = books;
                    }
                }
            }
            
            // init UI
            // Display list of books
            Wiki.list().then(function(results){
                mergeWikiBooks(results);
                // Load user books data if logged in and has any
                Books.query(function(results){
                    mergeWikiBooks(undefined, results);
                });
            });
	}
]);