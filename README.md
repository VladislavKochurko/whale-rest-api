## Installation

```bash
$ npm install
```

## Attention: these environment variables need to be set

```bash
POSTGRES_DB_PASS="..."
POSTGRES_DB_USER="..."
POSTGRES_DB_NAME="whale"
POSTGRES_DB_PORT="5432"
POSTGRES_DB_HOST="postgres"
CACHE_TTL=3600

REDIS_PORT="6379"
REDIS_HOST="redis"

ELASTIC_USERNAME="..."
ELASTIC_URL="https://elasticsearch:9200"
ELASTIC_PASSWORD="..."
```

## Running the app 

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Running the app in Docker

```bash
docker-compose up
```

## Stay in touch

- Author - [Vladislav Kochurko](https://github.com/VladislavKochurko)
- Gmail - [vladislav.kochurko@gmail.com](mailto:vladislav.kochurko@gmail.com)

## License

Nest is [MIT licensed](LICENSE).
