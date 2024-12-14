"""Provides settings classes for kotoba-api"""

from pydantic import HttpUrl

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Provides default and environment variable configuration values for kotoba-api"""

    dict_uri: HttpUrl = "http://ftp.edrdg.org/pub/Nihongo/JMdict_e.gz"
    dict_download_dir: str = "data"

    model_config = SettingsConfigDict(env_file=".env")
