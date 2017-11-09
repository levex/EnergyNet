import requests
import json


class ParityRPCClient():

    def __init__(self, url):
        self.url = url
        self.headers = {'content-type': 'application/json'}

    def _build_payload(self, method, params):
        for key, value in params.items():
            if isinstance(value, int):
                params[key] = hex(value)

        return {
            "method": method,
            "params": params,
            "jsonrpc": "2.0",
            "id": 0,
        }

    def send_transaction(self, from_, **kwargs):
        """
        Send a eth_sendTransaction command to the parity client

        :param from_: The address the transaction is sent from (as a string)

        Optional parameters:

        :param to: The address the transaction is directed to (as a string)
        :param gas: Integer of the gas provided for the transaction execution.
        :param gasPrice: Integer of the gas price used for each paid gas.
        :param value: Integer of the value sent with this transaction.
        :param data: 4 byte hash of the method signature followed by encoded
            parameters (as a string).
        :param nonce: Integer of a nonce. This allows to overwrite your own
            pending transactions that use the same nonce.
        :param condition: Conditional submission of the transaction. Can be
            either an integer block number { block: 1  } or UTC timestamp
            (in seconds) { time: 1491290692  } or None.
        """
        kwargs["from"] = from_

        payload = self._build_payload("eth_sendTransaction", kwargs)

        return requests.post(
            self.url,
            data=json.dumps([payload]),
            headers=self.headers
        )

    def call(self, from_=None, **kwargs):
        """
        Send an eth_call command to the parity client

        :param from_: This is explicit because from is a reserved keyword

        See
        https://github.com/paritytech/parity/wiki/JSONRPC-eth-module#eth_call
        for documentation
        """
        kwargs["from"] = from_

        payload = self._build_payload("eth_call", kwargs)

        return requests.post(
            self.url,
            data=json.dumps([payload]),
            headers=self.headers,
        )
