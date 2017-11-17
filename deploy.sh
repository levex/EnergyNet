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

if [ "$2" = "--no-truffle" ]; then
  cd $HOME/truffle && rm -rf build && truffle compile && truffle build
fi

cd $HOME/dapp && npm install && webpack && ./add_to_parity.sh
cd $HOME/parity && ./run.sh &
cd $HOME && pip3 install --user -r requirements.txt
python3 client/meter/api.py &
./client/meter/mongostarter.sh &
cd $HOME/client/meter && npm install && npm start &

handler() {
    echo "Killing everything"
    JOBS=$(jobs -p)
    kill ${JOBS}
    killall mongod
}

#trap handler SIGINT

wait $(jobs -p)
