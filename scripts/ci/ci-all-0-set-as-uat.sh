#!/usr/bin/env bash

echo "Run CI as for uat deployment..."

export BUILD_ENV=uat
export NODE_ENV=production
export CLUSTER=interopion-uat
export DOCKER_REPO=$AWS_ECR_HOST

echo "BUILD_ENV: $BUILD_ENV"
echo "NODE_ENV: $NODE_ENV"