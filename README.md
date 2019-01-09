# jQuery ImgBox Plugin
jQuery plugin that draws a box over an image.

## Overview

ImgBox reads `data-` attributes to your image tags and draws a custom styled box over the image.
See the [demo page](https://cdn.bigsoft.co.uk/projects/jquery-imgbox/example.html)
for examples.

ImgBox also has an drawable edit mode and you can update the position of the box yourself at anytime.

This plugin can be used with minimum changes to your existing code.

## Dependencies

1. [jQuery](https://jquery.com)

## Size

After gzip compression `jquery.imgbox.min.js` is 1.5K.

## Usage

### Read-only

Place the extra data items into your image tags. You may use width/height or a second set of
coordinates. The following 2 are equivalent.
```html
<img data-x="10" data-y="10" data-w="10" data-h="10" class=".." src=".." />
```
```html
<img data-x="10" data-y="10" data-x2="20" data-y2="20" class=".." src=".." />
```

You must include one of the mark styler settings when you create the ImgBox, otherwise
you won't see anything! Activate the plugin during start up with either of these two
minimum configurations. You may specify `markClass` or `markStyle` or both but not niether.
```js
$(document).ready(function() {
	$('img').imgbox({markClass:'myclass'});
});

$(document).ready(function() {
	$('img').imgbox({markStyle:{border:'5px solid red'});
});

```

### Editable

The ImgBox has a simple edit mode. Click to set the start point, move the mouse to a
new position and click again to trigger the callback function. The `data` object
contains the saved `x`, `y`, `w`, `h`, `x2`, `y2`.
```js
function(data) {}
```

To switch on edit mode, specify the `command` as `edit` and add the `saveBox` callback.
```js
$(document).ready(function() {
	var imgAdmin = $('img').imgbox({
	markStyle : {
		'border' : '5px solid blue'
	},
	command : 'edit',
	saveBox : function(data) {
		console.log('Thanks for using ImgBox!');
	}
});
```

If you want to change the coordinates then you need access to the callback object.
```js
$(document).ready(function() {
	var newData = {x: 10, y:10, w:10, h:10};
	var imgAdmin = $('img').imgbox();
	$(img).data(newData);
	imgAdmin.redraw();
});
```

If you thing `imgAdmin` needs any other features then create an issue for discussion.

## Options

Here's the list of available settings.

### HTML settings
To be used in `IMG` tags.

Attribute	| Type		| Rule							| Description
---			| ---		| ---							| ---
`data-x`	| *Number*	| Required						| CSS left
`data-y`	| *Number*	| Required						| CSS top
`data-w`	| *Number*	| Optional: Used with `data-h`	| CSS width
`data-h`	| *Number*	| Optional: Used with `data-w`	| CSS height
`data-x2`	| *Number*	| Optional: Used with `data-y2`	| Second coordinate used to calculate width
`data-y2`	| *Number*	| Optional: Used with `data-x2`	| Second coordinate used to calculate height

If `w`, `h`, `x2` and `y2` are used, then `w`, `h` take precedence.

### Javascript settings

Attribute		| Type			| Default				| Description
---				| ---			| ---					| ---
`markClass`		| *String*		| `''`					| Classes to be used for marker box.
`markStyle`		| *Object*		| `{}`					| CSS for marker box.
`debug`			| *Boolean*		| `false`				| Some extra information.
`name`			| *String*		| `''`					| Name added to debug messages
`command`		| *String*		| `''`					| Type of ImgBox, currently only '' or 'edit'
`saveBox`		| *Function*	| Prints imgbox data on `console.log`	| Callback `function(data){}` on save
`wrapIfInvalid`	| *Boolean*		| `false`				| Wrap `img` even if no coordinates
`retryInterval`	| *Number*		| `1000`				| If `img.src` has not loaded retry redraw in milliseconds.

As a minimum you must specify at least one of `markClass` or `markStyle`.

## License

[MIT License](https://opensource.org/licenses/MIT) &copy; David Newcomb, http://www.bigsoft.co.uk
