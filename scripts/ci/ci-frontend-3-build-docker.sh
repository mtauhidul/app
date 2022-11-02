#!/usr/bin/env bash

# 1) Login to Artifactory
docker login -u $ARTIFACTORY_NPM_USER -p $ARTIFACTORY_NPM_PASSWORD $DOCKER_REPO

# 2) Build docker image
echo "Building docker container for $BUILD_ENV..."
BUILD_ENV=$BUILD_ENV node generateDefinitions.js
export IMAGE_NAME=$(cat ./container-definitions.json | jq --raw-output '.[0].image')
echo "...as $IMAGE_NAME"
docker build -f ./docker/Dockerfile --no-cache -t $IMAGE_NAME .

# 3) Push docker image
docker push $IMAGE_NAME
