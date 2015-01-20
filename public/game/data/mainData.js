"use strict";
var ns = ns || {};

(function(app) {
	var mainData = {
		stats: {
			time: "00:00:00",
			status: "Wait"
		},
		users: [],
		figures: [],
		type: "X",
		otherType: "O",
		value: null
	};

	app.mainData = mainData;
})(ns);