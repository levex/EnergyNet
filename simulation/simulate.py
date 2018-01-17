import argparse
import atexit
import requests
import time
import json

from collections import defaultdict

CLIENT_PORT = 8080


def make_api(ip, endpoint):
    return "http://" + ip + ":8080" + endpoint


def parse_arguments():
    parser = argparse.ArgumentParser("Launch a simulated meter")
    parser.add_argument(
        "-i", "--simulated-client-ip", action="append",
        help="IP of a simulation client. Can have more than one"
    )
    parser.add_argument(
        "-t", "--simulation-duration", type=int,
        help="Simulation duration in time units"
    )
    parser.add_argument(
        "-c", "--config", type=str, help="Simulation config"
    )

    return parser.parse_args()


def update_node_config(config, ip):
    print("Updating [" + ip + "], config: " + str(config))
    requests.post(make_api(ip, "/config"), data=json.dumps(config),
                  headers={'Content-type': 'application/json',
                           'Accept': 'text/plain'})


def update_nodes(time):
    for location, node in simulation_config.items():
        ip = node["ip"]
        schedule = node["schedule"]
        if str(time) in schedule:
            config = schedule.get(str(time))
            config["location"] = location
            node["last_price"] = config["price"]
            update_node_config(config, ip)


@atexit.register
def disable_nodes():
    for location, c in simulation_config.items():
        ip = c["ip"]
        config = {
            "price": c["last_price"],
            "energy_input": 0,
            "input_noise": 0,
            "enabled": False,
            "location": location,
            "renewable": False
        }

        update_node_config(config, ip)


if __name__ == "__main__":
    args = parse_arguments()
    simulation_config = json.load(open(args.config))

    collected_metrics = defaultdict(int)

    t = 0
    for i in range(args.simulation_duration):
        update_nodes(t)
        time.sleep(1)
        t += 1

    disable_nodes()
