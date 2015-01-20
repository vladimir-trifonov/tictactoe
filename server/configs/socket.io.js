/**
 * Socket.io configuration
 */
'use strict';

var mainCtrl = require('../controllers/mainCtrl');

module.exports = function(io) {
	mainCtrl.setSockets(io.sockets);

	io.use(function(client, next) {
		mainCtrl.setClient(client.handshake.query.userId, client);
		next();
	});

	io.sockets.on('connection', function(client) {
		var userId = client.handshake.query.userId;

		mainCtrl.connection(userId).done(function(users) {
			client.emit('users', users);
		});

		client.on('disconnect', function() {
			mainCtrl.disconnect(userId);
		});

		client.on('newGame', function(message) {
			mainCtrl.newGame(userId, message.users, message.game, message.type, message.level);
		});

		client.on('makeMove', function(move) {
			mainCtrl.makeMove(userId, move);
		});
	});
};