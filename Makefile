all: zips cazips test
	
zips:
	./scripts/fetch.sh

cazips:
	./scripts/fetch_canada.sh

zip: zips

codes: zips

test: tests

tests:
	npm test

.PHONY: test tests zips
