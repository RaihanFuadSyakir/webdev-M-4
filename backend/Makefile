# Makefile

# Variables
BINARY_NAME := finance-management

# Targets
build:
	go build -o $(BINARY_NAME)

run: build
	CompileDaemon -command="./$(BINARY_NAME)"

clean:
	rm -f $(BINARY_NAME)

start: build run

.PHONY: build run clean start
