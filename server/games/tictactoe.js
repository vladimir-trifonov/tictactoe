/**
 * Game Logic
 */
'use strict';

var winningCombs = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[2, 4, 6]
];

var gameSingle = {
	defaults: {
		name: 'tictactoe',
		type: 'single',
		difficult: null,
		board: null,
		winningCombs: winningCombs,
		points: 100,
		count: 3
	},
	init: function(game, options) {
		switch (options.level) {
			case 'novice':
				game.difficult = 0;
				break;
			case 'intermediate':
				game.difficult = 2;
				break;
			case 'experienced':
				game.difficult = 4;
				break;
			case 'expert':
				game.difficult = 6;
				break;
			default:
				game.difficult = 4;
				break;

		}

		game.board = new Array(9);
	},
	move: function(game, move) {
		var next = null;

		if (game.board[move.index]) {
			return;
		}

		game.board[move.index] = move.value;

		if (this._checkEnd(game, 0) > 0) {
			return [{
				result: {
					type: 'end',
					result: 'win'
				}
			}];
		}

		if (game.difficult === 0) {
			next = this._random(game);
		} else {
			next = this._search(game, 0, -move.value, -game.score, game.score);
		}

		if (next === null) {
			return [{
				result: {
					type: 'end',
					result: 'tie',
					move: next
				}
			}];
		}

		game.board[next] = -move.value;

		if (this._checkEnd(game, 0) < 0) {
			return [{
				result: {
					type: 'end',
					result: 'lose',
					move: next
				}
			}];
		}

		return [{
			result: {
				type: 'move',
				move: next
			}
		}];

	},
	_checkEnd: function(game, depth) {
		for (var i = 0, length = game.winningCombs.length; i < length; i++) {
			var comb = game.winningCombs[i];
			var value = game.board[comb[0]];
			if (value) {
				if (value === game.board[comb[1]] &&
					value === game.board[comb[2]]) {
					if (value > 0) {
						return game.points - depth;
					} else if (value < 0) {
						return depth - game.points;
					}
				}
			}
		}
	},
	_search: function(game, depth, value, alpha, beta) {
		var i = game.count * game.count,
			min = -game.points,
			max = null,
			next = null,
			result = this._checkEnd.call(this, game, depth);

		if (result) {
			return result * value;
		}

		if (game.difficult > depth) {
			while (i--) {
				if (!game.board[i]) {
					game.board[i] = value;
					result = -this._search.call(this, game, depth + 1, -value, -beta, -alpha);
					game.board[i] = null;

					if (max === null || value > max) {
						max = result;
					}

					if (value > alpha) {
						alpha = result;
					}

					if (alpha >= beta) {
						return alpha;
					}

					if (max > min) {
						min = max;
						next = i;
					}
				}
			}
		}
		return depth ? max || 0 : next;
	},
	_random: function(game) {
		var choises = [];
		for (var i = 0, length = game.board.length; i < length; i++) {
			if (!game.board[i]) {
				choises.push(i);
			}
		}
		if (choises.length === 0) {
			return null;
		} else {
			return choises[(Math.floor(Math.random() * choises.length) + 1) - 1];
		}
	}
};

module.exports.GameSingle = gameSingle;

var gameMulti = {
	defaults: {
		name: 'tictactoe',
		type: 'multi',
		board: null,
		winningCombs: winningCombs
	},
	init: function(game) {
		game.board = new Array(9);
	},
	move: function(game, move) {
		if (game.board[move.index]) {
			return;
		}

		game.board[move.index] = move.value;

		var result = this._checkEnd(game);
		if (typeof result !== 'undefined') {
			if (result === null) {
				return [{
					result: {
						type: 'end',
						result: 'tie'
					}
				}, {
					result: {
						type: 'end',
						result: 'tie',
						move: move.index
					}
				}];
			} else {
				if (result === move.value) {
					return [{
						result: {
							type: 'end',
							result: 'win'
						}
					}, {
						result: {
							type: 'end',
							result: 'lose',
							move: move.index
						}
					}];
				} else {
					return [{
						result: {
							type: 'end',
							result: 'lose'
						}
					}, {
						result: {
							type: 'end',
							result: 'win',
							move: move.index
						}
					}];
				}
			}
		} else {
			return [{
				result: {
					type: 'wait'
				}
			}, {
				result: {
					type: 'move',
					move: move.index
				}
			}];
		}
	},
	_checkEnd: function(game) {
		var isTie = true;
		for (var i = 0, length = game.winningCombs.length; i < length; i++) {
			if (!game.board[i]) {
				isTie = false;
			}

			var comb = game.winningCombs[i];
			var value = game.board[comb[0]];
			if (value) {
				if (value === game.board[comb[1]] &&
					value === game.board[comb[2]]) {
					return value;
				}
			}
		}
		if (isTie) {
			return null;
		}
	}
};

module.exports.GameMulti = gameMulti;