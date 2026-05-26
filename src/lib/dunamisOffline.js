import { openDB } from 'idb';

const DB_NAME = 'dunamis-offline-db';
const DB_VERSION = 1;

let db = null;

export async function getDB() {
  if (db) return db;
  db = await openDB(DB_NAME, DB_VERSION, {
    upgrade(database) {
      if (!database.objectStoreNames.contains('properties')) {
        database.createObjectStore('properties', { keyPath: 'id' });
      }
      if (!database.objectStoreNames.contains('outbox')) {
        const outbox = database.createObjectStore('outbox', { keyPath: 'id', autoIncrement: true });
        outbox.createIndex('timestamp', 'timestamp');
      }
      if (!database.objectStoreNames.contains('bookings')) {
        database.createObjectStore('bookings', { keyPath: 'id', autoIncrement: true });
      }
    },
  });
  return db;
}

export async function cacheProperties(properties) {
  const database = await getDB();
  const tx = database.transaction('properties', 'readwrite');
  await Promise.all(properties.map((p) => tx.store.put(p)));
  await tx.done;
}

export async function getCachedProperties() {
  const database = await getDB();
  return database.getAll('properties');
}

export async function addToOutbox(payload) {
  const database = await getDB();
  const id = await database.add('outbox', {
    ...payload,
    timestamp: Date.now(),
    version: payload.version || 1,
  });
  if ('serviceWorker' in navigator && 'SyncManager' in window) {
    const reg = await navigator.serviceWorker.ready;
    await reg.sync.register('dunamis-outbox-sync');
  }
  return id;
}

export async function drainOutbox(serverFn) {
  const database = await getDB();
  const entries = await database.getAllFromIndex('outbox', 'timestamp');
  const results = [];
  for (const entry of entries) {
    try {
      const result = await serverFn(entry);
      await database.delete('outbox', entry.id);
      results.push({ id: entry.id, status: 'synced', result });
    } catch (err) {
      results.push({ id: entry.id, status: 'failed', error: err.message });
    }
  }
  return results;
}

export async function saveOfflineBooking(booking) {
  return addToOutbox({ type: 'BOOKING', ...booking });
}
