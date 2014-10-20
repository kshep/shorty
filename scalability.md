Scalability
===========

What scalability issues would we need to address if we deployed
this to production?

=== Short URL Namespace

Shorty creates short URLs by inserting the long URL into a URL table
then converting the resulting row ID from an integer to a base62 string
(using the characters [0..9a..zA..Z]). The max value of an unsigned
MySQL integer is 4,294,967,295. This converts to 4gfFC3 in base62,
meaning even with 4 billion URLs the longest short URL is only 6
characters. As we approached 4 billion URLs we'd likely want to migrate
to a new URL table with a bigint. This would let us have
2^63-1 URLs, and the longest short URL would be AzL8n0Y58m8.

If we want to guarantee that any long URL has a unique short URL, we'll
eventually want to have some way to determine whether a long URL is
already in the system other than searching the DB. It might make sense
to construt an existence check using a Bloom filter.


=== Database Performance

One of the first bottlenecks we'd be likely to hit woudl be MySQL
performance. Aside from basic sizing/tuning of the server, the
architecural decisions we could make to accomodate growth would be to...

* Add a caching layer to handle short-to-long URL mapping to reduce the
read load (see TODO list)
* Replicate to one or more read slaves and move read load off the master
DB server 
* We'd also want to look into options like Percona XtraDB Cluster or 
MySQL Cluster from Oracle for reliability/fail-over

=== UI Performance

With a ramp up in the number of users, we'd want to deploy additional
app servers running shorty_ui, likely behind haproxy or an AWS ELB

=== Resolver Performance

As with the UI app servers, we'd need to scale up the number of
geographically distributed resolver instances.

