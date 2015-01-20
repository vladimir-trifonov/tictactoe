"use strict";
var ns = ns || {};

(function(app) {
	var MainDataCtrl = function() {
		return this;
	};

	MainDataCtrl.prototype = (function() {
		var p = Object.create(null);
		p.constructor = MainDataCtrl;

		p.resetFigures = function() {
			app.mainData.figures = [];
		};

		p.addFigure = function(figure) {
			app.mainData.figures.push(figure);
		};

		p.addUser = function(user) {
			var exist = false;
			for (var i = 0, length = app.mainData.users.length; i < length; i++) {
				if(app.mainData.users[i]._id === user._id) {
					exist = true;
					break;
				}
			}

			if(!exist) {
				app.mainData.users.push(user);
			}
		};

		p.removeUser = function(_id) {
			var index = null;
			for (var i = 0, length = app.mainData.users.length; i < length; i++) {
				if(app.mainData.users[i]._id === _id) {
					index = i;
					break;
				}
			}

			if(index !== null) {
				app.mainData.users.splice(index, 1);
			}
		};

		p.editFigure = function(uid, data) {
			_.extend(_.findWhere(app.mainData.figures, {
				uid: uid
			}), data);
		};

		return p;
	}());

	app.MainDataCtrl = MainDataCtrl;
})(ns);