import os


class DevelopmentConfig(object):
    DEBUG = True
    PORT = 5000


class ProductionConfig(object):
    DEBUG = False
    HOST = "0.0.0.0"
    PORT = os.environ.get("PORT", 80)


def load_config():
    if os.environ.get("MODE") == "production":
        return ProductionConfig
    else:
        return DevelopmentConfig
