from pyramid.response import Response
from pyramid.view import view_config

from sqlalchemy.exc import DBAPIError

from .models import (
    DBSession,
    ShortUrl,
    )

BASE_URL = 'http://localhost:7654' # Assume shorty_resolver is running locally on 7654
ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

def base_encode(num, alphabet=ALPHABET):

    base = len(alphabet)
    str = ""

    if num == 0:
        return alphabet[0]

    while num > 0:
        str = alphabet[num % base] + str
        num /= base

    return str

def base_decode(str, alphabet=ALPHABET):

    base = len(alphabet)
    strlen = len(str)
    num = 0

    for i, c in enumerate(str):
        n = strlen - i - 1
        num += alphabet.index(c) * (base ** n)

    return num

@view_config(route_name='add', renderer='templates/home.pt')
def add_url(request):

    longUrl = request.params['longUrl']

    shortUrl = DBSession.query(ShortUrl).filter_by(long_url=longUrl).first()

    if shortUrl is None:
        shortUrl = ShortUrl(long_url=longUrl,label=longUrl)
        DBSession.add(shortUrl)
        shortUrl = DBSession.query(ShortUrl).filter_by(long_url=longUrl).first()
        shortUrl.label = base_encode(shortUrl.id)
        request.cache.set(shortUrl.label,longUrl)

    return {'baseUrl': BASE_URL, 'longUrl': longUrl, 'shortUrl': shortUrl}

@view_config(route_name='home', renderer='templates/home.pt')
def home_view(request):
    try:
        one = DBSession.query(ShortUrl).filter(ShortUrl.id == 1).first()
    except DBAPIError:
        return Response("Can't connect to MySQL", content_type='text/plain', status_int=500)
    return {'longUrl': 'Enter URL'}
