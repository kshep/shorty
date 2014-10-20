Metrics
=======

As a first pass for metrics, we could create a MySQL table that's populated from the resolver with
data from the IncomingMessage object like:

* Short URL
* Timestamp
* message.httpVersion
* message.headers['user-agent']
* message.headers['host']

Then shorty_ui could expose a /metrics/[short_url] path that would query the metrics table and
provide some basic info.

Alternatively, since we don't necessarily have a fixed schema for message header fields, we could
dump resolver data into a NoSQL store, e.g. Mongo, and tie /metrics/[short_url] to a more
sophisticated reporting module.
