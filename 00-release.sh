#!/bin/bash
#
# Tag code and publish to NPM
#

S="src"
T="/tmp"

question() {
	echo -n "$1? "
	read ANSWER
}

git tag | sort -V
question "New version (x.x.x)"
if [ "$ANSWER" = "" ]
then
	echo "Error: no tag"
	exit 1
fi
VERSION=$ANSWER

echo "Build static"

cat $S/copyright-notice.txt | sed "s/{version}/$VERSION/g" | sed "s/{date}/`date -u`/g" > $T/header.tmp
cat $S/jquery.imgbox.js     | sed "s/{version}/$VERSION/g" | sed "s/{date}/`date -u`/g" > $T/body.tmp

cat $T/header.tmp $T/body.tmp > jquery.imgbox.js

echo "Build minified"

./node_modules/uglify-js/bin/uglifyjs $T/body.tmp -m -c > $T/body-min.tmp
cat $T/header.tmp $T/body-min.tmp > jquery.imgbox.min.js

rm $T/header.tmp $T/body.tmp $T/body-min.tmp

# Sorry, my program that helps checking in, diffs and commits
gitstatus

question "Do you want to create git tags"
if [ "$ANSWER" = "y" ]
then

	echo "Tagging code"
	git tag "v$VERSION"

	echo "Moving latest"
	git tag -f latest

	echo "Pushing..."
	git push --tag
fi

question "Publish to NPM"
if [ "$ANSWER" = "y" ]
then
	npm login
	npm publish
fi

