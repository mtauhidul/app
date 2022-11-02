#!/usr/bin/env bash
if [ ! -z "$SONAR_URL" ]
then

    PROJECT_VERSION=$(cat ./package.json | jq --raw-output '.version')
    RELEASE_VERSION=$(echo $PROJECT_VERSION | cut -d '-' -f 1)

    echo "Create sonar-project.properties for $RELEASE_VERSION"

    sed "s/VERSION/$RELEASE_VERSION/" sonar-project.properties.template >> sonar-project.properties

    cat sonar-project.properties

    npm install
    npm run coverage

    npm i -g sonarqube-scanner
    {{ installTS }}
    sonar-scanner -Dsonar.host.url=$SONAR_URL -Dsonar.login=$SONAR_KEY
else
    echo "Sonar settings missing"
fi