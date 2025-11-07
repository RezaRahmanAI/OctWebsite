type DataProviderKey = 'in-memory';

interface EnvironmentConfig {
  readonly apiUrl: string;
}

export const environment: EnvironmentConfig = {
  apiUrl: 'http://localhost:5191',
};
