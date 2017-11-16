import json
import random
import requests

from http.server import BaseHTTPRequestHandler, HTTPServer
from rpc import parity_rpc_client

address = "0x00bC13c328feFA6649498D00A553ee1D692E1Caf"
url = "http://localhost:8545"
parity = parity_rpc_client.ParityRPCClient(url)

class BankHTTPRequestsHandler(BaseHTTPRequestHandler):

  def do_POST(self):
    if self.path == '/money':
      content_length = int(self.headers['Content-Length'])
      post_data = self.rfile.read(content_length)
      print(str(post_data)[2:-1])
      res = parity.send_transaction(address, to=str(post_data)[2:-1],
          value=1000000000000000000)
      print(res.text)


if __name__ == "__main__":
  server_address = ("", 6000)
  httpd = HTTPServer(server_address, BankHTTPRequestsHandler)
  httpd.serve_forever()
