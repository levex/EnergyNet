#!/bin/sh

check_dep () {
    if ! [ -x "$(command -v $1)" ]; then
        echo "You don't have $1"
        exit 1
    fi
}

check_dep pwgen

HOME=$(pwd)
PASS=$(pwgen 10 1)
cd $HOME/parity && echo $PASS > password.txt
ACCOUNT=$(parity --chain ./res/genesis.json --keys-path ./datadir//keys account new --password password.txt)
CONFIG='[account]\n
  unlock = ["'$ACCOUNT'"]\n
  password = ["./password.txt"]'
echo $CONFIG >> $HOME/parity/res/config.toml

cd $HOME && ./deploy.sh &
