#!/bin/sh

set -e

HOME=$(pwd)
cd $HOME/truffle && truffle build
cd $HOME/dapp && npm install && webpack && ./add_to_parity.sh
cd $HOME/parity && ./run.sh
