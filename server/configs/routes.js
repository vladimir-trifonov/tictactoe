/**
 * Express routes configuration
 */
'use strict';

var usersCtrl = require('../controllers/usersCtrl');

module.exports = function(app) {
	app.get('/', function(req, res){
	    res.render('index');
	});

	app.post('/login', usersCtrl.login);
};