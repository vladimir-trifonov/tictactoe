/**
 * Game Controller
 * Controls all user messages
 */
'use strict';
var usersCtrl = require('./usersCtrl'),
	gamesCtrl = require('./gamesCtrl'),
	Q = require('q');

var clients = {};
var pub = null;
var sockets = null;

module.exports = {
	setPub: setPub,
	setSockets: setSockets,
	setClient: setClient,
	connection: connection,
	disconnect: disconnect,
	newMessage: newMessage,
	newGame: newGame,
	makeMove: makeMove,
};

function setPub(instance) {
	pub = instance;
}

function setSockets(instance) {
	sockets = instance;
}

function setClient(userId, client) {
	clients[userId] = client;
}

function connection(userId) {
	usersCtrl.setActive(userId);
	usersCtrl.getUserById(userId).done(function(user) {
		if (user) {
			pub.publish('global', JSON.stringify({
				type: 'newUser',
				user: {
					username: user.username,
					_id: userId,
				}
			}));
		}
	});

	return usersCtrl.getAllActive();
}

function disconnect(userId) {
	_removeGame(userId);
	usersCtrl.setNotActive(userId);

	delete clients[userId];

	pub.publish('global', JSON.stringify({
		type: 'removeUser',
		_id: userId
	}));
}

function newMessage(channel, message) {
	var parsed = null;
	try {
		parsed = JSON.parse(message);
	} catch (e) {
		return console.log('Error: ' + e);
	}

	switch (parsed.type) {
		case 'newUser':
			_notifyNewUser(parsed.user);
			break;
		case 'removeUser':
			_notifyRemoveUser(parsed._id);
			break;
		case 'removeGame':
			_notifyRemoveGame(parsed.userIds);
			break;
		case 'newGame':
			_notifyNewGame(parsed.userIds, parsed.options);
			break;
		case 'getMove':
			_notifyGetMove(parsed.userIds, parsed.result);
			break;
	}
}

function _notifyNewGame(userIds, result) {
	_notifyClients(userIds, 'getMove', result);
}

function _notifyNewGame(userIds, options) {
	_notifyClients(userIds, 'newGame', options);
}

function _notifyNewUser(user) {
	_notifyAll('newUser', user);
}

function _notifyRemoveUser(_id) {
	_notifyAll('removeUser', _id);
}

function _notifyRemoveGame(userIds) {
	_notifyClients(userIds, 'removeGame');
}

function _notifyAll(type, data) {
	sockets.emit(type, data);
}

function _notifyClients(userIds, type, data) {
	var notNotified = [];
	userIds.forEach(function(userId) {
		if (clients[userId]) {
			clients[userId].emit(type, data);
		} else {
			notNotified.push(userId);
		}
	});
	return notNotified;
}

function _removeGame(userId) {
	var defer = Q.defer();

	gamesCtrl.removeGame(userId).then(function(userIds) {
		if (userIds) {
			var notNotified = _notifyClients(userIds, 'removeGame');

			if (notNotified.length > 0) {
				pub.publish('global', JSON.stringify({
					type: 'removeGame',
					userIds: notNotified
				}));
			}
		}

		defer.resolve();
	}, function(err) {
		_error([userId]);
		defer.reject();
	});

	return defer.promise;
}

function newGame(userId1, users, game, type, level) {
	_removeGame(userId1).then(function() {
		gamesCtrl.newGame(userId1, users, game, type, level).done(function(messages) {
			if (messages) {
				_notifyClients([userId1], 'newGame', messages[0].options);

				if (messages.length === 2) {
					var notNotified = _notifyClients(users, 'newGame', messages[1].options);

					if (notNotified.length > 0) {
						pub.publish('global', JSON.stringify({
							type: 'newGame',
							userIds: notNotified,
							options: messages[1].options
						}));
					}
				}
			}
		}, function(err) {
			_error([userId1]);
		});
	}, function(err) {
		_error([userId1]);
	});
}

function makeMove(userId1, move) {
	gamesCtrl.makeMove(userId1, move).done(function(messages) {
		if (messages) {
			_notifyClients([userId1], 'getMove', messages[0].result);

			if (messages.length === 2) {
				var notNotified = _notifyClients(messages[1].users, 'getMove', messages[1].result);

				if (notNotified.length > 0) {
					pub.publish('global', JSON.stringify({
						type: 'getMove',
						userIds: notNotified,
						result: messages[1].result
					}));
				}
			}
		}
	}, function(err) {
		_error([userId1]);
	});
}

function _error(userIds) {
	_notifyClients(userIds, 'server_error');
}