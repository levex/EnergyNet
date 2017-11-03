#!/bin/sh

${WORKING_DIRECTORY}/get_abi.py ${BUILD_CONTRACTS_DIRECTORY}/Master.json ENERGY_MASTER_ABI > \
	${WORKING_DIRECTORY}/../dapp/src/client/scripts/abis/abi_master.js

${WORKING_DIRECTORY}/get_abi.py ${BUILD_CONTRACTS_DIRECTORY}/Energy.json ENERGY_ABI > \
	${WORKING_DIRECTORY}/../dapp/src/client/scripts/abis/abi.js
