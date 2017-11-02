#!/usr/bin/env python
import json
import sys

jsonFile = open(sys.argv[1], 'r')
values = json.load(jsonFile)
jsonFile.close()
print("export const " + sys.argv[2] + " = " + json.dumps(values['abi']))
