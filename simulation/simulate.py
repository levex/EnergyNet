import argparse
import requests
import time

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

    return parser.parse_args()


if __name__ == "__main__":
    args = parse_arguments()

    collected_metrics = defaultdict(int)

    # Collect initial readings
    for ip in args.simulated_client_ip:
        metrics = requests.get(make_api(ip, "/metrics")).json()
        collected_metrics["sold"] -= metrics["sold"]
        collected_metrics["consumed"] -= metrics["consumed"]

    for i in range(args.simulation_duration):
        for ip in args.simulated_client_ip:
            requests.get(make_api(ip, "/tick"))
        time.sleep(0.01)

    # Collect metrics and print them out
    for ip in args.simulated_client_ip:
        metrics = requests.get(make_api(ip, "/metrics")).json()
        collected_metrics["sold"] += metrics["sold"]
        collected_metrics["consumed"] += metrics["consumed"]

    print("Simulation run metrics")
    print("Total energy put for sale: " + str(collected_metrics["sold"]))
    print("Total energy consumed: " + str(collected_metrics["consumed"]))
    print("Unsold energy: " +
          str(collected_metrics["sold"] - collected_metrics["consumed"]))
