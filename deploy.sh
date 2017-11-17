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

ROOT=$(pwd)
ENERGY_MIN=-100
ENERGY_MAX=100

if [ "$1" != "--no-truffle" ] && [ "$2" != "--no-truffle" ]
then
  cd $ROOT/truffle
  rm -rf build
  truffle compile && truffle build
fi

cd $ROOT/dapp/ && add_to_parity.sh

if [ "$1" != "--no-install" ] && [ "$2" != "--no-install" ]
then
  # Install stuff
  cd $ROOT && pip3 install --user -r requirements.txt
  cd $ROOT/dapp && npm install
  cd $ROOT/client/meter && npm install
fi

# Run parity
cd $ROOT/parity && ./run.sh &

# Run smart meter
cd $ROOT/client/meter && npm start &

# Run dapp
webpack --watch &

handler() {
    echo "Killing everything"
    JOBS=$(jobs -p)
    kill ${JOBS}
    killall mongod
}

#trap handler SIGINT

wait $(jobs -p)
