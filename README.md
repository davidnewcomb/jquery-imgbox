# jQuery ImgBox Plugin
jQuery plugin that draws a box over an image.

## Overview

This plugin can be used with minimum changes to your existing code.
ImgBox reads `data-` attributes to your img tags and draws a custom styled box.
See the [demo page](https://cdn.rawgit.com/davidnewcomb/jquery-imgbox/master/example.html)
for examples.

## Dependencies

1. [jQuery](https://jquery.com)

## Usage

Place the exta data items into your image tags. You may use width/height or a second set of
co-ordinates. The following 2 are equivalent.
```html
<img data-x="10" data-y="10" data-w="10" data-h="10" class=".." src=".." />
```
```html
<img data-x="10" data-y="10" data-x2="20" data-y2="20" class=".." src=".." />
```

Activate the plugin during start up.
```js
$(document).ready(function() {
	$('img').imgbox();
});
```

## Options

Here's a list of available settings.

### HTML settings
To be used in `IMG` tags.

Attribute	| Type		| Rule				| Description
---		| ---		| ---				| ---
`data-x`	| *Number*	| Required			| CSS left
`data-y`	| *Number*	| Required			| CSS top
`data-w`	| *Number*	| Optional: Used with `data-h`	| CSS width
`data-h`	| *Number*	| Optional: Used with `data-w`	| CSS height
`data-x2`	| *Number*	| Optional: Used with `data-y2`	| Second co-ordinate used to calculate width
`data-y2`	| *Number*	| Optional: Used with `data-x2`	| Second co-ordinate used to calculate height

If `w`, `h`, `x2` and `y2` are used, then `w`, `h` take precedence.

### Javascript settings

Attribute	| Type			| Default				| Description
---		| ---			| ---					| ---
`markStyle`	| *Object*		| `{'border' : '1px solid red'}`	| Red solid border line.
`markZIndex`	| *Number*		| `1000`				| CSS `z-index` value.
`debug`		| *Boolean*		| `false`				| Some extra information.

## License

[MIT License](https://opensource.org/licenses/MIT) &copy; David Newcomb, http://www.bigsoft.co.uk
