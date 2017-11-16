import json
import unittest

import simulation.meter

from unittest.mock import patch


class SimulatedMeterClientTest(unittest.TestCase):

    @patch('simulation.meter.requests.post')
    def test_sell_energy(self, mock_post):
        simulation.meter.tick((2.0, 2.0))

        mock_post.assert_called_once_with(
            simulation.meter.METER_API_BASE_URL + "transaction/sell",
            data=json.dumps({
                "amount": 2.0,
                "price": 1,
            }),
            headers=simulation.meter.API_CALL_HEADER,
        )

    @patch('simulation.meter.requests.post')
    def test_consume_energy(self, mock_post):
        simulation.meter.tick((-2.0, -2.0))

        mock_post.assert_called_once_with(
            simulation.meter.METER_API_BASE_URL + "transaction/consume",
            data=json.dumps({
                "amount": 2.0,
            }),
            headers=simulation.meter.API_CALL_HEADER,
        )
