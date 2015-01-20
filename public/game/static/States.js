"use strict";
var ns = ns || {};

(function(app) {
	function States() {
		createjs.EventDispatcher.call(this);

		this.current = null;

		this.WIN = "win";
		this.LOSE = "lose";
		this.TIE = "tie";
		this.START = "start";
		this.READY = "ready";
		this.WAIT = "wait";
		this.CAN_MOVE = "can_move";
		this.NO_CONNECTION = "no_connection";
		this.NO_GAME = "no_game";
		this.ERROR = "error";

		this.events = {
			CHANGED: "changed"
		};

		return this;
	}

	States.prototype = (function() {
		var p = Object.create(createjs.EventDispatcher.prototype);
		p.constructor = States;

		p.set = function(state) {
			this.current = state;

			var e = new createjs.Event(this.events.CHANGED);
			e.state = state;
			this.dispatchEvent(e);
		};

		return p;
	}());

	app.States = new States();

})(ns);