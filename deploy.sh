#!/bin/sh

set -e

check_dep () {
    if ! [ -x "$(command -v $1)" ]; then
        echo "You don't have $1"
        exit 1
    fi
}

check_dep webpack
check_dep truffle
check_dep npm
check_dep parity
check_dep python3
check_dep pip3
check_dep mongod

ENERGY_MIN=-100
ENERGY_MAX=100
PROJ_DIR=$(pwd)
cd $PROJ_DIR/truffle && rm -rf build && truffle compile && truffle build
cd $PROJ_DIR/dapp && npm install && webpack && ./add_to_parity.sh
cd $PROJ_DIR/parity && ./run.sh &
cd $PROJ_DIR && pip3 install --user -r requirements.txt
cd $PROJ_DIR/client/meter && npm install && npm start &
cd $PROJ_DIR/simulation && python3 meter.py -e $ENERGY_MIN $ENERGY_MAX &

handler() {
    echo "Killing everything"
    JOBS=$(jobs -p)
    kill ${JOBS}
    killall mongod
}

trap handler SIGINT

wait $(jobs -p)
