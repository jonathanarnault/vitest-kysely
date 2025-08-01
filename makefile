default: help

help:									## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(firstword $(MAKEFILE_LIST)) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

install:								## Install dependencies
	@npm install

build:									## Build the project
	@npx turbo run build

test: 									## Run unit tests
	@npx turbo run test:unit

test-watch: 							## Run unit tests in watch mode
	@npx turbo watch test:unit:watch

typecheck:								## Run type checks
	@npx turbo run typecheck

lint-check:								## Run lint checks
	@npx turbo run lint:check

lint-apply:								## Apply lint fixes
	@npx turbo run lint:apply
