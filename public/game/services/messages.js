"use strict";
var ns = ns || {};

(function(app) {
	function Messages(username) {
		createjs.EventDispatcher.call(this);
		this.userId = null;
		return this;
	}

	Messages.prototype = (function() {
		var p = Object.create(createjs.EventDispatcher.prototype);
		p.constructor = Messages;

		p._connect = function() {
			var _self = this;
			this.socket = io.connect("localhost:8080/", { query: "userId=" + this.userId } );

			this.socket.on("connect", function() {
				_self.dispatchEvent("connect");
			});

			this.socket.on("newGame", function(options) {
				var e = new createjs.Event("newGame");
				e.options = options;
				_self.dispatchEvent(e);
			});

			this.socket.on("removeGame", function() {
				_self.dispatchEvent("removeGame");
			});

			this.socket.on("server_error", function() {
				_self.dispatchEvent("error");
			});

			this.socket.on("removeUser", function(_id) {
				if(_id !== _self.userId) {
					var e = new createjs.Event("removeUser");
					e._id = _id;
					_self.dispatchEvent(e);
				}
			});

			this.socket.on("newUser", function(user) {
				if(user._id !== _self.userId) {
					var e = new createjs.Event("newUser");
					e.user = user;
					_self.dispatchEvent(e);
				}
			});

			this.socket.on("disconnect", function() {
				_self.dispatchEvent("disconnect");
			});

			this.socket.on("users", function(users) {
				app.mainData.users = _.filter(users, function(user) {
					return user._id !== this.userId;
				}, _self);
			});

			this.socket.on("getMove", function(message) {
				var e = new createjs.Event("getMove");
				e.data = message;
				_self.dispatchEvent(e);
			});
		};

		p.makeMove = function(index) {
			this.socket.emit("makeMove", {
				index: index,
				value: app.mainData.value
			});
		};

		p.login = function(username) {
			var _self = this;
			var deferred = $.Deferred();
			$.ajax({ type: "POST",
				url: "/login",
				data: {username: username}
			}).done(function(result) {
				if(result.success) {
					_self.userId = result.userId;
					_self._connect();

					deferred.resolve();
				} else {
					deferred.reject(result.message);
				}
			}).fail(function(err) {
				deferred.reject(err);
			});
			return deferred.promise();
		};

		return p;
	}());

	app.Messages = Messages;

})(ns);