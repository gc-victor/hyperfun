ARG=$(filter-out $@,$(MAKECMDGOALS))
PACKAGE_VERSION=$(shell node -p -e 'require("./src/package.json").version')

help: ## Show this help message
	@echo 'usage: make [target] <type> <name>'
	@echo
	@echo 'Targets:'
	@egrep '^(.+)\:\ ##\ (.+)' ${MAKEFILE_LIST} | column -t -c 2 -s ':#'

browser : static ## Run a browser example
	npx @dev-pack/dev-pack start;\

build : ## Build distribution files
	npx tsdx build || exit $? ; \

coverage :
	if [ ! -d "./coverage" ]; then \
		echo "You have to execute first 'make test-coverage'" ; \
	else \
		cd coverage ; \
		python -m SimpleHTTPServer 8000 ; \
	fi ;\

gzip-size:
	npx gzip-size-cli dist/hyperfun.cjs.production.min.js || exit $? ; \

format : ## Enforces a consistent style by parsing your code and re-printing it
	npx prettier --write "{src,test}/**/*.ts" ;\

lint : ## Linting utility
	npx tsdx lint --fix ;\

precommit: lint format test

release : ## Common release
	git add -A || exit $? ;\
	git commit -m 'release: $(PACKAGE_VERSION)' || exit $? ;\
	git push origin master || exit $? ;\
	git tag $(PACKAGE_VERSION) || exit $? ;\
	git push --tags || exit $? ;\
	npm publish || exit $? ;\
	([ $$? -eq 0 ] && echo "✓ Released $(PACKAGE_VERSION)" || exit 1) ;\

release-minor : ## Minor release
	make test || exit $? ;\
	make dist || exit $? ;\
	npm version minor || exit $? ;\
	make release || exit $? ;\
	([ $$? -eq 0 ] && echo "✓ Released new minor-$(PACKAGE_VERSION)" || exit 1) ;\

release-major : ## Major release
	make test || exit $? ;\
	make dist || exit $? ;\
	npm version major || exit $? ;\
	make release || exit $? ;\
	([ $$? -eq 0 ] && echo "✓ Released new major-$(PACKAGE_VERSION)" || exit 1) ;\

static : ## Run a static example
	node -r esm examples/static.js; \

test : ## Run tests
	npx tsdx test ;\

test-watch : ## Run tests and watch changes
	npx jest --watchAll ;\

watch : ## Execute dist and watch
	npx tsdx watch ; \

# catch anything and do nothing
%:
	@:
