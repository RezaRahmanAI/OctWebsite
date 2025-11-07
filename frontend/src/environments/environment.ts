type DataProviderKey = 'in-memory';

interface EnvironmentConfig {
  readonly apiUrl: string;
  readonly dataProvider: DataProviderKey;
}

export const environment: EnvironmentConfig = {
  apiUrl: 'http://localhost:5191',
  dataProvider: 'in-memory'
};
