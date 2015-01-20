"use strict";
var ns = ns || {};

(function(app) {
	var Controls = function() {
		return this;
	};

	Controls.prototype = (function() {
		var p = Object.create(null);
		p.constructor = Controls;

		p.compile = function() {
			var _self = this;
			var deferred = $.Deferred();

			$.get("templates/menu/controls.hbs").then(function(src) {
				_self.tpl = Handlebars.compile(src);
				_self._render.call(_self);
				deferred.resolve();
			});
			return deferred.promise();
		};

		p._render = function() {
			$(".menu .controls").remove();
			$(".menu .dynamic").append(this.tpl());
			this._initEventHandlers();
		};

		p._initEventHandlers = function() {
			var _self = this;
			$(".menu .controls").off("click").on("click", ".start-single", function() {
				app.messages.socket.emit("newGame", {game: "tictactoe", type: "single", level: $(this).attr("data-level")});
			});
		};

		return p;
	}());


	app.Controls = Controls;
})(ns);