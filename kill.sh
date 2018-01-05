#!/bin/sh

ps | grep -E 'parity|mongod|[^z]sh|Python|node' | tr -s ' ' | cut -d ' ' -f 1 | xargs kill
