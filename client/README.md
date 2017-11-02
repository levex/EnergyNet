Server is started by running
`./meter/mongostarter.sh`
`python meter/api.py`

The API will listen on port 5000.

API:
- `GET /bought` - returns a list of all bought energy data (transaction timestamp + amount of energy bought)
  - Example output: 
``` 
{
    "_meta": {
        "max_results": 25,
        "total": 1,
        "page": 1
    },
    "_items": [
        {
            "_created": "Thu, 02 Nov 2017 14:35:24 GMT",
            "_id": "59fb2d2c9ebe761201873a6f",
            "amount": 12,
            "timestamp": "Tue, 02 Apr 2013 10:29:13 GMT",
            "_updated": "Thu, 02 Nov 2017 14:35:24 GMT",
            "_links": {
                "self": {
                    "title": "Bought",
                    "href": "bought/59fb2d2c9ebe761201873a6f"
                }
            },
            "_etag": "68459818ac2506ce9a35f4cbe4daa5f6527bf9ed"
        }
    ],
    "_links": {
        "self": {
            "title": "bought",
            "href": "bought"
        },
        "parent": {
            "title": "home",
            "href": "/"
        }
    }
}
```
- `GET /bought/$_id` - returns a single element bought element
  - Example output:
```
{
    "_created": "Thu, 02 Nov 2017 14:35:24 GMT",
    "_id": "59fb2d2c9ebe761201873a6f",
    "amount": 12,
    "timestamp": "Tue, 02 Apr 2013 10:29:13 GMT",
    "_updated": "Thu, 02 Nov 2017 14:35:24 GMT",
    "_links": {
        "self": {
            "title": "Bought",
            "href": "bought/59fb2d2c9ebe761201873a6f"
        },
        "parent": {
            "title": "home",
            "href": "/"
        },
        "collection": {
            "title": "bought",
            "href": "bought"
        }
    },
    "_etag": "68459818ac2506ce9a35f4cbe4daa5f6527bf9ed"
}
``` 
- `POST /bought` - add a record of bought energy
  - Example input:
```
{
  "timestamp": "Tue, 02 Apr 2013 10:29:13 GMT",
  "amount": 42.42
}
```

`/sold` has the exact same endpoints, it is used to record when the sale of energy happens and how much energy has been sold.

`/produced` and `/consumed` have similar endpoints, the only difference being in the schema. Instead of `timestamps`, there are a `from` and `to` datetime fields representing the beginning and end of the interval of time in which `amount` of energy was produced/consumed.

NOTE: It is important to use that format for datetimes (we can change the format if you guys want, but it cannot understand different formats)
