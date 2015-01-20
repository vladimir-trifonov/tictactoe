"use strict";
var ns = ns || {};

(function(app) {
	var Users = function() {
		return this;
	};

	Users.prototype = (function() {
		var p = Object.create(null);
		p.constructor = Users;

		p.compile = function() {
			var _self = this;
			var deferred = $.Deferred();

			$.get("templates/menu/users.hbs").then(function(src) {
				_self.tpl = Handlebars.compile(src);
				_self._render.call(_self);

				deferred.resolve();
			});
			return deferred.promise();
		};

		p._render = function() {
			var $users = $(".menu .users");
			if($users.length !== 0) {
				$users.replaceWith(this.tpl(app.mainData));
			} else {
				$(".menu .dynamic").append(this.tpl(app.mainData));
			}
			this._initEventHandlers();
		};

		p.update = function() {
			this._render();
		};

		p._initEventHandlers = function() {
			var _self = this;

			$(".menu .users").off("click").on("click", ".start-multi", function() {
				var users = [];
				users.push($(this).attr("data-id"));
				app.messages.socket.emit("newGame", {game: "tictactoe", type: "multi", users: users});
			});
		};


		return p;
	}());

	app.Users = Users;
})(ns);