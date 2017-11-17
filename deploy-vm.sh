#!/bin/sh

check_dep () {
    if ! [ -x "$(command -v $1)" ]; then
        echo "You don't have $1"
        exit 1
    fi
}

check_dep pwgen

PROJ_DIR=$(pwd)
PASS=$(pwgen 10 1)
cd $PROJ_DIR/parity && echo $PASS > password.txt
ACCOUNT=$(parity --chain ./res/genesis.json --keys-path ./datadir//keys account new --password password.txt)
curl -X POST -d "$ACCOUNT" http://146.169.47.73:6000/money
CONFIG='[account]\n
  unlock = ["'$ACCOUNT'"]\n
  password = ["./password.txt"]'
echo $CONFIG >> $PROJ_DIR/parity/res/config.toml

cd $PROJ_DIR && ./deploy.sh &
