/**
 * Redis configuration
 */
'use strict';

var mainCtrl = require('../controllers/mainCtrl'),
	redis = require('redis');

var pub = redis.createClient();
var sub = redis.createClient();
sub.subscribe('global');

module.exports = function() {
	mainCtrl.setPub(pub);

	sub.on('message', mainCtrl.newMessage);
};
