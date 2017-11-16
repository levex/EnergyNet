#!/usr/bin/env python
import json
import sys

jsonFile = open(sys.argv[1], 'r')
values = json.load(jsonFile)
jsonFile.close()
abi_const_var_name = sys.argv[2]
print("const " + abi_const_var_name + " = " + json.dumps(values['abi']))
print("module.exports = " + abi_const_var_name)
