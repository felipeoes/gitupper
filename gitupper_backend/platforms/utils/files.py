import os
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent.parent.parent


def create_dir(dirname: str, filename: str):
    path = os.path.join(BASE_DIR, dirname)
    os.makedirs(path, exist_ok=True)

    file = os.path.join(path, filename)
    return file


def write_data(file: str, data: str, dirname: str = BASE_DIR):
    filepath = create_dir(dirname, file)

    with open(filepath, 'w', encoding="utf-8") as f:
        f.write(data)
