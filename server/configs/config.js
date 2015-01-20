/**
 * App configuration
 */
'use strict';

var path = require('path');

var rootPath = path.normalize(__dirname + '/../../');

module.exports = {
	'development': {
		rootPath: rootPath,
		db: 'mongodb://localhost/games-test',
		port: process.env.PORT || 8080
	},
	'production': {
		rootPath: rootPath,
		db: 'mongodb://localhost/games',
		port: process.env.PORT || 8080
	}
};