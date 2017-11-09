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
check_dep python
check_dep pip

HOME=$(pwd)
cd $HOME/truffle && truffle build
cd $HOME/dapp && npm install && webpack && ./add_to_parity.sh
cd $HOME/parity && ./run.sh &
cd $HOME && pip install -r requirements.txt
python client/meter/api.py &
./client/meter/mongostarter.sh &
