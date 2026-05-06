VERSION := $(shell grep -o '"version": *"[^"]*"' src/manifest.firefox.json | grep -o '[0-9][0-9.]*')

.PHONY: all clean build build-firefox build-chrome lint run

all: clean build

clean:
	rm -rf dist/*

build: build-firefox build-chrome

build-firefox:
	mkdir -p dist/firefox
	cp src/manifest.firefox.json dist/firefox/manifest.json
	cp src/background.js        dist/firefox/
	cp -rf src/popup            dist/firefox/
	cp -rf src/icons            dist/firefox/
	cp -rf src/options          dist/firefox/
	(cd dist/firefox && zip -rm ../power-close-$(VERSION)-firefox.zip *)

build-chrome:
	mkdir -p dist/chrome
	cp src/manifest.chrome.json dist/chrome/manifest.json
	cp src/background.js        dist/chrome/
	cp -rf src/popup            dist/chrome/
	cp -rf src/icons            dist/chrome/
	cp -rf src/options          dist/chrome/
	(cd dist/chrome && zip -rm ../power-close-$(VERSION)-chrome.zip *)

# Requires: npm install -g web-ext
lint: build-firefox
	web-ext lint --source-dir=dist/firefox

run: build-firefox
	web-ext run --source-dir=dist/firefox
