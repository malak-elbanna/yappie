# Yappie CMS service

This content management system service is a part of the project that handles the CRUD operations for managing content.

## Main Features
- Using MongoDB Atlas for storing the content information.
- Add, retrieve, update, and delete contents.
- Store files (audio files and cover images) in the database using library GridFS
- Support for multiple content categories and formats.

## Dependencies
```bash
flask
flask-pymongo
python-dotenv
Flask-Cors
flask_marshmallow
```
## Installation
```bash
git clone https://github.com/malak-elbanna/yappie/content-management-trial
```
```bash
cd src/backend/content-management-service
```
## Set up MongoDB 
Create a ```.env``` file to store the ```MONGO_URI```. You can load the audiobooks from folder ```audiobooks```.

## Run the Application
```bash
python app.py
```

## API endpoints
1. Add new content (POST ```api/content```)
2. Retrieve all content (GET ```api/content```)
3. Retrieve content by id (GET ```api/content/{content_id}```)
4. Update content (PUT ```api/content/{content_id}```)
5. Delete content (DELETE ```api/content/{content_id}```)

