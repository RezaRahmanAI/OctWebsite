interface EnvironmentConfig {
  readonly apiUrl: string;
}

const runtimeApiUrl = (globalThis as { __env?: { apiUrl?: string } }).__env?.apiUrl;
const sameOriginApiUrl =
  globalThis.location && globalThis.location.origin.includes('localhost:4200')
    ? undefined
    : globalThis.location?.origin;

export const environment: EnvironmentConfig = {
  apiUrl:
    runtimeApiUrl?.replace(/\/+$/, '') ??
    sameOriginApiUrl?.replace(/\/+$/, '') ??
    'https://ceshop.octimsbd.com',
};
