import argparse
import json
import random
import requests


from http.server import BaseHTTPRequestHandler, HTTPServer


METER_API_BASE_URL = "http://localhost:3000/"
API_CALL_HEADER = {
    "content-type": "application/json"
}

args = None

simulation_metrics = {
    "consumed": 0.0,
    "sold": 0.0,
}


def parse_arguments():
    parser = argparse.ArgumentParser("Launch a simulated meter")
    parser.add_argument(
        "-e", "--excess-interval", nargs=2, type=int, default=[0, 0],
        help="The interval of energy excess per time unit (can be negative)"
    )
    parser.add_argument(
        "-p", "--port", default=8080, type=int,
        help="The port used to receive commands from the master "
        "simulation process"
    )

    return parser.parse_args()


def consume_energy(amount):
    requests.post(
        METER_API_BASE_URL + "transaction/consume",
        data=json.dumps({
            "amount": amount,
        }),
        headers=API_CALL_HEADER,
    )
    simulation_metrics["consumed"] += amount


def sell_energy(amount):
    requests.post(
        METER_API_BASE_URL + "transaction/sell",
        data=json.dumps({
            "amount": amount,
            "price": 1,
        }),
        headers=API_CALL_HEADER,
    )
    simulation_metrics["sold"] += amount


def tick(excess_interval):
    produced_energy = random.randint(*excess_interval)

    print("Energy Consumption: " + str(produced_energy))
    if produced_energy < 0:
        consume_energy(-produced_energy)
    elif produced_energy > 0:
        sell_energy(produced_energy)


class MeterHTTPRequestHandler(BaseHTTPRequestHandler):

    def do_GET(self):
        if self.path == "/tick":
            tick(args.excess_interval)

            self.send_response(200)
            self.end_headers()
            return
        elif self.path == "/metrics":

            self.send_response(200)
            self.end_headers()
            self.wfile.write(bytes(
                json.dumps(simulation_metrics),
                "utf-8",
            ))
            return

        self.send_response(404)
        self.end_headers()


if __name__ == "__main__":
    args = parse_arguments()

    server_address = ("", args.port)
    httpd = HTTPServer(server_address, MeterHTTPRequestHandler)
    httpd.serve_forever()
