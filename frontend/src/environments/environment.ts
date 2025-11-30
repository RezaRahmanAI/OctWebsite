interface EnvironmentConfig {
  readonly apiUrl: string;
}

const runtimeApiUrl = (globalThis as { __env?: { apiUrl?: string } }).__env?.apiUrl;
const currentOrigin = globalThis.location?.origin;
const isLocalDev = currentOrigin?.includes('localhost:4200');
const sameOriginApiUrl = isLocalDev ? undefined : currentOrigin;
const developmentApiUrl = isLocalDev ? '' : undefined;

export const environment: EnvironmentConfig = {
  apiUrl:
    runtimeApiUrl?.replace(/\/+$/, '') ??
    sameOriginApiUrl?.replace(/\/+$/, '') ??
    developmentApiUrl ??
    'https://ceshop.octimsbd.com',
};
