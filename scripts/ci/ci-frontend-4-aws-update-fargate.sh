#!/usr/bin/env bash

# Login to AWS DOCKER
export AWS_DOCKER_LOGIN=$(aws ecr get-login --no-include-email --region $AWS_DEFAULT_REGION)
$(echo "$AWS_DOCKER_LOGIN" | tr -d '\r')

BUILD_ENV=$BUILD_ENV node generateDefinitions.js

echo "****************************************"
echo "****************************************"
echo "****************************************"
cat ./container-definitions.json
echo "****************************************"
echo "****************************************"
echo "****************************************"

# register the ECS task definition and capture the version
export TASK_DEFINITION_NAME=$APP_NAME-td-fg-${BUILD_ENV:0:3}
export TASK_SERVICE_NAME=$APP_NAME-svc-fg-${BUILD_ENV:0:3}
export TASK_VERSION=$(aws ecs register-task-definition --family $TASK_DEFINITION_NAME --execution-role-arn $AWS_ECS_TASK_EXECUTION_ROLE --requires-compatibilities "FARGATE" --network-mode awsvpc --cpu $(cat ./container-definitions.json | jq -c '.[0].cpu') --memory $(cat ./container-definitions.json | jq -c '.[0].memory') --container-definitions $(cat ./container-definitions.json | jq -c '.')  | jq --raw-output '.taskDefinition.revision')
echo "Registered ECS Task Definition - " ${BUILD_ENV:0:3}
echo "Cluster: $CLUSTER"
echo "Service name: $TASK_SERVICE_NAME"
echo "Task Version: $TASK_VERSION"
echo "Task definition: $TASK_DEFINITION_NAME:$TASK_VERSION"
# update the service to use the latest task definition
aws ecs update-service --cluster $CLUSTER --service $TASK_SERVICE_NAME --task-definition $TASK_DEFINITION_NAME:$TASK_VERSION
