module.exports = {
  development: {
    client: 'pg',
    connection:'postgres://localhost/timeline_analyzer_api',
    migrations: {
      directory: './db/migrations',
    },
    seeds: {
      directory: './db/seeds',
    },
    useNullAsDefault: true,
  },

  test: {
    client: 'pg',
    connection:'postgres://localhost/timeline_analyzer_api_test',
    migrations: {
      directory: './db/migrations',
    },
    seeds: {
      directory: './db/seeds',
    },
    useNullAsDefault: true,
  },

  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: './db/migrations',
    },
    seeds: {
      directory: './db/seeds',
    },
    useNullAsDefault: true,
  },
}
