from flask import Blueprint, jsonify
from controllers.audiobook_controller import *

audiobook_bp = Blueprint('audiobook_bp', __name__)

# Explicit OPTIONS handler for the route
@audiobook_bp.route('/', methods=['OPTIONS'])
def handle_options():
    response = jsonify()
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
    response.headers.add('Access-Control-Allow-Methods', 'POST, OPTIONS')
    return response

audiobook_bp.route('/', methods=['POST'])(add_audiobook)