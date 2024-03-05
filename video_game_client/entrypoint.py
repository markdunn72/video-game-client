import logging

from pyramid.config import Configurator
from pyramid.view import view_config

from video_game_client.api.views import VideoGamesView


log = logging.getLogger(__name__)

@view_config(renderer="templates/index.jinja2")
def index(request):
    return {}


def main(global_config, **settings):
    with Configurator(settings=settings) as config:
        # Index
        config.include('pyramid_jinja2')
        config.add_route('index', '/')
        config.add_view(index, route_name='index', renderer='templates/index.jinja2')
        config.add_static_view('static', 'static')

        # API
        config.add_route('video_games', '/video_games')
        config.add_view(VideoGamesView, route_name='video_games', renderer='json')

        logging.basicConfig(level=logging.DEBUG)
        return config.make_wsgi_app()


app = main({})
