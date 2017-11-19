import json
import unittest

import simulation.meter

from unittest.mock import patch


class SimulatedMeterClientTest(unittest.TestCase):

    @patch('simulation.meter.requests.post')
    def test_sell_energy(self, mock_post):
        simulation.meter.tick((2, 2))

        mock_post.assert_called_once_with(
            simulation.meter.METER_API_BASE_URL + "transaction/sell",
            data=json.dumps({
                "amount": 2,
                "price": 1,
            }),
            headers=simulation.meter.API_CALL_HEADER,
        )

        self.assertEqual(simulation.meter.simulation_metrics["sold"], 2)

    @patch('simulation.meter.requests.post')
    def test_consume_energy(self, mock_post):
        simulation.meter.tick((-2, -2))

        mock_post.assert_called_once_with(
            simulation.meter.METER_API_BASE_URL + "transaction/consume",
            data=json.dumps({
                "amount": 2,
            }),
            headers=simulation.meter.API_CALL_HEADER,
        )

        self.assertEqual(simulation.meter.simulation_metrics["consumed"], 2)
