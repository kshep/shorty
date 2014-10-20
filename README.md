Shorty
======

Shorty is a simple URL shortener demonstration project made up of:

* A Python Pyramid + SQLAlchemy + React UI (shorty_ui)
* A Node.js app to resolve short URLs (shorty_resolver)
* MySQL for persistent storage
* Memcached to cache the short-to-long URL map

Quickstart
------------

Prerequisites:

* Python 2.7, working in a virtualenv with `$VENV` set accordingly
* MySQL 5 installed and running, with a "shorty:shorty" user created
* Node.js 0.10
* Memcached listening on localhost 11211

In the `shorty_ui` directory:

    % $VENV/bin/python setup.py develop
    % $VENV/bin/python initialize_shorty_db development.ini
    % $VENV/bin/pserve development.ini

In the `shorty_resolver` directory:

    % npm install mysql
    % npm install node-mysql
    % node resolver.js

You'll have two webapps running:

* The web UI for adding URLs at http://localhost:6543
* The short URL resolver at http://localhost:7654

TODO
----

* <del>Build initial Pyramid app with SQLAlchemy scaffolding</del>
* <del>Build initial Node.js resolver app</del>
* <del>Initial docs</del>
* <del>Document scalability issues</del> - (see [scalability](scalability.md))
* <del>Add URL caching via memcached</del>
* Add React <del>(+ Bootstrap)</del> UI to Pyramid app
* Add basic URL [metrics][metrics.md]
* Add [user/account management][users.md]
* Expose API
