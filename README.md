[![Actions Status](https://github.com/Codibre/nodejs-grpc-mutex-client/workflows/build/badge.svg)](https://github.com/Codibre/nodejs-grpc-mutex-client/actions)
[![Actions Status](https://github.com/Codibre/nodejs-grpc-mutex-client/workflows/test/badge.svg)](https://github.com/Codibre/nodejs-grpc-mutex-client/actions)
[![Actions Status](https://github.com/Codibre/nodejs-grpc-mutex-client/workflows/lint/badge.svg)](https://github.com/Codibre/nodejs-grpc-mutex-client/actions)
[![Test Coverage](https://api.codeclimate.com/v1/badges/b5dfc3b4a37b4d23f5c1/test_coverage)](https://codeclimate.com/github/Codibre/nodejs-grpc-mutex-client/test_coverage)
[![Maintainability](https://api.codeclimate.com/v1/badges/b5dfc3b4a37b4d23f5c1/maintainability)](https://codeclimate.com/github/Codibre/nodejs-grpc-mutex-client/maintainability)
[![npm version](https://badge.fury.io/js/grpc-mutex-client.svg)](https://badge.fury.io/js/grpc-mutex-client)

Client library for nodejs-grpc-mutex-api

## How to Install

```
npm i grpc-mutex-client
```

## How to use

First, you need to have a single instance (with no horizontal scaling) of [grpc-mutex-api](https://hub.docker.com/repository/docker/codibre/nodejs-grpc-mutex-api/general) running. Then, obtain an instance of Mutex:

```ts
const client = new MutexApiClient('example.com');
```

Then, just acquire and release an id as you need:

```ts
const release = await client.acquire({ id: 'my-mutex-id' });

// Here you do your stuff

await release();
```

Be aware that the acquire may fail. There is a default 15000 ms timeout to try to acquire a mutex, with 1 attempt. Also, an acquired mutex lasts, by default, for 5 minutes. Which you can also change, like this:


```ts
const release = await client.acquire({
  id: 'my-mutex-id',
  waitTimeout: 30000, // will wait 30 seconds at each attempt of acquiring the mutex,
  attempts: 5 // will attempt up to 5 times to acquire the mutex,
  mutexTimeout: 60*60*1000 // the mutex will last for an hour if not released
});

// Here you do your stuff

await release();
```

## License

Licensed under [MIT](https://en.wikipedia.org/wiki/MIT_License).
