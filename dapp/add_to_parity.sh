#!/bin/sh

set -e

DAPPS_DIR=$(pwd)/../parity/datadir/dapps

mkdir -p $DAPPS_DIR

rm -f $DAPPS_DIR/energy
ln -s $(pwd)/dist $DAPPS_DIR/energy
