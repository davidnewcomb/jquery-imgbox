/*
 *  jquery-imgbox - v1.0.0
 *  A jQuery plugin that draws a box over an image.
 *  https://github.com/davidnewcomb/jquery-imgbox/
 *
 *  Copyright (c) 2018 David Newcomb
 *  MIT License
 */
(function($) {

	$.fn.imgbox = function(options) {

		// This is the easiest way to have default options.
		var settings = $.extend({
			debug : true,
			markStyle : {
				'border' : '1px solid red'
			},
			markZIndex : 1000
		}, options);

		var allElments = this;
		var uniq = 'u' + uuidv4();
		init();

		function init() {
			merge_mark_styles();
			replace_imgboxes();
			$(window).on('resize', window_resize_piccy);
			init_imgbox();
		}

		function replace_imgboxes() {
			allElments.each(function() {
				var img = this.outerHTML;
				var style = to_css_string(settings.markStyle);
				var d = '<div class="piccy' + uniq + '" style="position: relative;">' + img
					+ '<div style="' + style + '"></div></div>';
				$(this).replaceWith(d);
			});
		}

		function window_resize_piccy() {
			$('.piccy' + uniq).each(resize_piccy);
		}

		function init_imgbox() {
			$('.piccy' + uniq).find('img').one("load", function() {
				resize_piccy(0, $(this).parent());
			}).each(function(e) {
				if (this.complete) {
					try {
						$(this).load();
					} catch (e) {
						debug('Exception, don\'t know why!');
						debug(e);
					}
				}
			});
		}

		function resize_piccy(idx, el) {
			var $img = $(el).find('img');
			var markData = $img.data();

			if (markData == undefined || markData.x == undefined || markData.y == undefined) {
				debug('imgbox: missing one of x,y');
				return;
			}

			if (markData.w == undefined || markData.h == undefined) {
				if (markData.x2 == undefined || markData.y2 == undefined) {
					debug('imgbox: missing one of w,h|x2,y2');
					return;
				} else {
					markData.w = Math.abs(markData.x2 - markData.x);
					markData.h = Math.abs(markData.y2 - markData.y);
				}
			}

			var width = $img.width();
			var realWidth = $img[0].naturalWidth;

			var ratio = width / realWidth;

			var ww = ratio * markData.w;
			var hh = ratio * markData.h;
			var xx = ratio * markData.x;
			var yy = ratio * markData.y;

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
		// https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript#2117523
		function uuidv4() {
			return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
				var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
				return v.toString(16);
			});
		}

		function debug(str) {
			if (settings.debug) {
				console.log(str);
			}
		}

	};

}(jQuery));
