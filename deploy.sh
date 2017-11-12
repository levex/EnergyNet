#!/bin/sh

set -e

check_dep () {
    if ! [ -x $(command -v $1) ]; then
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

HOME=$(pwd)
cd $HOME/truffle && truffle build
cd $HOME/dapp && npm install && webpack && ./add_to_parity.sh
cd $HOME/parity && ./run.sh &
cd $HOME && pip3 install --user -r requirements.txt
python3 client/meter/api.py &
./client/meter/mongostarter.sh &

handler() {
    echo "Killing everything"
    JOBS=$(jobs -p)
    kill ${JOBS}
    killall mongod
}

trap handler SIGINT

wait $(jobs -p)
