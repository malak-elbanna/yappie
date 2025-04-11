import requests
import json
from bs4 import BeautifulSoup

LIMIT = 50  

url = f"https://librivox.org/api/feed/audiobooks?format=json&limit={LIMIT}"

response = requests.get(url)

def clean_html(text):
    return BeautifulSoup(text, "html.parser").get_text() if text else ""

if response.status_code == 200:
    data = response.json()
    books = data.get("books", [])

    audiobook_ids = []

    for book in books:
        authors = book.get("authors", [])
        if authors:
            first = authors[0].get("first_name", "")
            last = authors[0].get("last_name", "")
            author_name = f"{first} {last}".strip()
        else:
            author_name = "Unknown"
        
        cleaned_description = clean_html(book.get("description", ""))

        audiobook_ids.append({
            "id": book.get("id"),
            "title": book.get("title"),
            "description": cleaned_description,
            "author": author_name,
            "language": book.get("language"),
            "url_rss": f"https://librivox.org/rss/{book.get('id')}",
            "url_librivox": book.get("url_librivox"),
            "totaltime": book.get("totaltime")
        })

    with open("librivox_ids.json", "w", encoding="utf-8") as f:
        json.dump(audiobook_ids, f, indent=4)

    print(f"Saved {len(audiobook_ids)} audiobook entries to librivox_ids.json")
else:
    print("Failed to fetch data from LibriVox API")
