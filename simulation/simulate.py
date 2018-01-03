import argparse
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


if __name__ == "__main__":
    args = parse_arguments()
    simulation_config = json.load(open(args.config))
    print(simulation_config)

    collected_metrics = defaultdict(int)

    # Collect initial readings
    #for ip in args.simulated_client_ip:
    #    metrics = requests.get(make_api(ip, "/metrics")).json()
    #    collected_metrics["sold"] -= metrics["sold"]
    #    collected_metrics["consumed"] -= metrics["consumed"]

    # Configure meters
    for c in simulation_config.values():
      ip = c["ip"]
      config = c["config"]
      requests.get(make_api(ip, "/metrics"))
      time.sleep(1)
      requests.post(make_api(ip, "/config"), data=json.dumps(config), \
          headers= {'Content-type': 'application/json', 'Accept': 'text/plain'})

    #for i in range(args.simulation_duration):
    #    for ip in args.simulated_client_ip:
    #        requests.get(make_api(ip, "/tick"))
    #    time.sleep(0.01)

    time.sleep(args.simulation_duration)

    # Disable meters
    for c in simulation_config.values():
      ip = c["ip"]
      config = {
          "price": 1,
          "energy_input": 0,
          "input_noise": 0,
          "enabled": False,
      }

      requests.post(make_api(ip, "/config"), data=json.dumps(config),
          headers= {'Content-type': 'application/json', 'Accept': 'text/plain'})

    # Collect metrics and print them out
    #for ip in args.simulated_client_ip:
    #    metrics = requests.get(make_api(ip, "/metrics")).json()
    #    collected_metrics["sold"] += metrics["sold"]
    #    collected_metrics["consumed"] += metrics["consumed"]

    print("Simulation run metrics")
    print("Total energy put for sale: " + str(collected_metrics["sold"]))
    print("Total energy consumed: " + str(collected_metrics["consumed"]))
    print("Unsold energy: " +
          str(collected_metrics["sold"] - collected_metrics["consumed"]))
