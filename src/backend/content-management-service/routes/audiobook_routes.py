from flask import Blueprint
from controllers.audiobook_controller import *

audiobook_bp = Blueprint('audiobook_bp', __name__)

audiobook_bp.route('/', methods=['POST'])(add_audiobook)
# audiobook_bp.route('/<id>', methods=['PUT'])(update_audiobook)