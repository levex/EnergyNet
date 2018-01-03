import argparse
import json
import random
import requests
import time
import threading

from http.server import BaseHTTPRequestHandler, HTTPServer

METER_API_BASE_URL = "http://localhost:3000/"
API_CALL_HEADER = {
    "content-type": "application/json"
}

args = None

simulation_metrics = {
    "consumed": 0,
    "sold": 0,
}

simulation_config = {
    "price": 1,
    "energy_input": 0,
    "input_noise": 0,
    "enabled": False,
}


def parse_arguments():
    parser = argparse.ArgumentParser("Launch a simulated meter")
    parser.add_argument(
        "-e", "--excess-interval", nargs=2, type=int, default=[0, 0],
        help="The interval of energy excess per time unit (can be negative)"
    )
    parser.add_argument(
        "-P", "--price", type=int, default=1, help="Energy selling price"
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


def sell_energy(amount, price):
    requests.post(
        METER_API_BASE_URL + "transaction/sell",
        data=json.dumps({
            "amount": amount,
        }),
        headers=API_CALL_HEADER,
    )
    simulation_metrics["sold"] += amount

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
        elif self.path == "/config":
            self.send_response(200)
            self.end_headers()
            self.wfile.write(bytes(
                json.dumps(simulation_config),
                "utf-8",
            ))
            return

        self.send_response(404)
        self.end_headers()

    def do_POST(self):
      global simulation_config
      if self.path == '/config':
          content_length = int(self.headers['Content-Length'])
          post_data = str(self.rfile.read(content_length), "utf-8")
          self.send_response(200)
          self.end_headers()

          print(post_data)
          config = json.loads(post_data)
          print("Setting config to: " + str(config))
          if (config["price"] !== simulation_config["price"]):
              print("Setting price to: " + str(config["price"]))
              requests.post(
                  METER_API_BASE_URL + "config/price",
                  data=json.dumps({
                      "price": config["price"],
                  }),
                  headers=API_CALL_HEADER,
              )

          simulation_config = config

          return

      self.send_response(404)
      self.end_headers()

def tick():
    input_noise = simulation_config["input_noise"]
    energy_input = simulation_config["energy_input"] + \
                    random.randint(-input_noise, input_noise)

    print("Energy outcome: " + str(energy_input) + "kWh")
    if energy_input > 0:
      sell_energy(energy_input, simulation_config["price"])
    elif energy_input < 0:
      consume_energy(-energy_input)

if __name__ == "__main__":
    args = parse_arguments()
    simulation_config["price"] = args.price

    server_address = ("", args.port)
    httpd = HTTPServer(server_address, MeterHTTPRequestHandler)
    server_thread = threading.Thread(target = httpd.serve_forever)
    server_thread.daemon = True

    try:
      server_thread.start()
    except:
      httpd.shutdown()

    while True:
      if (simulation_config["enabled"]):
          tick()
      time.sleep(1)
