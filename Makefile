BINDIR=node_modules/.bin
MICROBUNDLE=$(BINDIR)/microbundle
TSLINT=$(BINDIR)/tslint

ARG=$(filter-out $@,$(MAKECMDGOALS))
PACKAGE=packages/$(ARG)
PACKAGE_VERSION=$(shell node -p -e 'require("./$(PACKAGE)/package.json").version')

help :
	@echo "Available commands for hyperfun.js monorepo:"
	@echo ""
	@echo "  make dist <package>\t\tbuild dist for <package> only (e.g. 'make dist run')"
	@echo "  make dist-all\t\t\tbuild everything"
	@echo "  make example <example>t\texecute example"
	@echo "  make format-all\t\tformat all packages"
	@echo "  make format <package>\t\tformat just <package> (e.g. 'make format dom')"
	@echo "  make lint-all\t\t\tlint all packages"
	@echo "  make lint <package>\t\tlint just <package> (e.g. 'make lint dom')"
	@echo "  make release-minor <package>\trelease a new minor version of <package>"
	@echo "  make release-major <package>\trelease a new major version of <package>"
	@echo "  make test\t\t\ttest everything"
	@echo "  make test <package>\t\ttest just <package>  (e.g. 'make test run')"
	@echo "  make test:watch <package>\ttest just <package>  (e.g. 'make test:watch run')"
	@echo ""

dist :
	@if [ "$(ARG)" = "" ]; then \
		echo "Error: please call 'make dist' with an argument, like 'make dist run'" ;\
	else \
		rm -rf $(PACKAGE)/dist/ ;\
		cd $(PACKAGE) || exit $? ;\
		../../$(MICROBUNDLE) build -i src/index.ts --name $(PACKAGE) || exit $? ; \
		cd ../../ || exit $? ; \
		([ $$? -eq 0 ] && echo "✓ Builded $(ARG) distribution files" || exit 1) ;\
	fi

dist-all :
	@if [ "$(ARG)" = "" ]; then \
		while read d ; do \
			echo "Compiling $$d" ; \
			make dist $$d || exit $? ;\
		done < .scripts/PACKAGES ; \
		([ $$? -eq 0 ] && echo "✓ Builded $$d distribution files" || exit 1) ;\
	fi

example :
	@if [ "$(ARG)" = "" ]; then \
		echo "Error: please call 'make example' with an argument, like 'make example counter'" ;\
	else \
		npm run example:$(ARG) ;\
	fi

format :
	@if [ "$(ARG)" = "" ]; then \
		echo "Error: please call 'make format' with an argument, like 'make format run'" ;\
	else \
		$(BINDIR)/prettier --write "packages/$(ARG)/{src,test}/**/*.ts" ;\
	fi

format-all :
	@if [ "$(ARG)" = "" ]; then \
		while read d ; do \
			echo "Format $$d" ; \
			make format $$d || exit $? ;\
		done < .scripts/PACKAGES ; \
		([ $$? -eq 0 ] && echo "✓ Formatted files" || exit 1) ;\
	fi

lint :
	@if [ "$(ARG)" = "" ]; then \
		make lint-all ;\
	else \
		cd $(PACKAGE) && ../../$(TSLINT) --fix --config ../../tslint.json --project tsconfig.json &&\
		echo "✓ TSLint $(PACKAGE) passed" ;\
	fi

lint-all :
	.scripts/lint-all.sh

release :
	@if [ "$(ARG)" = "" ]; then \
		echo "Error: No package defined" ;\
	else \
		git add -A || exit $? ;\
		git commit -m 'release($(ARG)): $(PACKAGE_VERSION)' || exit $? ;\
		git push origin master || exit $? ;\
		git tag $(ARG)-$(PACKAGE_VERSION) || exit $? ;\
		git push --tags || exit $? ;\
		cd $(PACKAGE) || exit $? ;\
		npm publish || exit $? ;\
		cd ../../ || exit $? ;\
		([ $$? -eq 0 ] && echo "✓ Released $(ARG) $(PACKAGE_VERSION)" || exit 1) ;\
	fi

release-minor :
	@if [ "$(ARG)" = "" ]; then \
		echo "Error: please call 'make release-minor' with an argument, like 'make release-minor run'" ;\
	else \
		make test $(ARG) || exit $? ;\
		make dist $(ARG) || exit $? ;\
		cd $(PACKAGE) || exit $? ;\
		npm version minor || exit $? ;\
		cd ../../ || exit $? ;\
		make release  $(ARG) || exit $? ;\
		([ $$? -eq 0 ] && echo "✓ Released new minor $(ARG)-$(PACKAGE_VERSION)" || exit 1) ;\
fi

release-major :
	@if [ "$(ARG)" = "" ]; then \
		echo "Error: please call 'make release-major' with an argument, like 'make release-major run'" ;\
	else \
		make test $(ARG) || exit $? ;\
		make dist $(ARG) || exit $? ;\
		cd $(PACKAGE) || exit $? ;\
		npm version major || exit $? ;\
		cd ../../ || exit $? ;\
		make release  $(ARG) || exit $? ;\
		([ $$? -eq 0 ] && echo "✓ Released new major $(ARG)-$(PACKAGE_VERSION)" || exit 1) ;\
fi

test :
	@if [ "$(ARG)" = "" ]; then \
		make test-all ;\
	else \
		cd $(PACKAGE) || exit $? ;\
		npm run test || exit $? ;\
		cd ../../ || exit $? ;\
		([ $$? -eq 0 ] && echo "✓ Tested $(PACKAGE)" || exit 1) ;\
	fi

test-watch :
	@if [ "$(ARG)" = "" ]; then \
		echo "Error: No package defined" ;\
	else \
		cd $(PACKAGE) && npm run test:watch && ([ $$? -eq 0 ] && echo "✓ Tested $(PACKAGE)") || exit 1;\
	fi

test-all :
	.scripts/test-all.sh

# catch anything and do nothing
%:
	@:
