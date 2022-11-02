#!/usr/bin/env bash

echo "Run CI as for production..."

export BUILD_ENV=production
export NODE_ENV=production
export CLUSTER=interopio-g2-prod

export DOCKER_REPO=interopion-apps-docker-prod-local.jfrog.io
export executionRoleArn="arn:aws:iam::964513400448:role/ecsTaskExecutionRole"
export repositoryCredentials="arn:aws:secretsmanager:us-east-2:964513400448:secret:interopio/prod/artifactory/jfrog_npm-00Og0H"

# Override AWS credentials with production
export AWS_ACCESS_KEY_ID=$CLEARDATA_AWS_ACCESS_KEY_ID
export AWS_DEFAULT_REGION=$CLEARDATA_AWS_DEFAULT_REGION
export AWS_SECRET_ACCESS_KEY=$CLEARDATA_AWS_SECRET_ACCESS_KEY
