import { openDB } from 'idb';

const DB_NAME = 'audiobook-downloads';
const STORE_NAME = 'chapters';

const dbPromise = openDB(DB_NAME, 1, {
  upgrade(db) {
    db.createObjectStore(STORE_NAME);
  },
});

export async function saveChapter(key, blob) {
  const db = await dbPromise;
  await db.put(STORE_NAME, blob, key);
}

export async function getChapter(key) {
  const db = await dbPromise;
  return db.get(STORE_NAME, key);
}

export async function isChapterDownloaded(key) {
  const db = await dbPromise;
  return (await db.get(STORE_NAME, key)) !== undefined;
}

export async function deleteChapter(key) {
  const db = await dbPromise;
  await db.delete(STORE_NAME, key);
}
