#!/bin/sh

set -e

HOME=$(pwd)
cd $HOME/truffle && truffle build
cd $HOME/dapp && npm install && webpack && ./add_to_parity.sh
cd $HOME/parity && ./run.sh &
cd $HOME && pip install -r requirements.txt
python client/meter/api.py &
./client/meter/mongostarter.sh &
