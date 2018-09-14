#!/usr/bin/env bash

# Runs test for each package

for PACKAGE in $(cat .scripts/PACKAGES) ; do
  make lint $PACKAGE || exit $?
done

exit 0
