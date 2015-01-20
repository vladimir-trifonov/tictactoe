'use strict';
var ns = ns || {};

(function(app) {
	var config = {
		manifest: {
			tictactoe: [{
				id: 'X',
				src: 'game/assets/images/x.png'
			}, {
				id: 'O',
				src: 'game/assets/images/o.png'
			}]
		},
		tictactoe: {
			rows: 3,
			cols: 3,
			figureWidth: 256,
			figureHeight: 256
		}
	};

	app.config = config;
})(ns);