curl -d '{"from": "Sun, 01 Oct 2017 00:00:00 GMT", "to": "Sun, 01 Oct 2017 23:59:59 GMT", "amount": 23.1}' -H "Content-Type: application/json" -X POST localhost:5000/consumed
curl -d '{"from": "Mon, 02 Oct 2017 00:00:00 GMT", "to": "Mon, 02 Oct 2017 23:59:59 GMT", "amount": 25.6}' -H "Content-Type: application/json" -X POST localhost:5000/consumed
curl -d '{"from": "Tue, 03 Oct 2017 00:00:00 GMT", "to": "Tue, 03 Oct 2017 23:59:59 GMT", "amount": 23.2}' -H "Content-Type: application/json" -X POST localhost:5000/consumed
curl -d '{"from": "Wed, 01 Nov 2017 00:00:00 GMT", "to": "Wed, 01 Nov 2017 23:59:59 GMT", "amount": 30.4}' -H "Content-Type: application/json" -X POST localhost:5000/consumed
curl -d '{"from": "Thu, 02 Nov 2017 00:00:00 GMT", "to": "Thu, 02 Nov 2017 23:59:59 GMT", "amount": 36.1}' -H "Content-Type: application/json" -X POST localhost:5000/consumed
