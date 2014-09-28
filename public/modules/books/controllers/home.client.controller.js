'use strict';

angular.module('books')
    .controller('HomeController', ['$scope', 'Authentication', '$sce', 'Wiki', 'Books',
	function($scope, Authentication, $sce, Wiki, Books) {
            // Init scope vars
            // This provides Authentication context. 
            $scope.authentication = Authentication;
            
            // Load user books if logged in and has any
            $scope.booksList = [];
            
            $scope.wikiPreview = {title: 'Select one book from the list'};

            // Handlers
            $scope.wikiItemHandler = function(item){
                //display selected item content preview
                Wiki.page(item.title).then(function(data){
                    $scope.wikiPreview.title = data.title;
                    $scope.wikiPreview.text = $sce.trustAsHtml(data.text);
                });
            };

            $scope.bookSelectedHandler = function(item){
                
            };
            
            $scope.bookIsReadHandler = function(book){
                if(book.user){
                    //Update user book data
                    book.$update();
                }else{
                    // No user data so create new Book object
                    var book = new Books ({
                            title: book.title,
                            pageid: book.pageid,
                            isRead: true
                    });

                    // Save Book
                    book.$save();
                }
            }
            
            // Private methods
            function mergeWikiBooks(wikiPages, books){
                // create objects like this
                // {
                //    _id: string
                //    created: date,
                //    pageid: int,
                //    isRead: bool,
                //    title: string,
                //    user: {_id: string, displayName: string }
                // }

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