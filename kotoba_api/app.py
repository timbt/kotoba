from fastapi import FastAPI

from .config import Settings
from .util import download_file


app_config = Settings()

download_file(app_config.dict_uri, "./data")

app = FastAPI()


@app.get("/")
def read_root():
    return "Hello, world!"
