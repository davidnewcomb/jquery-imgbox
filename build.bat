rem Prepare for release

echo "/*"                                                             > jquery.imgbox.min.js
echo " *  jquery-imgbox - v1.1.2"                                     >> jquery.imgbox.min.js
echo " *  A jQuery plugin that draws a box over an image."            >> jquery.imgbox.min.js
echo " *  https://github.com/davidnewcomb/jquery-imgbox/"             >> jquery.imgbox.min.js
echo " *"                                                             >> jquery.imgbox.min.js
echo " *  Copyright (c) 2018 David Newcomb, http://www.bigsoft.co.uk" >> jquery.imgbox.min.js
echo " *  MIT License"                                                >> jquery.imgbox.min.js
echo " */"                                                            >> jquery.imgbox.min.js

.\node_modules\uglify-js\bin\uglifyjs jquery.imgbox.js -m -c >> jquery.imgbox.min.js
