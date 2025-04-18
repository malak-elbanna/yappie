from flask import Blueprint
from app.controller import profile_controller

profile_bp = Blueprint('profile', __name__)

profile_bp.route('/<int:user_id>', methods=['GET'])(profile_controller.get_info)
profile_bp.route('/<int:user_id>/edit-name', methods=['PUT'])(profile_controller.edit_name)
profile_bp.route('/<int:user_id>/edit-bio', methods=['PUT'])(profile_controller.edit_bio)
profile_bp.route('/<int:user_id>/remove-book', methods=['PUT'])(profile_controller.remove_favorite_book)
profile_bp.route('/<int:user_id>/remove-podcast', methods=['PUT'])(profile_controller.remove_favorite_podcast)
profile_bp.route('/<int:user_id>/add-preference', methods=['PUT'])(profile_controller.add_preference)
profile_bp.route('/<int:user_id>/remove-preference', methods=['PUT'])(profile_controller.remove_preference)