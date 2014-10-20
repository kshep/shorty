from pyramid.config import Configurator
from sqlalchemy import engine_from_config

from .models import (
    DBSession,
    Base,
    )

import memcache

def main(global_config, **settings):
    """ This function returns a Pyramid WSGI application.
    """
    engine = engine_from_config(settings, 'sqlalchemy.')
    DBSession.configure(bind=engine)
    Base.metadata.bind = engine

    def add_cache(request):
      cache = memcache.Client(['127.0.0.1:11211'], debug=1);
      return cache

    config = Configurator(settings=settings)
    config.add_request_method(add_cache, 'cache', reify=True)
    config.include('pyramid_chameleon')
    config.add_static_view('static', 'static', cache_max_age=3600)
    config.add_route('home', '/')
    config.add_route('add', '/add')
    config.scan()
    return config.make_wsgi_app()
