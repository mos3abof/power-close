all: clean build

# clean
clean:
	rm -rf dist/*

# build
build:
	mkdir -p dist/{firefox,chrome}

	# copy browser-specific manifests
	cp src/manifest-firefox.json dist/firefox/manifest.json
	cp src/manifest-chrome.json dist/chrome/manifest.json

	# copy background.js
	cp src/background.js dist/firefox
	cp src/background.js dist/chrome
	
	# copy popup
	cp -rf src/popup dist/firefox
	cp -rf src/popup dist/chrome

	# copy icons
	cp -rf src/icons dist/firefox
	cp -rf src/icons dist/chrome

	# copy the vendored design system (the popup's CSS and fonts)
	cp -rf src/vendor dist/firefox
	cp -rf src/vendor dist/chrome

	# zip the folders without deleting the unpacked files
	(cd ./dist/firefox/; zip -r power-close.zip * -x "power-close.zip")
	(cd ./dist/chrome/; zip -r power-close.zip * -x "power-close.zip")

# build firefox only
firefox: clean
	mkdir -p dist/firefox
	cp src/manifest-firefox.json dist/firefox/manifest.json
	cp src/background.js dist/firefox
	cp -rf src/popup dist/firefox
	cp -rf src/icons dist/firefox
	cp -rf src/vendor dist/firefox
	(cd ./dist/firefox/; zip -r power-close.zip * -x "power-close.zip")

# build chrome only
chrome: clean
	mkdir -p dist/chrome
	cp src/manifest-chrome.json dist/chrome/manifest.json
	cp src/background.js dist/chrome
	cp -rf src/popup dist/chrome
	cp -rf src/icons dist/chrome
	cp -rf src/vendor dist/chrome
	(cd ./dist/chrome/; zip -r power-close.zip * -x "power-close.zip")

# validate manifests
validate:
	@echo "Validating manifests..."
	@python3 -m json.tool src/manifest.json > /dev/null && echo "✓ src/manifest.json is valid JSON"
	@python3 -m json.tool src/manifest-firefox.json > /dev/null && echo "✓ Firefox manifest is valid JSON"
	@python3 -m json.tool src/manifest-chrome.json > /dev/null && echo "✓ Chrome manifest is valid JSON"
