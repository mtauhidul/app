#!/usr/bin/env bash

echo "Run CI as for demo deployment..."

export BUILD_ENV=demo
export NODE_ENV=production
export CLUSTER=interopion-prod
export DOCKER_REPO=$AWS_ECR_HOST

echo "BUILD_ENV: $BUILD_ENV"
echo "NODE_ENV: $NODE_ENV"