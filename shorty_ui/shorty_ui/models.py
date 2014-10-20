from sqlalchemy import (
    Column,
    Index,
    Integer,
    Text,
    )

from sqlalchemy.ext.declarative import declarative_base

from sqlalchemy.orm import (
    scoped_session,
    sessionmaker,
    )

from zope.sqlalchemy import ZopeTransactionExtension

DBSession = scoped_session(sessionmaker(extension=ZopeTransactionExtension()))
Base = declarative_base()


class ShortUrl(Base):
    __tablename__ = 'shorturl'
    id = Column(Integer, primary_key=True)
    label = Column(Text)
    long_url = Column(Text)

Index('label_index', ShortUrl.label, unique=True, mysql_length=255)
Index('long_url_index', ShortUrl.long_url, unique=True, mysql_length=255)
