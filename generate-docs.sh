#!/bin/sh

# Generate docs for v1
# Todo: Update the branch name to the correct branch name
git restore --source=upstream/main  spin-sdk 
(cd spin-sdk && npm install && npm run build-docs)
mv docs v1
# Clean up docs after v1
rm -rf v1/.nojekyll spin-sdk

# Generate docs for v2
mkdir -p v2
# Todo: Update the branch name to the correct branch name
git --work-tree=./v2 checkout upstream/feat/sdk-v2 -- .
(cd v2 && npm install && npm run build-docs)
mv v2/docs ./
rm -rf v2
mv v1 docs