all: zips test
	
zips:
	./scripts/fetch.sh

zip: zips

codes: zips

test: tests

tests:
	npm test

.PHONY: test tests zips
