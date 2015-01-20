"use strict";
var ns = ns || {};

(function(app) {
	var Stats = function() {
		return this;
	};

	Stats.prototype = (function() {
		var p = Object.create(null);
		p.constructor = Stats;

		p.compile = function() {
			var _self = this;
			var deferred = $.Deferred();			

			$.get("templates/menu/stats.hbs").then(function(src) {
				_self.tpl = Handlebars.compile(src);
				_self._render.call(_self);

				deferred.resolve();
			});
			return deferred.promise();
		};

		p._render = function() {
			var $stats = $(".menu .stats");
			if($stats.length !== 0) {
				$stats.replaceWith(this.tpl(app.mainData.stats));
			} else {
				$(".menu .dynamic").append(this.tpl(app.mainData.stats));
			}
		};

		p.update = function(key, val) {
			app.mainData.stats[key] = val;
			this._render();
		};

		return p;
	}());

	app.Stats = Stats;
})(ns);