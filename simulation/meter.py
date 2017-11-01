import argparse
import random

from http.server import BaseHTTPRequestHandler, HTTPServer


class Meter():

    def __init__(self, wallet_address, excess_interval=(0.0, 0.0)):
        self.energy_sold = 0
        self.energy_bought = 0
        self.penalties_paid = 0
        self.energy_lost = 0
        self.unsatsfied_energy_need = 0

        self.excess_interval = excess_interval
        self.wallet_address = wallet_address

    def tick(self):
        excess = random.uniform(*self.excess_interval)

        if excess < 0:
            # TODO: Implement method to buy energy from the network and update
            # stats
            # self.buy(-excess)
            pass
        elif excess > 0:
            # TODO: Implement method to sell energy on the network and update
            # stats
            # self.sell(-excess)
            pass

        # TODO: Method to retrieve penalties information from the blockchain
        # self.check_penalties()


meter = None


class MeterHTTPRequestHandler(BaseHTTPRequestHandler):

    def do_GET(self):
        if self.path is "/tick":
            meter.tick()

        self.send_response(200, "Bananas")


def parse_arguments():
    parser = argparse.ArgumentParser("Launch a simulated meter")
    parser.add_argument(
        "-e", "--excess-interval", nargs=2, type=float, default=[0.0, 0.0],
        help="The interval of energy excess per time unit (can be negative)"
    )
    parser.add_argument(
        "-w", "--wallet-address", required=True,
        help="The address of the meter wallet"
    )
    parser.add_argument(
        "-p", "--port", default=8080,
        help="The port used to receive commands from the master "
        "simulation process"
    )

    return parser.parse_args()


if __name__ == "__main__":
    args = parse_arguments()

    meter = Meter(args.wallet_address, args.excess_interval)

    server_address = ("", args.port)
    httpd = HTTPServer(server_address, MeterHTTPRequestHandler)
    httpd.serve_forever()
