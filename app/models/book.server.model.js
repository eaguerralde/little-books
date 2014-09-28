'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;    

/**
 * BookRead Schema
 */
    var BookReadSchema = new Schema({
        user: {
            type: Schema.ObjectId,
            ref: 'User'
        },
        isRead: {
                type: Boolean,
                default: false
        }
    });    
        

/**
 * Book Schema
 */
var BookSchema = new Schema({
	title: {
		type: String,
		default: '',
		required: 'Please fill Book title',
		trim: true
	},
	pageid: {
		type: Number,
		default: 0,
		required: 'Please fill Book page id'
	},
	created: {
		type: Date,
		default: Date.now
	},
        users:[BookReadSchema]
});

mongoose.model('Book', BookSchema);