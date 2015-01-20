/**
 * Mongoose configuration
 */
'use strict';

var mongoose = require('mongoose'),
	User = require('../models/User'),
	Game = require('../models/Game');

module.exports = function(config) {
	mongoose.connect(config.db);
	var db = mongoose.connection;

	db.once('open', function(err) {
		if(err) {
			console.log('DB not opened: ' + err);
			return;
		}
	});

	db.on('error', function() {
		console.log('DB error!');
	});
};