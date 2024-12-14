import os
from pathlib import Path

from fastapi import FastAPI
from pydantic import HttpUrl
import requests

from .config import Settings


def download_file(url: HttpUrl, destination_dir: str):
    """Handler for downloading large files over HTTP"""
    file_basename = str(url).split("/")[-1]
    destination_filename = os.path.join(destination_dir, file_basename)

    # Ensure destination download directory exists
    Path(destination_dir).mkdir(parents=True, exist_ok=True)

    # Stream remote file to destination path
    with requests.get(url, stream=True) as response:
        response.raise_for_status()

        with open(destination_filename, "wb") as file_buffer:
            for chunk in response.iter_content(chunk_size=8192):
                file_buffer.write(chunk)

    return destination_filename


app_config = Settings()

download_file(app_config.dict_uri, "./data")

app = FastAPI()


@app.get("/")
def read_root():
    return "Hello, world!"
