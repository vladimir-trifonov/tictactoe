/**
 * Express configuration
 */
'use strict';

var express = require('express'),
	cookieParser = require('cookie-parser'),
	bodyParser = require('body-parser'),
    session = require('express-session'),
    MongoStore = require('connect-mongo')(session);

module.exports = function(app, config) {
	app.set('views', config.rootPath + '/views');
	app.set('view engine', 'jade');
	app.engine('jade', require('jade').__express);

	app.use(cookieParser());
	app.use(bodyParser.urlencoded({
		extended: false
	}));
	app.use(bodyParser.json());

	app.use(session({
		store: new MongoStore({
			url: config.db
		}),
		secret: 'gergenymntyuy45by4ERGH#qa45v',
		cookie: {
			secure: false,
			maxAge: 86400000
		},
		resave: true,
		saveUninitialized: true
	}));

	app.use(express.static(config.rootPath + '/public'));
};