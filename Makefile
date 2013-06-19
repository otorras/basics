TESTS = test/*.js
REPORTER = dot

test:
	@./node_modules/.bin/mocha \
		--reporter $(REPORTER) \
		--growl \
		$(TESTS)

.PHONY: test
