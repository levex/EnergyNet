import json
import unittest

from unittest.mock import patch
from meter.rpc import ParityRPCClient


class ParityRPCClientTestCase(unittest.TestCase):

    def setUp(self):
        self.parity_rpc_client = ParityRPCClient("http://mock.url.com")
        self.headers = {'content-type': 'application/json'}

    @patch('meter.rpc.parity_rpc_client.requests.post')
    def test_send_transaction(self, mock_post):
        self.parity_rpc_client.send_transaction(
            from_=format(1234, "#042x"),
            to=format(12345, "#042x"),
            gas=123,
        )

        mock_post.assert_called_once_with(
            "http://mock.url.com",
            data=json.dumps([self.parity_rpc_client._build_payload(
                "eth_sendTransaction",
                {
                    "to": format(12345, "#042x"),
                    "gas": 123,
                    "from": format(1234, "#042x"),
                },
            )]),
            headers=self.headers,
        )

    @patch('meter.rpc.parity_rpc_client.requests.post')
    def test_call(self, mock_post):
        self.parity_rpc_client.call(
            from_=format(12345, "#042x"),
            to=format(12345, "#042x"),
            gas=321,
        )

        mock_post.assert_called_once_with(
            "http://mock.url.com",
            data=json.dumps([self.parity_rpc_client._build_payload(
                "eth_call",
                {
                    "to": format(12345, "#042x"),
                    "gas": 321,
                    "from": format(12345, "#042x"),
                }
            )]),
            headers=self.headers,
        )

    def test_payload_is_built_correctly(self):
        payload = self.parity_rpc_client._build_payload(
            "testMethod",
            {
                "test1": 12345,
                "ayy": "lmao",
            },
        )

        expected_payload = {
            "method": "testMethod",
            "params": {
                "test1": hex(12345),
                "ayy": "lmao",
            },
            "jsonrpc": "2.0",
            "id": 0,
        }

        self.assertDictEqual(expected_payload, payload)
