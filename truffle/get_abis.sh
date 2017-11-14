#!/bin/sh

set -e

ABI_DIR=${WORKING_DIRECTORY}/../dapp/src/client/scripts/abis

mkdir -p $ABI_DIR
echo "Writing ABI to $ABI_DIR"

${WORKING_DIRECTORY}/get_abi.py ${BUILD_CONTRACTS_DIRECTORY}/Master.json ENERGY_MASTER_ABI > \
	${ABI_DIR}/abi_master.js

${WORKING_DIRECTORY}/get_abi.py ${BUILD_CONTRACTS_DIRECTORY}/Energy.json ENERGY_ABI > \
	${ABI_DIR}/abi.js
