"use strict";
var ns = ns || {};

(function(app) {
	var helper = {
		pad: function(val) {
			return val > 9 ? val : "0" + val;
		},
		secToTime: function(sec) {
			return helper.pad(parseInt(sec / 3600 % 60, 10)) +
				":" +
				helper.pad(parseInt(sec / 60 % 60, 10)) +
				":" +
				helper.pad(sec % 60);
		},
		hasHit: function(obj, x, y) {
			if ((obj.x <= x) && (x <= obj.x + obj.width) && (obj.y <= y) && (y <= obj.y + obj.height)) {
				return true;
			}

			return false;
		}
	};

	app.helper = helper;
})(ns);