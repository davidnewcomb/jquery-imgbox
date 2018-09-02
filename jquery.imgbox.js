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

		var default_settings = {
			// extra messages
			debug : true,
			// set of highlight styles
			markStyle : {
				'border' : '1px solid red',
				'z-index' : 1000
			},
			// Wrap the IMG tag if the coordinates are invalid, such
			// as edit
			wrap_if_invalid : false,

			// Addition features
			// edit - edit co-ordinate box
			command : '',
			// Call back to save box co-ordinates
			save_box : callback_save_box
		}

		var settings = $.extend(default_settings, options);
		settings.markStyle['position'] = 'absolute';

		var allElments = this;
		var imgbox_class = 'imgbox' + get_unique_id();

		// console.log(imgbox_class);
		var edit_button_down = false;
		var edit_x = 0;
		var edit_y = 0;
		var edit_x2 = 0;
		var edit_y2 = 0;

		init();

		function init() {
			var page_contains_elements = replace_imgboxes();
			if (page_contains_elements == false) {
				debug('page contains no elements');
				return;
			}
			$(window).on('resize', window_resize_imgbox);
			init_imgbox();

			if (settings.command == 'edit') {
				debug('command==edit');
				$(allElments).on('click', edit_click);
				$(allElments).on('mousemove', edit_mousemove);
			}

		}

		function edit_redraw(obj, s) {
			debug(s + ' button-down=' + edit_button_down + " " + edit_x + "," + edit_y + " -> " + edit_x2
				+ " " + edit_y2);

			obj.each(resize_imgbox);
			// resize_imgbox(0, $(obj));
		}

		function edit_click(e) {
			if (edit_button_down) {
				edit_x2 = e.offsetX;
				edit_y2 = e.offsetY;
			} else {
				edit_x = edit_x2 = e.offsetX;
				edit_y = edit_y2 = e.offsetY;
			}
			var parent = $(this).parent();
			// console.log('click!!');
			edit_redraw(parent, '!!!click-' + edit_button_down);
			edit_button_down = !edit_button_down;
		}

		function edit_marker_click(e) {
			if (edit_button_down) {
				// First click
				edit_x2 = edit_x + e.offsetX;
				edit_y2 = edit_y + e.offsetY;
				settings.save_box({
					'x' : edit_x,
					'y' : edit_y,
					'x2' : edit_x2,
					'y2' : edit_y2,
					'w' : Math.abs(edit_x - edit_x2),
					'h' : Math.abs(edit_y - edit_y2)
				})
			} else {
				// Second click
				edit_x = edit_x2 = e.offsetX;
				edit_y = edit_y2 = e.offsetY;
			}
			var parent = $(this).parent();
			// console.log('click!!');
			edit_redraw(parent, '!!!click-' + edit_button_down);
			edit_button_down = !edit_button_down;
		}

		function edit_mousemove(e) {
			mouse_move(this, e.offsetX, e.offsetY);
		}

		function edit_marker_mousemove(e) {
			mouse_move(this, edit_x + e.offsetX, edit_y + e.offsetY);
		}

		function mouse_move(thiz, x, y) {
			if (edit_button_down) {
				edit_x2 = x;
				edit_y2 = y;
				var parent = $(thiz).parent();
				console.log(parent);
				edit_redraw(parent, '!!!mousemove');
			}
		}

		function replace_imgboxes() {
			// var style = to_css_string(settings.markStyle);
			var page_contains_elements = false;
			allElments.each(function(idx, el) {
				var data = validate_data($(el).data());

				if (data == null) {
					if (settings.wrap_if_invalid == true) {
						data = {
							'x' : 0,
							'y' : 0,
							'x2' : 0,
							'y2' : 0
						};
						$(el).data(data);
					} else {
						return;
					}
				}

				// var marker_css = $.extend({},
				// settings.markStyle, data);

				var parent = $(el).parent();
				var marker = $('<div>');
				$(marker).on('click', edit_marker_click);
				$(marker).on('mousemove', edit_marker_mousemove);

				var div = $('<div>').attr({
					'class' : imgbox_class
				}).css({
					'position' : 'relative'
				}).append($(el)).append(marker);
				$(parent).append(div);
				div.each(resize_imgbox);
				page_contains_elements = true;
			});
			return page_contains_elements;
		}

		function window_resize_imgbox() {
			$('.' + imgbox_class).each(resize_imgbox);
		}

		function init_imgbox() {
			// $('.' + imgbox_class).find('img').one("load",
			// function() {
			// resize_imgbox(0, $(this).parent());
			// }).each(function(e) {
			// if (this.complete) {
			// try {
			// $(this).load();
			// } catch (e) {
			// debug('exception, don\'t know why! Help!!');
			// debug(e);
			// }
			// }
			// });
		}

		/**
		 * x,y,w,h will always be valid. x2,y2 may be valid if set.
		 * otherwise null
		 */
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

		function resize_imgbox(idx, parent) {

			var $img = $(parent).find('img');
			var data;

			if (settings.command == 'edit' && edit_button_down) {
				var w = Math.abs(edit_x - edit_x2);
				var h = Math.abs(edit_y - edit_y2);
				data = {
					'x' : edit_x,
					'y' : edit_y,
					'w' : w,
					'h' : h
				};
			} else {
				data = validate_data($img.data());
				if (data == null) {
					return;
				}
			}

			var width = $img.width();
			var realWidth = $img[0].naturalWidth;
			// console.log('*** realWidth ' + realWidth);
			var ratio = width / realWidth;

			var xx = Math.floor(ratio * data.x);
			var yy = Math.floor(ratio * data.y);
			var ww = Math.floor(ratio * data.w);
			var hh = Math.floor(ratio * data.h);

			var css = {
				'left' : xx,
				'top' : yy,
				'width' : ww,
				'height' : hh,
			};
			var marker_css = $.extend({}, settings.markStyle, css);
			$(parent).find('div').css(marker_css);
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

		function callback_save_box(coord) {
			console.log(coord);
		}

		function debug(str) {
			if (settings.debug) {
				console.log('imgbox: ' + imgbox_class + ' - ' + str);
			}
		}

	};

}(jQuery));
