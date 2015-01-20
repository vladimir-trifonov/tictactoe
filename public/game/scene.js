"use strict";
var ns = ns || {};

(function(app) {
	var Scene = function() {
		createjs.Container.call(this);

		this.oldData = [];

		return this;
	};

	Scene.prototype = (function() {
		var p = Object.create(createjs.Container.prototype);
		p.constructor = Scene;

		p.update = function() {
			this.newData = app.mainData.figures;

			var current = _.pluck(this.oldData, "uid");
			var forAdd = _.difference(this.newData, this.oldData);
			var forUpdate = _.intersection(this.newData, this.oldData);

			if (current.length !== this.children.length) {
				this._remove(current);
			}

			if (forAdd.length > 0) {
				this._add(forAdd);
			}

			if (forUpdate.length > 0) {
				this._edit(forUpdate);
			}

			this.oldData = _.clone(this.newData);
		};

		p._add = function(figures) {
			_.each(figures, function(figure) {
				var newFigure = new app.Figure(
					figure.uid,
					figure.row,
					figure.col,
					figure.type,
					figure.x,
					figure.y,
					figure.width,
					figure.height
				);
				this.addChild(newFigure);
			}, this);
		};

		p._remove = function(figures) {
			var indexes = [];
			_.each(this.children, function(child) {
				if (_.indexOf(figures, child.uid) === -1) {
					indexes.push(this.getChildIndex(child));
				}
			}, this);

			this.removeChildAt(indexes);
		};

		p._edit = function(figures) {
			_.each(this.children, function(child) {
				var figure = _.findWhere(figures, {
					uid: child.uid
				});
				_.extend(child, figure);
				child.update();
			}, this);
		};

		return p;
	}());

	app.Scene = Scene;
})(ns);