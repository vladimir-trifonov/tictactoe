"use strict";
var ns = ns || {};

(function(app) {
	function Timer(sec) {
		createjs.EventDispatcher.call(this);

		this.sec = sec || 0;
		this.interval = null;
		this.start();
	}

	Timer.prototype = (function() {
		var p = Object.create(createjs.EventDispatcher.prototype);
		p.constructor = Timer;

		p.start = function() {
			var _self = this;
			this.interval = setInterval(function() {
				var e = new createjs.Event("tick", true);
				e.time = app.helper.secToTime(_self.sec++);
				_self.dispatchEvent(e);
			}, 1000);
		};

		p.stop = function() {
			clearInterval(this.interval);
		};

		return p;
	}());

	app.Timer = Timer;
})(ns);