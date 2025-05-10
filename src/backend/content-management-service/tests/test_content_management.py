import unittest
import pytest
from unittest.mock import patch, MagicMock
from bson import ObjectId
from controllers.audiobook_controller import (
    get_audiobooks,
    get_audiobook,
    add_audiobook,
    update_audiobook,
    delete_audiobook,
    update_chapter
)
import pytest

class TestContentManagementController(unittest.TestCase):

    @pytest.fixture(autouse=True)
    def setup_app(self, app, mock_render_template):
        self.app = app
        self.client = self.app.test_client()
        self.app_context = self.app.app_context()
        self.app_context.push()
        self.mock_render_template = mock_render_template
        
        self.url_for_patcher = patch('flask.url_for', return_value='/fake_url')
        self.mock_url_for = self.url_for_patcher.start()

    def tearDown(self):
        if hasattr(self, 'url_for_patcher'):
            self.url_for_patcher.stop()
        self.app_context.pop()

    @patch('controllers.audiobook_controller.get_collection')
    @pytest.mark.xfail(reason="URL endpoint 'audiobo' is incomplete or not registered")

    def test_get_audiobooks(self, mock_get_collection):
        test_books = [{'_id': ObjectId(), 'title': 'Test Book'}]
        mock_get_collection.return_value.find.return_value = test_books
        
        with patch('flask.url_for', return_value='/fake_url'):
            with self.app.test_request_context('/audiobooks'):
                response = get_audiobooks()
                
                self.assertEqual(response, 'mocked_template')
                
                self.mock_render_template.assert_called_once()
                args, kwargs = self.mock_render_template.call_args
                self.assertEqual(args[0], 'home.html')
                self.assertEqual(list(kwargs['result']), test_books)
                pass
    @patch('controllers.audiobook_controller.get_collection')
    def test_get_audiobook_valid_id(self, mock_get_collection):
        test_id = ObjectId()
        mock_get_collection.return_value.find_one.return_value = {'_id': test_id, 'title': 'Test Book'}
        with self.app.test_request_context(f'/audiobooks/{test_id}'):
            response, status = get_audiobook(str(test_id))
            self.assertEqual(status, 200)

    @patch('controllers.audiobook_controller.get_collection')
    def test_get_audiobook_invalid_id(self, mock_get_collection):
        mock_get_collection.return_value = {'books': MagicMock()}
        with self.app.test_request_context('/audiobooks/invalid-id'):
            response, status = get_audiobook("invalid-id")
            self.assertEqual(status, 400)

    @patch('controllers.audiobook_controller.mongo')
    @patch('controllers.audiobook_controller.MinioUpload')
    @patch('controllers.audiobook_controller.hls_export_upload')
    @patch('controllers.audiobook_controller.GridFS')
    def test_add_audiobook(self, mock_fs, mock_hls, mock_minio, mock_mongo):
        db_mock = MagicMock()
        db_mock.books.count_documents.return_value = 0
        db_mock.books.insert_one.return_value.inserted_id = ObjectId()
        mock_mongo.cx.__getitem__.return_value = db_mock

        mock_fs.return_value = MagicMock()

        with self.app.test_request_context('/audiobooks', method='POST', data={'title': 'Book'}, content_type='multipart/form-data'):
            response, status = add_audiobook()
            self.assertEqual(status, 201)

    @patch('controllers.audiobook_controller.mongo')
    @patch('controllers.audiobook_controller.GridFS')
    def test_update_audiobook(self, mock_fs, mock_mongo):
        mock_fs.return_value.put.return_value = "mock_id"
        db_mock = MagicMock()
        mock_mongo.cx.__getitem__.return_value = db_mock

        with self.app.test_request_context('/audiobooks', method='POST', data={'title': 'Book'}, content_type='multipart/form-data'):
            response, status = update_audiobook(str(ObjectId()))
            self.assertEqual(status, 200)

    @patch('controllers.audiobook_controller.get_collection')
    def test_delete_audiobook_found(self, mock_get_collection):
        mock_get_collection.return_value.delete_one.return_value.deleted_count = 1
        with self.app.test_request_context('/audiobooks', method='DELETE'):
            response, status = delete_audiobook(str(ObjectId()))
            self.assertEqual(status, 200)

    @patch('controllers.audiobook_controller.get_collection')
    def test_delete_audiobook_not_found(self, mock_get_collection):
        mock_get_collection.return_value.delete_one.return_value.deleted_count = 0
        with self.app.test_request_context('/audiobooks', method='DELETE'):
            response, status = delete_audiobook(str(ObjectId()))
            self.assertEqual(status, 404)

    @patch('controllers.audiobook_controller.get_collection')
    def test_update_chapter_success(self, mock_get_collection):
        mock_get_collection.return_value.update_one.return_value.modified_count = 1
        obj_id = str(ObjectId())
        with self.app.test_request_context(f'/audiobooks/{obj_id}/chapters', method='POST', json={'chapterIndex': 0, 'title': 'New Title'}):
            response, status = update_chapter(obj_id)
            self.assertEqual(status, 200)

    @patch('controllers.audiobook_controller.get_collection')
    def test_update_chapter_failure(self, mock_get_collection):
        mock_get_collection.return_value.update_one.return_value.modified_count = 0
        obj_id = str(ObjectId())
        with self.app.test_request_context(f'/audiobooks/{obj_id}/chapters', method='POST', json={'chapterIndex': 0, 'title': 'New Title'}):
            response, status = update_chapter(obj_id)
            self.assertEqual(status, 400)

if __name__ == '__main__':
    unittest.main()