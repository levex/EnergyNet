import argparse
import json
import random
import requests


from datetime import datetime
from http.server import BaseHTTPRequestHandler, HTTPServer


METER_API_BASE_URL = "http://localhost:5000"
API_CALL_HEADER = {
    "content-type": "application/json"
}
DATE_FORMAT = "%a, %d %b %Y %H:%M:%S GMT"

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
        "-p", "--port", default=8080, type=int,
        help="The port used to receive commands from the master "
        "simulation process"
    )

    return parser.parse_args()


def buy_energy(amount):
    # TODO: This method should buy energy by calling a seller contract using
    # the rpc client and update the stats kept by the meter using the API
    pass


def sell_energy(amount):
    # TODO: THis method should add energy to an existing seller contract or
    # create a new seller contract
    pass


class MeterHTTPRequestHandler(BaseHTTPRequestHandler):

    def do_GET(self):
        if self.path == "/tick":
            produced_energy = random.uniform(*args.excess_interval)

            if produced_energy < 0:
                endpoint = "/consumed"
                produced_energy *= -1
                buy_energy(produced_energy)
            else:
                endpoint = "/produced"
                sell_energy(produced_energy)

            new_timestamp = datetime.utcnow()

            request_body = json.dumps({
                "amount": produced_energy,
                "from": datetime.strftime(
                    self.server.last_timestamp,
                    DATE_FORMAT
                ),
                "to": datetime.strftime(new_timestamp, DATE_FORMAT),
            })

            requests.post(
                METER_API_BASE_URL + endpoint,
                data=request_body,
                headers=API_CALL_HEADER,
            )

            self.server.last_timestamp = new_timestamp

            self.send_response(200)
            return

        self.send_error(404)


class MeterServer(HTTPServer):

    def __init__(self, server_address, handler_class):
        self.last_timestamp = datetime.utcnow()
        super(MeterServer, self).__init__(server_address, handler_class)


if __name__ == "__main__":
    args = parse_arguments()

    server_address = ("", args.port)
    httpd = MeterServer(server_address, MeterHTTPRequestHandler)
    httpd.serve_forever()
