from services.db import mongo
from flask_marshmallow import Marshmallow
from marshmallow import fields

ma = Marshmallow()

class AudiobookSchema(ma.Schema):
    class Meta:
        fields = (
            "_id", 
            "title", 
            "description", 
            "author", 
            "language", 
            "url_rss", 
            "url_librivox", 
            "totaltime", 
            "cover_url",
            "chapters",
            "category"
        )
    _id = fields.Str(dump_only=True)

class Audiobook:
    def __init__(self, title, description, author, language, url_rss, url_librivox, totaltime, cover_url, chapters, category):
        self.title = title
        self.description = description
        self.author = author
        self.language = language
        self.url_rss = url_rss
        self.url_librivox = url_librivox
        self.totaltime = totaltime
        self.cover_url = cover_url
        self.chapters = chapters
        self.category = category
