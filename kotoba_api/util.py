"""Provides various utility methods utilized by kotoba-api"""

import os
from pathlib import Path

from pydantic import HttpUrl
import requests


def download_file(url: HttpUrl, destination_dir: str):
    """Handler for downloading large files over HTTP"""
    file_basename = str(url).rsplit("/", maxsplit=1)[-1]
    destination_filename = os.path.join(destination_dir, file_basename)

    # Ensure destination download directory exists
    Path(destination_dir).mkdir(parents=True, exist_ok=True)

    # Stream remote file to destination path
    with requests.get(url, stream=True, timeout=10) as response:
        response.raise_for_status()

        with open(destination_filename, "wb") as file_buffer:
            for chunk in response.iter_content(chunk_size=8192):
                file_buffer.write(chunk)

    return destination_filename
