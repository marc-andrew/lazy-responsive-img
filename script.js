/*!
	Responsive lazy load image script.
	Version 1.0.0
	Full source at https://github.com/marc-andrew/responsive-lazy-img
	Copyright (c) 2017 Marc Andrew http://marcandrew.net/responsive-lazy-img
	MIT License (http://www.opensource.org/licenses/mit-license.html)
*/

var $ = jQuery.noConflict();

var app = app || {};
!function(){
	"use strict";

	//-
	// Generall settings
	//-
	var timeOutTime = 100,
		threshold = 50, // Threshold in px. Used for preloading images while scrolling
		winH,winW,winHT,lazy;

	//-
	// Initializer
	//-
	app.init = {
		init: function() {
			app.init.windowSize();
			app.lazyImg.init();
			app.docOnResize.init();
		},
		windowSize: function() {
			// Get Window Width and Height
			winW = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
			winH = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
		}
	},

	//-
	// Lazy Image
	//-
	app.lazyImg = {
		init: function() {
			lazy = $('.lazy');

			app.lazyImg.item();
			app.lazyImg.scroll();
		},
		item: function() {
			winHT = winH + threshold;

			// Run function for each lazy class
			lazy.each(function() {
				app.lazyImg.inView($(this));
			});
		},
		inView: function(el) {
			// .getBoundingClientRect() method returns the size of an element and its position relative to the viewport
			// with eight properties: left, top, right, bottom, x, y, width, height
			var obj = el.get(0).getBoundingClientRect(),
				topPos = obj.top,
				elHeight = obj.height;

			if(el.hasClass('img-loaded')) return;

			if(topPos >= 0) {
				// Element top position in viewport
				if(topPos <= winHT) app.respIMG.imgSrc(el,true);
			} else {
				var elInView = topPos + elHeight + threshold;

				// Element top position passed viewport but element height including threshold are till in viewport
				if(elInView >= 0) app.respIMG.imgSrc(el,true);
			}
		},
		scroll: function() {
			$(window).bind('scroll', function() {
				var lazy = $('.lazy');

				// Run lazy
				if(lazy.length) {
					lazy.each(function() {
						app.lazyImg.inView($(this), 'lazy');
					});
				}
			});
		}
	},

	//-
	// Breaking points
	//-
	app.respIMG = {
		init: function() {
			$('img.responsive').each(function() {
				app.respIMG.imgSrc($(this),false);
			});
		},
		imgSrc: function(el,lazy) {

			var currImgUrl = el.attr('src'),
				resIMG = el.attr('data-srcset'),
				regexBP = /\s([0-9]+)w/g, // regex to get breaking point
				breakingPoints = resIMG.match(regexBP), // match string against regex, and returns the matches, as an array
				regexURL = /([a-zA-Z0-9/?$._-]+)\s/g, // regex to get urls
				breakingPointsURL = resIMG.match(regexURL), // match string against regex, and returns the matches, as an array
				breakingPointsArr = [],
				urlArr = [];

			for(var i = 0; i < breakingPoints.length; i++) {
				var str = breakingPoints[i],
					str2 = breakingPointsURL[i],
					strBreakingPoints = str.substring(1, str.length - 1),
					strUrl = str2.substring(0, str2.length - 1);

				// Add string breaking points and url to array
				breakingPointsArr.push(strBreakingPoints);
				urlArr.push(strUrl);
			}

			var arrNr = app.respIMG.closest(winW,breakingPointsArr);

			if(lazy) {
				app.respIMG.changeURL(el,urlArr[arrNr]);
				el.removeClass('lazy').addClass('img-loaded');
			} else {
				if(currImgUrl != urlArr[arrNr] && el.hasClass('img-loaded')) {
					app.respIMG.changeURL(el,urlArr[arrNr]);
				}
			}
		},
		closest: function(num, arr) {
			var arrLength = arr.length;
			for(var i = 0; i < arrLength; i++) {
				if(num <= arr[i]) {
					return i;
				} else if(num > arr[arrLength-1]) {
					return arrLength-1;
				}
			}
		},
		changeURL: function(id,url) {
			id.attr('src',url);
		}
	},

	//-
	// Document on window resize function
	//-
	app.docOnResize = {
		init: function() {
			var timeOut;

			window.onresize = function(){
				clearTimeout(timeOut);
				timeOut = setTimeout(app.docOnResize.run, timeOutTime);
			};
		},
		run: function() {
			app.init.windowSize();
			app.lazyImg.item();
			app.respIMG.init();
		}
	};
	//-
	// Document ready function
	//-
	$(document).ready(app.init.init);

}(jQuery);