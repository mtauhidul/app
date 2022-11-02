#!/usr/bin/env bash

echo "Run CI as for local..."

export BUILD_ENV=local
export NODE_ENV=development
export CLUSTER=

export consoleLogLevel=silent
export ioLogLevel=silent

echo "BUILD_ENV: $BUILD_ENV"
echo "NODE_ENV: $NODE_ENV"