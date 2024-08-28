all: clean build

# clean
clean:
	rm -rf dist/*

# build
build:
	mkdir -p dist/{firefox,chrome}

	# copy manifest.json
	cp src/manifest.json dist/firefox
	cp src/manifest.json dist/chrome

	# copy background.js
	cp src/background.js dist/firefox
	cp src/background.js dist/chrome
	
	# copy popup
	cp -rf src/popup dist/firefox
	cp -rf src/popup dist/chrome

	# copy icons
	cp -rf src/icons dist/firefox
	cp -rf src/icons dist/chrome

	# zip the folders
	(cd ./dist/firefox/; zip -rm power-close.zip *)
	(cd ./dist/chrome/; zip -rm power-close.zip *)
