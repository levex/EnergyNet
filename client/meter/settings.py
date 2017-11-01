# Database settings
MONGO_HOST = "localhost"
MONGO_PORT = 27017

MONGO_DBNAME = "meter"

# Allowed methods
RESOURCE_METHODS = ["GET", "POST"]

# Domain definition
DOMAIN = {
    "consumed": {
        "schema": {
            "from": {
                "type": "datetime",
                "required": True,
            },
            "to": {
                "type": "datetime",
                "required": True,
            },
            "amount": {
                "type": "float",
                "required": True,
            },
        }
    },
    "produced": {
        "schema": {
            "from": {
                "type": "datetime",
                "required": True,
            },
            "to": {
                "type": "datetime",
                "required": True,
            },
            "amount": {
                "type": "float",
                "required": True,
            },
        }
    },
    "sold": {
        "schema": {
            "timestamp": {
                "type": "datetime",
                "required": True,
            },
            "amount": {
                "type": "float",
                "required": True,
            },
        }
    },
    "bought": {
        "schema": {
            "timestamp": {
                "type": "datetime",
                "required": True,
            },
            "amount": {
                "type": "float",
                "required": True,
            },
        }
    },
}
