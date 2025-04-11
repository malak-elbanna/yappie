import json
from parse_rss import parse_rss_feed

with open("librivox_ids.json", "r", encoding="utf-8") as f:
    books = json.load(f)

for book in books:
    print(f"Fetching details for: {book['title']}")
    book_details = parse_rss_feed(book["url_rss"])
    if book_details:
        book["cover_url"] = book_details["cover_url"]
        book["chapters"] = book_details["chapters"]

with open("librivox_with_chapters.json", "w", encoding="utf-8") as f:
    json.dump(books, f, indent=2, ensure_ascii=False)
