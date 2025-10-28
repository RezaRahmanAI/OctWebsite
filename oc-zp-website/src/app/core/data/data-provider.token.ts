import { InjectionToken, Provider } from '@angular/core';
import { environment } from '../../../environments/environment';
import { DataProvider } from './data-provider';
import { InMemoryProvider } from './in-memory.provider';

export const DATA_PROVIDER = new InjectionToken<DataProvider>('DATA_PROVIDER');

export function provideDataProvider(): Provider {
  return {
    provide: DATA_PROVIDER,
    deps: [InMemoryProvider],
    useFactory: (inMemory: InMemoryProvider) => {
      switch (environment.dataProvider) {
        case 'in-memory':
        default:
          return inMemory;
      }
    },
  };
}
