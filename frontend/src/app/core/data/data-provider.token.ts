import { InjectionToken, Provider } from '@angular/core';
import { DataProvider } from './data-provider';
import { SignalStoreProvider } from './signal-store.provider';

export const DATA_PROVIDER = new InjectionToken<DataProvider>('DATA_PROVIDER');

export function provideDataProvider(): Provider {
  return {
    provide: DATA_PROVIDER,
    deps: [SignalStoreProvider],
    useFactory: (provider: SignalStoreProvider) => provider,
  };
}
