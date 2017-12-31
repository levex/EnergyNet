#!/bin/zsh

set -e

ENERGY_MIN=-100
ENERGY_MAX=100
PROJ_DIR=$(pwd)
GF_DASHBOARDS_JSON_PATH=$PROJ_DIR/ansible/grafana/dashboards/
pids=""

handler() {
    echo "Killing everything"
    echo $pids | xargs kill -9
}

trap handler SIGINT SIGTERM EXIT

cd $PROJ_DIR/truffle && rm -rf build && truffle compile && truffle build

cd $PROJ_DIR/dapp && npm install && webpack && ./add_to_parity.sh

cd $PROJ_DIR/parity && ./run.sh &
pids="$pids $!"

cd $PROJ_DIR && pip3 install --user -r requirements.txt

cd $PROJ_DIR/client/meter && npm install && npm start &
pids="$pids $!"

cd $PROJ_DIR/simulation && python3 meter.py -e $ENERGY_MIN $ENERGY_MAX &
pids="$pids $!"

influxd &
pids="$pids $!"

cd $PROJ_DIR/ansible/grafana/ && cp grafana.ini /usr/local/etc/grafana/grafana.ini
grafana-server --config /usr/local/etc/grafana/grafana.ini \
               --homepath /usr/local/opt/grafana/share/grafana \
               cfg:default.paths.logs=/usr/local/var/log/grafana \
               cfg:default.paths.data=/usr/local/var/lib/grafana \
               cfg:default.paths.plugins=/usr/local/var/lib/grafana/plugins &
pids="$pids $!"

#sleep till grafana starts, otherwise curl will fail
sleep 2

curl -XPOST admin:admin@localhost:4000/api/datasources -H 'Content-Type: application/json;charset=UTF-8' \
     --data @$PROJ_DIR/ansible/grafana/datasource.json

curl -XPOST admin:admin@localhost:4000/api/dashboards/db -H 'Content-Type: application/json;charset=UTF-8' \
     --data @$PROJ_DIR/ansible/grafana/dashboards/dashboard.json

wait
