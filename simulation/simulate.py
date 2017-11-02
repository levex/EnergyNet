import argparse
import requests


def parse_arguments():
    parser = argparse.ArgumentParser("Launch a simulated meter")
    parser.add_argument(
        "-i", "--simulated-client-ip", action="append",
        help="The interval of energy excess per time unit (can be negative)"
    )
    parser.add_argument(
        "-t", "--simulation-duration", type=int,
        help="Simulation duration in time units"
    )

    return parser.parse_args()


if __name__ == "__main__":
    args = parse_arguments()

    for i in range(args.simulation_length):
        for ip in args.simulated_client_ip:
            requests.get(ip + "/tick")
