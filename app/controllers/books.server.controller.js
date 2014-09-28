'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	Book = mongoose.model('Book'),
	_ = require('lodash');

/**
 * Create a Book
 */
exports.create = function(req, res) {
	var book = new Book(req.body);
	book.users.push(req.user);

	book.save(function(err) {
            if (err) {
                return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                });
            } else {
                res.jsonp(book);
            }
	});
};

/**
 * Show the current Book
 */
exports.read = function(req, res) {
	res.jsonp(req.book);
};

/**
 * Update a Book
 */
exports.update = function(req, res) {
	var book = req.book ;

	book = _.extend(book , req.body);

//	book.save(function(err) {
//            if (err) {
//                return res.status(400).send({
//                    message: errorHandler.getErrorMessage(err)
//                });
//            } else {
//                res.jsonp(book);
//            }
//	});
        
        book.update({'users.id': req.user.id}, {'$set': {
            'users.$.isRead': true
        }},function(err) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                res.jsonp(book);
            }
	});
};

/**
 * Delete an Book
 */
exports.delete = function(req, res) {
    //TODO: no books need to be deleted but it users entry 
    
//	var book = req.book ;
//
//	book.remove(function(err) {
//		if (err) {
//			return res.status(400).send({
//				message: errorHandler.getErrorMessage(err)
//			});
//		} else {
//			res.jsonp(book);
//		}
//	});
};

/**
 * List of Books
 */
exports.list = function(req, res) { Book.find().sort('-created').populate('user', 'displayName').exec(function(err, books) {
        //TODO: list books for a particular user
        if (err) {
                return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                });
        } else {
                res.jsonp(books);
        }
    });
};

/**
 * Book middleware
 */
exports.bookByID = function(req, res, next, id) { Book.findById(id).populate('user', 'displayName').exec(function(err, book) {
        if (err) return next(err);
        if (! book) return next(new Error('Failed to load Book ' + id));
        req.book = book ;
        next();
    });
};

/**
 * Book authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
    //allow only same user data
    var isBookUser = _.find(req.book.users, function(user){
        return user.id === req.user.id;
    });
    
    if (!isBookUser) {
        return res.status(403).send('User is not authorized');
    }
    next();
};