"use strict";
var ns = ns || {};

(function(app) {
	function Grid(size, square) {
		createjs.Shape.call(this);

		this.size = size;
		this.square = square;
		this._render();

		return this;
	}

	Grid.prototype = (function() {
		var p = Object.create(createjs.Shape.prototype);
		p.constructor = Grid;

		p._render = function() {
			this.graphics
				.setStrokeStyle(6)
				.beginStroke("#817C7C")
				.moveTo(this.square, 0)
				.lineTo(this.square, this.size)
				.endStroke();
			this.graphics
				.setStrokeStyle(6)
				.beginStroke("#817C7C")
				.moveTo(this.square * 2, 0)
				.lineTo(this.square * 2, this.size)
				.endStroke();
			this.graphics
				.setStrokeStyle(6)
				.beginStroke("#817C7C")
				.moveTo(0, this.square)
				.lineTo(this.size, this.square)
				.endStroke();
			this.graphics
				.setStrokeStyle(6)
				.beginStroke("#817C7C")
				.moveTo(0, this.square * 2)
				.lineTo(this.size, this.square * 2)
				.endStroke();
		};

		return p;
	}());

	app.Grid = Grid;
})(ns);