import requests
import xml.etree.ElementTree as ET

def parse_rss_feed(rss_url):
    response = requests.get(rss_url)
    if response.status_code != 200:
        print(f"Failed to fetch RSS feed from {rss_url}")
        return None

    root = ET.fromstring(response.content)
    channel = root.find("channel")

    cover_image = channel.find("itunes:image")
    cover_url = cover_image.attrib["href"] if cover_image is not None else None

    items = channel.findall("item")
    chapters = []
    for item in items:
        title = item.findtext("title")
        mp3_url = item.find("enclosure").attrib.get("url")
        duration = item.findtext("itunes:duration", default="Unknown", namespaces={"itunes": "http://www.itunes.com/dtds/podcast-1.0.dtd"})

        chapters.append({
            "title": title,
            "mp3_url": mp3_url,
            "duration": duration
        })

    return {
        "cover_url": cover_url,
        "chapters": chapters
    }
