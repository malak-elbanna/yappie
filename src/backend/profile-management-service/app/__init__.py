from flask import Flask
from .models.profile import db
from .config import SQLALCHEMY_DATABASE_URI
from flask_migrate import Migrate
from flask_cors import CORS
from .routes.profile_routes import profile_bp
from prometheus_client import make_wsgi_app
from werkzeug.middleware.dispatcher import DispatcherMiddleware


def create_app():
    app = Flask(__name__)
    CORS(app)

    app.config['SQLALCHEMY_DATABASE_URI'] = SQLALCHEMY_DATABASE_URI

    db.init_app(app)
    migrate = Migrate(app, db)

    app.register_blueprint(profile_bp)

    app.wsgi_app = DispatcherMiddleware(app.wsgi_app, {
        '/metrics': make_wsgi_app()
    })

    return app