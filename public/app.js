"use strict";
var ns = ns || {};

(function(app) {
	var App = {
		init: function() {
			this._loadAssets();
		},

		_loadAssets: function() {
			app.images = new createjs.LoadQueue(false);
			app.images.on("complete", this._loadSplash, this, true);
			app.images.loadManifest(app.config.manifest.tictactoe);
		},

		_loadSplash: function() {			
			this.splash = new app.Splash();
			this.splash.on("start", function(e) {
				this._login(e.username);
			}, this, true);

			this.splash.on("hidden", function() {
				this._startGame();
			}, this);
		},

		_login: function(username) {
			var _self = this;
			app.messages = new app.Messages();
			app.messages.login(username).done(function() {
				_self.splash.hide();
			});
		},

		_startGame: function() {
			this._loadGameLayout().done(function() {
				new app.Game();
			});
		},

		_loadGameLayout: function() {
			var deferred = $.Deferred();

			app.menu = new app.Menu();
			app.menu.compile().done(function() {
				deferred.resolve();
			});

			return deferred.promise();
		}
	};

	app.App = App;
})(ns);

window.onload = function() {
	var app = Object.create(ns.App);
	app.init();
};