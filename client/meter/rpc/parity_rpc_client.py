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

        :param from_: The address the transaction is send from

        Optional parameters:

        :param to: The address the transaction is directed to
        :param gas: Integer of the gas provided for the transaction execution.
        :param gasPrice: Integer of the gas price used for each paid gas.
        :param value: Integer of the value sent with this transaction.
        :param data: 4 byte hash of the method signature followed by encoded
            parameters.
        :param nonce: Integer of a nonce. This allows to overwrite your own
            pending transactions that use the same nonce.
        :param condition: Conditional submission of the transaction. Can be
            either an integer block number { block: 1  } or UTC timestamp
            (in seconds) { time: 1491290692  } or None.
        """
        kwargs["from"] = format(from_, "#042x")

        if "to" in kwargs.keys():
            kwargs["to"] = format(kwargs["to"], "#042x")

        payload = self._build_payload("eth_sendTransaction", kwargs)

        return requests.post(
            self.url,
            data=json.dumps([payload]),
            headers=self.headers
        )
