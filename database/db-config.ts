const env = process.env.NODE_ENV;
const config = {
  development: {
    type: 'postgres',
    host: 'localhost',
    port: '5432',
    username: 'postgres',
    password: 'postgres',
    database: 'postgres',
    entities: ['**/*.entity{.ts,.js}'],
    migrations: ['database/migration/*.ts'],
    cli: {
      migrationsDir: 'database/migration',
    },
  },
  integration: {
    type: 'postgres',
    host: 'localhost',
    port: '5432',
    username: 'postgres',
    password: 'postgres',
    database: 'postgres',
    entities: ['**/*.entity{.ts,.js}'],
    migrations: ['database/migration/*.ts'],
    cli: {
      migrationsDir: 'database/migration',
    },
  },
};

module.exports = config[env];
