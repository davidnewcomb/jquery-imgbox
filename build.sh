#!/bin/bash
yarn install
cat << EOF > jquery.imgbox.min.js
/*
 *  jquery-imgbox - v1.2.1
 *  A jQuery plugin that draws a box over an image.
 *  https://github.com/davidnewcomb/jquery-imgbox/
 *
 *  Copyright (c) 2018 David Newcomb, http://www.bigsoft.co.uk
 *  MIT License
 */
EOF
./node_modules/uglify-js/bin/uglifyjs jquery.imgbox.js -m -c >> jquery.imgbox.min.js
