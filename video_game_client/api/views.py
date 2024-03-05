import logging
import os
from dataclasses import dataclass, asdict

import requests
from pyramid.view import view_config
from pyramid.response import Response


FIRESTORE_HOST = os.environ.get('FIRESTORE_HOST', 'localhost:8080')
FIRESTORE_PROJECT_ID = os.environ.get('FIRESTORE_PROJECT_ID')
FIRESTORE_BASE_URL = f"http://{FIRESTORE_HOST}/v1/projects/{FIRESTORE_PROJECT_ID}/databases/(default)/documents"


@dataclass
class VideoGame:
    name: str  # firestore identifier
    upc: str
    title: str
    genre: str
    platform: str
    release_year: int
    developer: str
    publisher: str
    description: str
    metacritic_rating: int

    python_to_firestore_map = {
        str: lambda v: {"stringValue": v},
        int: lambda v: {"integerValue": v},
        float: lambda v: {"doubleValue": v},
    }

    firestore_to_python_map = {
        "stringValue": lambda v: str(v),
        "integerValue": lambda v: int(v),
        "floatValue": lambda v: float(v),
    }

    def __init__(self, data):
        self.__dict__.update(data)

    def __json__(self, request):
        return asdict(self)

    @classmethod
    def from_firestore_json(cls, json_data):
        data = {"name": json_data["name"]}
        data

        for k, v in json_data['fields'].items():
            firestore_datatype = tuple(v.keys())[0]
            str_value = v[firestore_datatype]
            data[k] = cls.firestore_to_python_map[firestore_datatype](str_value)

        return cls(data)

    def python_to_firestore(self, value):
        return self.python_to_firestore_map[type(value)](value)

    def as_firestore_document(self):
        return {"fields": {k: self.python_to_firestore(v) for k, v in asdict(self).items()}}


@view_config(route_name='video_games', renderer='json')
class VideoGamesView:
    COLLECTION_ID = "video_games"
    URL = f"{FIRESTORE_BASE_URL}/{COLLECTION_ID}"

    def __init__(self, request):
        self.request = request

    def __call__(self):
        if self.request.method == 'GET':
            return self.get()

        elif self.request.method == 'POST':
            return self.post()

        else:
            return Response(status='405')

    def get(self):
        response = requests.get(self.URL)

        if response.status_code == 200:
            documents = response.json().get('documents', [])
            video_games = [VideoGame.from_firestore_json(document) for document in documents]
            logging.debug(documents)
            logging.debug(video_games)

            return video_games
        else:
            return Response(json_body={'error': response.text}, status=f"{response.status_code}")

    def post(self):
        try:
            game_data = VideoGame(self.request.json_body).as_firestore_document()
        except ValueError as e:
            return Response(json_body={'error': 'Invalid JSON data'}, status='400')

        response = requests.post(self.URL, json=game_data)

        if response.status_code in (200, 201):
            return Response(json_body={'message': 'Game created successfully'}, status='201')
        else:
            return Response(json_body={'error': response.text}, status=f"{response.status_code}")
