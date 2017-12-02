#!/bin/sh

# Automatically attempt to fix linting issues

set -e

check_dep () {
    if ! [ -x "$(command -v $1)" ]; then
        echo "You don't have $1"
        exit 1
    fi
}

check_dep eslint

PROJ_DIR=$(pwd)
cd $PROJ_DIR/dapp && eslint --ext .jsx src --fix
cd $PROJ_DIR/client/meter && eslint . --fix
