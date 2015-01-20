"use strict";
var ns = ns || {};

(function(app) {
	function Figure(uid, row, col, type, x, y, width, height) {
		createjs.Bitmap.call(this);

		this.uid = uid;
		this.row = row;
		this.col = col;
		this.type = type;

		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;

		this.update();

		return this;
	}

	Figure.prototype = (function() {
		var p = Object.create(createjs.Bitmap.prototype);
		p.constructor = Figure;

		p.update = function() {
			if(this.type && !this.image) {
				this.image = app.images.getResult(this.type);
			}
		};

		return p;
	}());

	app.Figure = Figure;
})(ns);