.PHONY: dev build start lint install help

dev:
	bun run dev

build:
	bun run build

start:
	bun run start

lint:
	bun run lint

install:
	bun install

help:
	@echo "Usage: make [command]"
	@echo "Commands:"
	@echo "  dev      - Run development server"
	@echo "  build    - Build the application"
	@echo "  start    - Start the production server"
	@echo "  lint     - Lint the code"
	@echo "  install  - Install dependencies"
