'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

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
	isRead: {
		type: Boolean,
		default: false
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Book', BookSchema);