"use strict";
var ns = ns || {};

(function(app) {
	function Splash(options) {
		createjs.EventDispatcher.call(this);
		this._render();
		return this;
	}

	Splash.prototype = (function() {
		var p = Object.create(createjs.EventDispatcher.prototype);
		p.constructor = Splash;

		p._render = function() {
			var _self = this;
			$.get("templates/splash.hbs").then(function(src) {
				var tpl = Handlebars.compile(src)();

				$(".container").append(tpl);
				_self.$el = $(".splash");
				_self._initEventHandlers();
			});
		};

		p._initEventHandlers = function() {
			var _self = this;
			this.$el.find(".start").on("click", function(e) {
				e.preventDefault();

				var event = new createjs.Event("start");
				event.username = _self.$el.find("#inputName").val();
				_self.dispatchEvent(event);
			});
		};

		p.hide = function() {
			TweenMax.to(this.$el, 0.5, {
				y: -1000,
				ease: Back.easeIn,
				onComplete: function() {
					this.$el.remove();
					this.dispatchEvent("hidden");
				},
				onCompleteScope: this
			});
		};

		return p;
	}());

	app.Splash = Splash;
})(ns);