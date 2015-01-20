"use strict";
var ns = ns || {};

(function(app) {
	var Menu = function() {
		return this;
	};

	Menu.prototype = (function() {
		var p = Object.create(null);
		p.constructor = Menu;

		p.compile = function() {
			var _self = this;
			var deferred = $.Deferred();

			$.get("templates/menu/menu.hbs").then(function(src) {
				_self.tpl = Handlebars.compile(src)({
					gameName: "Tic Tac Toe"
				});
				_self._render.call(_self);
				_self._initPartials.call(_self).done(function() {
					deferred.resolve();
				});
			});
			return deferred.promise();
		};

		p._render = function() {
			$(".menu").remove();
			$("body").append(this.tpl);
		};

		p._initPartials = function() {
			var _self = this;
			var deferred = $.Deferred();

			this._initStats().done(function() {
				_self._initControls().done(function() {
					_self._initUsers().done(function() {
						deferred.resolve();
					});
				});
			});
			return deferred.promise();
		};

		p._initStats = function() {
			this.stats = new app.Stats();
			return this.stats.compile();
		};

		p._initControls = function() {
			this.controls = new app.Controls();
			return this.controls.compile();
		};

		p._initUsers = function() {
			this.users = new app.Users();
			return this.users.compile();
		};

		return p;
	}());

	app.Menu = Menu;
})(ns);