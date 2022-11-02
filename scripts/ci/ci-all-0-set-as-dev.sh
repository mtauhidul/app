#!/usr/bin/env bash

echo "Run CI as for development deployment..."

export BUILD_ENV=development
export NODE_ENV=production
export CLUSTER=interopion-dev
export DOCKER_REPO=$AWS_ECR_HOST

echo "BUILD_ENV: $BUILD_ENV"
echo "NODE_ENV: $NODE_ENV"