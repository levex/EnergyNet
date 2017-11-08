#!/bin/sh

set -e

DAPPS_DIR=$(pwd)/../parity/datadir/dapps

mkdir -p $DAPPS_DIR

ln -s $(pwd)/dist $DAPPS_DIR/energy
