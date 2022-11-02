#!/usr/bin/env bash

# 1) Login to AWS DOCKER
export AWS_DOCKER_LOGIN=$(aws ecr get-login --no-include-email --region $AWS_DEFAULT_REGION)
$(echo "$AWS_DOCKER_LOGIN" | tr -d '\r')

# 2) Build docker image
echo "Building docker container..."
BUILD_ENV=$BUILD_ENV node generateDefinitions.js
export IMAGE_NAME=$(cat ./container-definitions.json | jq --raw-output '.[0].image')
echo "...as $IMAGE_NAME"
docker build -f ./docker/Dockerfile --no-cache -t $IMAGE_NAME .

# 3) Push docker image
docker push $IMAGE_NAME
