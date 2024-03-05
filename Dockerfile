FROM python:3.12-slim

WORKDIR /app

COPY pyproject.toml poetry.lock ./

RUN pip install poetry

COPY . .

RUN poetry install

RUN poetry run pip install .

EXPOSE 6543

CMD ["poetry", "run", "gunicorn", "--paste",  "video_game_client/development.ini", "--reload", "--access-logfile -", "--bind", "0.0.0.0:6543"]