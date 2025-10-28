const PREFIX = 'oc-zp';

type StorageValue<T> = T | undefined;

function hasStorage(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export function loadFromStorage<T>(key: string, fallback: T): T {
  if (!hasStorage()) {
    return fallback;
  }
  try {
    const raw = window.localStorage.getItem(`${PREFIX}:${key}`);
    return raw ? (JSON.parse(raw) as StorageValue<T>) ?? fallback : fallback;
  } catch (error) {
    console.warn('Storage read error', error);
    return fallback;
  }
}

export function saveToStorage<T>(key: string, value: T): void {
  if (!hasStorage()) {
    return;
  }
  try {
    window.localStorage.setItem(`${PREFIX}:${key}`, JSON.stringify(value));
  } catch (error) {
    console.warn('Storage write error', error);
  }
}

export function removeFromStorage(key: string): void {
  if (!hasStorage()) {
    return;
  }
  try {
    window.localStorage.removeItem(`${PREFIX}:${key}`);
  } catch (error) {
    console.warn('Storage remove error', error);
  }
}
