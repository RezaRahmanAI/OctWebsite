const PREFIX = 'oc-zp';

type StorageValue<T> = T | undefined;

type StorageScope = 'localStorage' | 'sessionStorage';

function getStorage(scope: StorageScope): Storage | null {
  if (typeof window === 'undefined') {
    return null;
  }
  return window[scope] ?? null;
}

function readValue<T>(store: Storage | null, key: string, fallback: T): T {
  if (!store) {
    return fallback;
  }
  try {
    const raw = store.getItem(`${PREFIX}:${key}`);
    return raw ? (JSON.parse(raw) as StorageValue<T>) ?? fallback : fallback;
  } catch (error) {
    console.warn('Storage read error', error);
    return fallback;
  }
}

function writeValue<T>(store: Storage | null, key: string, value: T): void {
  if (!store) {
    return;
  }
  try {
    store.setItem(`${PREFIX}:${key}`, JSON.stringify(value));
  } catch (error) {
    console.warn('Storage write error', error);
  }
}

function deleteValue(store: Storage | null, key: string): void {
  if (!store) {
    return;
  }
  try {
    store.removeItem(`${PREFIX}:${key}`);
  } catch (error) {
    console.warn('Storage remove error', error);
  }
}

export function loadFromStorage<T>(key: string, fallback: T): T {
  return readValue(getStorage('localStorage'), key, fallback);
}

export function saveToStorage<T>(key: string, value: T): void {
  writeValue(getStorage('localStorage'), key, value);
}

export function removeFromStorage(key: string): void {
  deleteValue(getStorage('localStorage'), key);
}

export function loadFromSession<T>(key: string, fallback: T): T {
  return readValue(getStorage('sessionStorage'), key, fallback);
}

export function saveToSession<T>(key: string, value: T): void {
  writeValue(getStorage('sessionStorage'), key, value);
}

export function removeFromSession(key: string): void {
  deleteValue(getStorage('sessionStorage'), key);
}
