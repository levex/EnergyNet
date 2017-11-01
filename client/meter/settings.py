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
                "readonly": True,
            },
            "to": {
                "type": "datetime",
                "required": True,
                "readonly": True,
            },
            "amount": {
                "type": "float",
                "required": True,
                "readonly": True,
            },
        }
    },
    "produced": {
        "schema": {
            "from": {
                "type": "datetime",
                "required": True,
                "readonly": True,
            },
            "to": {
                "type": "datetime",
                "required": True,
                "readonly": True,
            },
            "amount": {
                "type": "float",
                "required": True,
                "readonly": True,
            },
        }
    },
    "sold": {
        "schema": {
            "timestamp": {
                "type": "datetime",
                "required": True,
                "readonly": True,
            },
            "amount": {
                "type": "float",
                "required": True,
                "readonly": True,
            },
        }
    },
    "bought": {
        "schema": {
            "timestamp": {
                "type": "datetime",
                "required": True,
                "readonly": True,
            },
            "amount": {
                "type": "float",
                "required": True,
                "readonly": True,
            },
        }
    },
}
