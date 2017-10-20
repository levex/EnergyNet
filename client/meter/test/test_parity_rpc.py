import json
import unittest

from unittest.mock import patch
from meter.rpc import ParityRPCClient


class ParityRPCClientTestCase(unittest.TestCase):

    def setUp(self):
        self.parity_rpc_client = ParityRPCClient("http://mock.url.com")

    @patch('meter.rpc.parity_rpc_client.requests.post')
    def test_send_transaction(self, mock_post):
        self.parity_rpc_client.send_transaction(
            from_=1234,
            to=12345,
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
            headers={'content-type': 'application/json'}
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
