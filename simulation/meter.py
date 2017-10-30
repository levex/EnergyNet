import argparse


def parse_arguments():
    parser = argparse.ArgumentParser("Launch a simulated meter")
    parser.add_argument(
        "--excess-interval", "-e", nargs=2, default=[0, 0], type=float,
        help="The interval of energy excess per time unit (can be negative)"
    )
    parser.add_argument(
        "--wallet-address", "-w", required=True,
        help="The address of the meter wallet"
    )

    return parser.parse_args()


if __name__ == "__main__":
    args = parse_arguments()
