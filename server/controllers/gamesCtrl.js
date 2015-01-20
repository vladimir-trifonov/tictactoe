/**
 * Controls all games MongoDb operations
 */
'use strict';

var Game = require('mongoose').model('Game'),
	TicTacToeSingle = require('../games/tictactoe').GameSingle,
	TicTacToeMulti = require('../games/tictactoe').GameMulti,
	Q = require('q'),
	extend = require('util')._extend;

module.exports = {
	newGame: newGame,
	removeGame: removeGame,
	makeMove: makeMove
};

function newGame(userId1, users, game, type, level) {
	switch (type) {
		case 'single':
			return _newGame(TicTacToeSingle, userId1, null, game, level);
		case 'multi':
			return _newGame(TicTacToeMulti, userId1, users, game, null);
	}
}

function _newGame(instance, userId1, users, game, level) {
	var defer = Q.defer();

	if (game === 'tictactoe') {
		var gameData = extend({}, instance.defaults);
		var options = {};
		if(level) {
			options.level = level;
		}
		instance.init(gameData, options);

		var game = new Game();
		game.userids = users || [];
		game.userids.push(userId1);
		game.gamedata = gameData;

		Game.create(game, function(err, game) {
			if (err) {
				return defer.reject(new Error(err));
			}

			var result = [{
				options: {
					startFirst: true,
					value: 1
				}
			}];

			if (users) {
				result.push({
					options: {
						startFirst: false,
						value: -1
					}
				});
			}

			defer.resolve(result);
		});
	} else {
		defer.reject(new Error('Missing game!'));
	}

	return defer.promise;
}

function removeGame(userId) {
	var defer = Q.defer();
	Game.find({
		userids: userId
	}, function(err, games) {
		if (err) {
			return defer.reject(new Error(err));
		}

		if (games.length === 1) {
			games[0].remove();
			defer.resolve(games[0].userids);
		}

		defer.resolve();
	});

	return defer.promise;
}

function makeMove(userId, move) {
	var defer = Q.defer();

	Game.find({
		userids: userId
	}, function(err, games) {
		if (err) {
			return defer.reject(new Error(err));
		}

		if (games.length === 1) {
			var instance = null;

			switch (games[0].gamedata.type) {
				case 'single':
					instance = TicTacToeSingle;
					break;
				case 'multi':
					instance = TicTacToeMulti;
					break;
			}

			_makeMove(instance, games[0].gamedata, move).then(function(result) {
				Game.update({
					_id: games[0]._id
				}, {
					gamedata: games[0].gamedata
				}, function(err) {
					defer.resolve(new Error(err));
				});

				if (result && result.length === 2) {
					result[1].users = [];
					for (var i = 0; i < games[0].userids.length; i++) {
						if (userId !== games[0].userids[i]) {
							result[1].users.push(games[0].userids[i]);
						}
					}
				}

				defer.resolve(result);
			}, function(err) {
				defer.reject(err);
			});
		} else {
			defer.reject(new Error('Missing game!'));
		}
	});

	return defer.promise;
}

function _makeMove(instance, gameData, move) {
	var defer = Q.defer();

	if (gameData.name === 'tictactoe') {
		var result = instance.move(gameData, move);
		if (!result) {
			return defer.reject(new Error('Wrong move!'));
		}

		defer.resolve(result);
	} else {
		defer.reject(new Error('Missing game!'));
	}

	return defer.promise;
}