import argparse
import requests

from collections import defaultdict


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

    for i in range(args.simulation_duration):
        for ip in args.simulated_client_ip:
            requests.get("http://" + ip + "/tick")

    collected_metrics = defaultdict(float)

    # Collect metrics and print them out
    for ip in args.simulated_client_ip:
        metrics = requests.get("http://" + ip + "/metrics").json()
        collected_metrics["sold"] += metrics["sold"]
        collected_metrics["consumed"] += metrics["consumed"]

    print("Simulation run metrics")
    print("Total energy put for sale: " + str(collected_metrics["sold"]))
    print("Total energy consumed: " + str(collected_metrics["consumed"]))
    print("Unsold energy: " +
          str(collected_metrics["sold"] - collected_metrics["consumed"]))
