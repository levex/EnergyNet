import argparse
import json
import random
import requests


from http.server import BaseHTTPRequestHandler, HTTPServer


METER_API_BASE_URL = "http://localhost:3000"
API_CALL_HEADER = {
    "content-type": "application/json"
}

args = None


def parse_arguments():
    parser = argparse.ArgumentParser("Launch a simulated meter")
    parser.add_argument(
        "-e", "--excess-interval", nargs=2, type=float, default=[0.0, 0.0],
        help="The interval of energy excess per time unit (can be negative)"
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
    requests.post(
        METER_API_BASE_URL + "/transaction/consume",
        data=json.dumps({
            "amount": amount,
        }),
        headers=API_CALL_HEADER,
    )


def sell_energy(amount):
    # TODO: THis method should add energy to an existing seller contract or
    # create a new seller contract
    requests.post(
        METER_API_BASE_URL + "transaction/sell",
        data=json.dumps({
            "amount": amount,
            "price": 1,
        }),
        headers=API_CALL_HEADER,
    )


def tick():
    produced_energy = random.uniform(*args.excess_interval)

    if produced_energy < 0:
        buy_energy(-produced_energy)
    else:
        sell_energy(produced_energy)


class MeterHTTPRequestHandler(BaseHTTPRequestHandler):

    def do_GET(self):
        if self.path == "/tick":
            tick()

            self.send_response(200)
            return

        self.send_error(404)


if __name__ == "__main__":
    args = parse_arguments()

    server_address = ("", args.port)
    httpd = HTTPServer(server_address, MeterHTTPRequestHandler)
    httpd.serve_forever()
