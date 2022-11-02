#!/usr/bin/env bash

echo "Run CI as for local..."

npm install --only=prod
appInfo=$appInfo ZipkinURL=$ZipkinURL interopioLoggingURL=$interopioLoggingURL BUILD_ENV=$BUILD_ENV NODE_ENV=$NODE_ENV npm run frontend:build:custom
