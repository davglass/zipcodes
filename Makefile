all: zips test
	
zips:
	./scripts/fetch.sh

zip: zips

codes: zips

test: tests

tests:
	./tests/lookup.js

.PHONY: test tests zips
