"use strict";
var ns = ns || {};

(function(app) {
	var Game = function() {
		createjs.Container.call(this);

		var _self = this;
		this.hasGame = null;
		this.mainDataCtrl = new app.MainDataCtrl();

		$.get("templates/game.hbs").then(function(src) {
			_self.tpl = Handlebars.compile(src)();

			_self._initEventHandlers();
			app.States.set(app.States.READY);
		});

		return this;
	};

	Game.prototype = (function() {
		var p = Object.create(createjs.Stage.prototype);
		p.constructor = Game;

		p._render = function() {
			$(".game").remove();
			$(".container").append(this.tpl);
		};

		p._initStage = function() {
			this._render();
			this.canvas = document.getElementById("canvas");
		};

		p._startTimer = function() {
			this._clearTimer();
			this.timer = new app.Timer(1);
			this.timer.on("tick", function(e) {
				app.menu.stats.update("time", e.time);
			}, this);
		};

		p._stopTimer = function() {
			if (this.timer) {
				this.timer.stop();
			}
		};

		p._clearTimer = function() {
			if (this.timer) {
				this._stopTimer();
				app.menu.stats.update("time", "00:00:00");
			}
		};

		p._changeState = function() {
			switch (app.States.current) {
				case app.States.NO_CONNECTION:
					app.menu.stats.update("status", "No Connection");
					break;

				case app.States.NO_GAME:				
					this._removeGame();
					this._clearTimer();
					app.States.set(app.States.READY);
					break;

				case app.States.ERROR:
					this._removeGame();
					this._clearTimer();
					app.menu.stats.update("status", "Error");
					app.States.set(app.States.READY);
					break;

				case app.States.START:
					this._removeGame();
					this._startGame();
					this._startTimer();
					break;

				case app.States.CAN_MOVE:
					app.menu.stats.update("status", "Your Move");
					break;

				case app.States.READY:
					app.menu.stats.update("status", "Ready");
					break;

				case app.States.WIN:
					this._stopTimer();
					app.States.set(app.States.READY);
					app.menu.stats.update("status", "You Won");
					break;

				case app.States.TIE:
					this._stopTimer();
					app.States.set(app.States.READY);
					app.menu.stats.update("status", "Tie Game");
					break;

				case app.States.LOSE:
					this._stopTimer();
					app.States.set(app.States.READY);
					app.menu.stats.update("status", "You Lose");
					break;
			}
		};

		p._removeGame = function() {
			this.hasGame = false;
			this.removeAllChildren();
			this.update();
			$(".game").remove();
		};

		p._initEventHandlers = function() {
			var _self = this;

			app.States.on(app.States.events.CHANGED, this._changeState, this);

			app.messages.on("connect", function() {
				if(_self.hasGame) {
					app.States.set(app.States.CAN_MOVE);
				} else {
					app.States.set(app.States.READY);
				}
			});

			app.messages.on("disconnect", function() {
				app.States.set(app.States.NO_CONNECTION);
			});

			app.messages.on("removeGame", function() {
				app.States.set(app.States.NO_GAME);
			});

			app.messages.on("newGame", function(e) {
				app.States.set(app.States.START);
				if(e.options.startFirst) {
					app.States.set(app.States.CAN_MOVE);
				} else {
					app.States.set(app.States.WAIT);
				}

				app.mainData.value = e.options.value;
			});

			app.messages.on("newUser", function(e) {
				_self.mainDataCtrl.addUser(e.user);
				app.menu.users.update();
			});

			app.messages.on("removeUser", function(e) {
				_self.mainDataCtrl.removeUser(e._id);
				app.menu.users.update();
			});

			app.messages.on("error", function() {
				app.States.set(app.States.ERROR);
			});

			app.messages.on("getMove", function(e) {
				if (app.States.current === app.States.WAIT) {
					if (typeof e.data.move !== "undefined") {
						_self.mainDataCtrl.editFigure(e.data.move, {
							type: app.mainData.otherType
						});

						_self.scene.update();
						_self.update();
					}

					if (e.data.type === "move") {
						app.States.set(app.States.CAN_MOVE);
					} else if (e.data.type === "end") {
						app.States.set(app.States[e.data.result.toUpperCase()]);
					} 
				}
			});
		};

		p._startGame = function() {
			this.hasGame = true;
			this.mainDataCtrl.resetFigures();
			this._initStage();
			this._initScene();
			this._drawGrid();

			this._loadFigures();
			this._initGameEventHandlers();

			this.scene.update();

			this.visible = true;
			this.update();
		};

		p._initGameEventHandlers = function() {
			var _self = this;
			this.canvas.addEventListener("click", function(e) {
				if (app.States.current === app.States.CAN_MOVE) {
					_self._makeMove(e.offsetX, e.offsetY);
				}
			});
		};

		p._drawGrid = function() {
			var size = app.config.tictactoe.figureWidth * app.config.tictactoe.cols;
			var square = Math.floor(size / 3);

			var grid = new app.Grid(size, square);
			this.addChild(grid);
			this.update();
		};

		p._makeMove = function(x, y) {
			_.each(this.scene.children, function(child) {
				if (app.helper.hasHit(child, x, y)) {
					this.mainDataCtrl.editFigure(child.uid, {
						type: app.mainData.type
					});

					app.messages.makeMove(child.uid);
					app.States.set(app.States.WAIT);
				}
			}, this);

			this.scene.update();
			this.update();
		};

		p._loadFigures = function() {
			var uid = 0;
			for (var k = 0; k < app.config.tictactoe.rows; k++) {
				for (var i = 0; i < app.config.tictactoe.cols; i++) {
					var x = i * app.config.tictactoe.figureWidth;
					var y = k * app.config.tictactoe.figureHeight;
					this.mainDataCtrl.addFigure({
						uid: uid++,
						row: i,
						col: k,
						type: null,
						x: x,
						y: y,
						width: app.config.tictactoe.figureWidth,
						height: app.config.tictactoe.figureHeight
					});
				}
			}
		};

		p._initScene = function() {
			this.scene = new app.Scene();
			this.addChild(this.scene);
		};

		return p;
	}());

	app.Game = Game;
})(ns);