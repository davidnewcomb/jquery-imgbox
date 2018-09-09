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
			debug : false,
			// set of highlight styles
			markStyle : {
				'border' : '1px solid red'
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
		if (settings.command == 'edit') {
			settings.wrap_if_invalid = true;
		}
		settings.markStyle['position'] = 'absolute';

		var allElments = this;
		var parent_class = 'imgbox-group-' + get_unique_id();

		var edit_button_down = false;

		var start_x = 0;
		var start_y = 0;
		var end_x = 0;
		var end_y = 0;
		var normalised_coords;

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

		function edit_redraw(parent) {
			normalised_coords = calcCoords(start_x, start_y, end_x, end_y);
			parent.each(resize_imgbox);
		}

		function edit_click(e) {
			mouse_click($(this), e.offsetX, e.offsetY);
		}

		function edit_marker_click(e) {
			var off = div_position(this);
			mouse_click($(this).parent().find('img'), off.x + e.offsetX, off.y + e.offsetY);
		}

		function edit_mousemove(e) {
			mouse_move(this, e.offsetX, e.offsetY);
		}

		function edit_marker_mousemove(e) {
			var off = div_position(this);
			mouse_move(this, off.x + e.offsetX, off.y + e.offsetY);
		}

		function div_position(div) {
			var o = {};
			o.x = parseInt($(div).css('left').replace(/px/, ''));
			o.y = parseInt($(div).css('top').replace(/px/, ''));
			return o;
		}
		function mouse_move(both, x, y) {
			if (edit_button_down) {
				end_x = x;
				end_y = y;
				var parent = $(both).parent();
				edit_redraw(parent);
			}
		}

		function mouse_click(img, x, y) {
			if (edit_button_down) {
				// Second click
				end_x = x;
				end_y = y;
				normalised_coords = calcCoords(start_x, start_y, end_x, end_y);
				save_box_private($(img), normalised_coords);
			} else {
				// First click
				end_x = start_x = x;
				end_y = start_y = y;
				normalised_coords = calcCoords(start_x, start_y, end_x, end_y);
			}
			var parent = $(img).parent();
			edit_redraw(parent);
			edit_button_down = !edit_button_down;
		}

		function save_box_private($img, coords) {
			var width = $img.width();
			var realWidth = $img[0].naturalWidth;
			var ratio = realWidth / width;

			var o = {};
			o.x = Math.floor(coords.x * ratio);
			o.y = Math.floor(coords.y * ratio);
			o.x2 = Math.floor(coords.x2 * ratio);
			o.y2 = Math.floor(coords.y2 * ratio);
			o.w = Math.floor(coords.w * ratio);
			o.h = Math.floor(coords.h * ratio);

			settings.save_box(o);
		}

		function replace_imgboxes() {
			var page_contains_elements = false;
			allElments.each(function(idx, img) {
				// var data = validate_data($(img).data());
				//
				// if (data == null) {
				// if (settings.wrap_if_invalid == true) {
				// data = {
				// 'x' : 0,
				// 'y' : 0,
				// 'x2' : 0,
				// 'y2' : 0,
				// 'w' : 0,
				// 'h' : 0
				// };
				// $(img).data(data);
				// } else {
				// return;
				// }
				// }

				var parent = $(img).parent();
				// if (settings.command == 'edit') {
				// $(img).css('padding', '0px');
				// $(img).css('margin', '0px');
				// }
				var marker = $('<div>');
				$(marker).on('click', edit_marker_click);
				$(marker).on('mousemove', edit_marker_mousemove);

				var div = $('<div>').attr({
					'class' : parent_class
				}).css({
					'position' : 'relative'
				}).append($(img)).append(marker);
				$(parent).append(div);
				div.each(resize_imgbox);
				page_contains_elements = true;
			});
			return page_contains_elements;
		}

		function window_resize_imgbox() {
			$('.' + parent_class).each(resize_imgbox);
		}

		function init_imgbox() {
			// $('.' + parent_class).find('img').one("load",
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
			} else {
				if (data.x2 == undefined || data.y2 == undefined) {
					data.x2 = data.x + data.w;
					data.y2 = data.y + data.h;
				}
			}
			return data;
		}

		function resize_imgbox(idx, parent) {

			var $img = $(parent).find('img');
			var data;

			if (settings.command == 'edit' && edit_button_down) {
				data = normalised_coords = calcCoords(start_x, start_y, end_x, end_y);
			} else {
				data = validate_data($img.data());
				if (data == null) {
					return;
				}
				data = actual_to_screen($img, data);
				// data = normalised_coords = calcCoords(data.x,
				// data.y, data.x2, data.y2);
			}

			var css = {
				'left' : data.x,
				'top' : data.y,
				'width' : data.w,
				'height' : data.h,
			};
			var marker_css = $.extend({}, settings.markStyle, css);
			$(parent).find('div').css(marker_css);
		}

		function actual_to_screen($img, actual) {
			var width = $img.width();
			var realWidth = $img[0].naturalWidth;
			var ratio = width / realWidth;

			var o = {};
			o.x = Math.floor(actual.x * ratio);
			o.y = Math.floor(actual.y * ratio);
			o.x2 = Math.floor(actual.x2 * ratio);
			o.y2 = Math.floor(actual.y2 * ratio);
			o.w = Math.floor(actual.w * ratio);
			o.h = Math.floor(actual.h * ratio);

			return o;

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

		/*
		 * Override 'save_box' to save co-ordinates. coord { x, y, w, h,
		 * x2, y2 }
		 */
		function callback_save_box(coord) {
			console.log(coord);
		}

		function calcCoords(s_x, s_y, e_x, e_y) {
			var o = {};
			o.x = Math.min(s_x, e_x);
			o.y = Math.min(s_y, e_y);
			o.x2 = Math.max(s_x, e_x);
			o.y2 = Math.min(s_y, e_y);
			o.w = Math.abs(s_x - e_x);
			o.h = Math.abs(s_y - e_y);
			return o;
		}

		function debug(str) {
			if (settings.debug) {
				console.log('imgbox: ' + parent_class, str);
			}
		}

	};

}(jQuery));
