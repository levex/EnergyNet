import argparse
import datetime
import json
import random
import requests

from http.server import BaseHTTPRequestHandler, HTTPServer


METER_API_BASE_URL = "localhost:5000"
API_CALL_HEADER = {
    "content-type": "application/json"
}
DATE_FORMAT = "a, %d %b %Y %H:%M:%S UTC"

args = None


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


def buy_energy():
    # TODO: This method should buy energy by calling a seller contract using
    # the rpc client and update the stats kept by the meter using the API
    pass


def sell_energy():
    # TODO: THis method should add energy to an existing seller contract or
    # create a new seller contract
    pass


class MeterHTTPRequestHandler(BaseHTTPRequestHandler):

    def do_GET(self):
        if self.path is "/tick":
            produced_energy = random.uniform(*args.excess_interval)

            if produced_energy < 0:
                endpoint = "/consumed"
                produced_energy *= -1
                buy_energy(produced_energy)
            else:
                endpoint = "/produced"
                sell_energy(produced_energy)

            requests.post(
                METER_API_BASE_URL + endpoint,
                data=json.dumps({
                    "amount": produced_energy,
                    "timestamp": datetime.strftime(
                        datetime.utcnow(), DATE_FORMAT
                    ),
                }),
                headers=API_CALL_HEADER,
            )

            self.send_response(200)

        self.send_error(404)


if __name__ == "__main__":
    args = parse_arguments()

    server_address = ("", args.port)
    httpd = HTTPServer(server_address, MeterHTTPRequestHandler)
    httpd.serve_forever()
