# This mess of bash commands implements the gitflow release process
export PROJECT_VERSION=$(cat ./package.json | jq --raw-output '.version')
export RELEASE_VERSION=$(echo $PROJECT_VERSION | cut -d '-' -f 1)
MAJOR_VER=$(echo $RELEASE_VERSION | cut -d "." -f 1) && MINOR_VER=$(echo $RELEASE_VERSION | cut -d "." -f 2) && PATCH_VER=$(echo $RELEASE_VERSION | cut -d "." -f 3) && NEXT_PATCH_VER=$((PATCH_VER+1)) && export NEXT_VERSION=$MAJOR_VER.$MINOR_VER.$NEXT_PATCH_VER
git fetch
git config remote.origin.fetch "+refs/heads/*:refs/remotes/origin/*"
git fetch origin
git checkout -b release/$RELEASE_VERSION
cat package.json
jq --arg v "$RELEASE_VERSION-released" '.version=$v' package.json|sponge package.json
cat package.json
git add .
git commit -m "Incremeinting to next release version $RELEASE_VERSION"
git push origin release/$RELEASE_VERSION
git checkout -b master origin/master
git merge release/$RELEASE_VERSION
git tag $RELEASE_VERSION
git push origin master
git push origin $RELEASE_VERSION
git checkout development
git merge release/$RELEASE_VERSION
cat package.json
jq --arg v "$NEXT_VERSION" '.version=$v' package.json|sponge package.json
cat package.json
git add .
git commit -m "Incrementing to next snapshot version $NEXT_VERSION"
git push origin development
git push origin --delete release/$RELEASE_VERSION
