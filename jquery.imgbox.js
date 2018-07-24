/*
 *  jquery-imgbox - v1.0.0
 *  A jQuery plugin that draws a box over an image.
 *  https://github.com/davidnewcomb/jquery-imgbox/
 *
 *  Copyright (c) 2018 David Newcomb, http://www.bigsoft.co.uk
 *  MIT License
 */
(function($) {

	$.fn.imgbox = function(options) {

		var settings = $.extend({
			// extra messages
			debug : false,
			// set of highlight styles
			markStyle : {
				'border' : '1px solid red'
			},
			// z-index of border
			markZIndex : 1000,
			// Wrap the IMG tag if the coordinates are invalid
			wrap_if_invalid : false
		}, options);

		var allElments = this;
		var imgbox_class = 'imgbox' + get_unique_id();

		init();

		function init() {
			merge_mark_styles();
			var page_contains_elements = replace_imgboxes();
			if (page_contains_elements == false) {
				debug('page contains no elements');
				return;
			}
			$(window).on('resize', window_resize_imgbox);
			init_imgbox();
		}

		function replace_imgboxes() {
			var style = to_css_string(settings.markStyle);
			var page_contains_elements = false;
			allElments.each(function() {
				var data = validate_data($(this).data());

				if (data == null && settings.wrap_if_invalid == false) {
					debug('invalid coords id')
					return;
				}
				var img = this.outerHTML;
				var d = '<div class="' + imgbox_class + '" style="position: relative;">' + img
					+ '<div style="' + style + '"></div></div>';
				$(this).replaceWith(d);
				page_contains_elements = true;
			});
			return page_contains_elements;
		}

		function window_resize_imgbox() {
			$('.' + imgbox_class).each(resize_imgbox);
		}

		function init_imgbox() {
			$('.' + imgbox_class).find('img').one("load", function() {
				resize_imgbox(0, $(this).parent());
			}).each(function(e) {
				if (this.complete) {
					try {
						$(this).load();
					} catch (e) {
						debug('exception, don\'t know why! Help!!');
						debug(e);
					}
				}
			});
		}

		function validate_data(data) {
			if (data == undefined || data.x == undefined || data.y == undefined) {
				debug('missing one of x,y');
				return null;
			}

			if (data.w == undefined || data.h == undefined) {
				if (data.x2 == undefined || data.y2 == undefined) {
					debug('missing one of w,h|x2,y2');
					return null;
				} else {
					data.w = Math.abs(data.x2 - data.x);
					data.h = Math.abs(data.y2 - data.y);
				}
			}
			return data;
		}

		function resize_imgbox(idx, el) {

			var $img = $(el).find('img');

			var data = validate_data($img.data());

			if (data == null) {
				return;
			}

			var width = $img.width();
			var realWidth = $img[0].naturalWidth;

			var ratio = width / realWidth;

			var ww = ratio * data.w;
			var hh = ratio * data.h;
			var xx = ratio * data.x;
			var yy = ratio * data.y;

			$(el).find('div').css({
				'left' : xx,
				'top' : yy,
				'width' : ww,
				'height' : hh
			});
		}

		function merge_mark_styles() {
			settings.markStyle['position'] = 'absolute';
			settings.markStyle['z-index'] = settings.markZIndex;
		}

		function to_css_string(obj) {
			var ks = Object.keys(obj);
			var str = '';
			for (var i = 0; i < ks.length; ++i) {
				str += ks[i] + ':' + settings.markStyle[ks[i]] + ';';
			}
			return str;
		}

		// Taken from
		// https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript#8809472
		function get_unique_id() { // Public Domain/MIT
			var d = new Date().getTime();
			if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
				// use high-precision timer if available
				d += performance.now();
			}
			return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
				var r = (d + Math.random() * 16) % 16 | 0;
				d = Math.floor(d / 16);
				return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
			});
		}

		function debug(str) {
			if (settings.debug) {
				console.log('imgbox: ' + str);
			}
		}

	};

}(jQuery));
