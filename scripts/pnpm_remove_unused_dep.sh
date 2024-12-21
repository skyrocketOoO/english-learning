#!/bin/bash

# Run depcheck to find unused dependencies
unused_deps=$(depcheck --json | jq -r '.dependencies[]')

if [ -z "$unused_deps" ]; then
  echo "No unused dependencies found."
  exit 0
fi

echo "Removing unused dependencies: $unused_deps"

# Uninstall each unused dependency
for dep in $unused_deps; do
  echo "Uninstalling $dep..."
  pnpm uninstall "$dep"
done

echo "Unused dependencies removed."
