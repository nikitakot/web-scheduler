## Description

Simple application for endpoint monitoring.

## Features and used technologies

- typescript
- nest.js
- integration and unit tests examples
- docker-compose
- postgres
- graphql
- typeorm
- jwt authentication

## Pre-requirements

- node.js (tested on v. 12.6.0)
- docker
- docker-compose

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start:local

# integration tests
$ npm run test:integration

# unit tests
$ npm run test
```

## Examples of usage

1. Lunch the app with `npm run start:local`.
2. The app will initialise existing endpoint-monitoring entities in the background, will start calling
   `GET` HTTP method for each of them in the specified interval and save the payload and the status to the database.
3. For adding a new endpoint to monitor, first create a new user:

- In the browser go to `http://localhost:3000/graphql`.
- Paste the following mutation

```graphql
mutation {
  signup(
    signUpInput: {
      email: "user@user.com"
      password: "password"
      username: "user"
    }
  ) {
    id
    jwt
  }
}
```

- Copy the JWT from the response and use it as a Bearer token in
  the next steps

4. Run the following migration to start monitoring Google every 20
   seconds

```graphql
mutation {
  createMonitoredEndpoint(
    monitoredEndpointInput: {
      name: "google"
      url: "https://google.com"
      monitoredInterval: 20
    }
  ) {
    id
    createdAt
  }
}
```

5. To get the monitoring result use this mutation

```graphql
query {
  monitoredEndpoints {
    id
    name
    checkedAt
    monitoringResult(first: 1) {
      payload
      statusCode
    }
    createdAt
  }
}
```

This mutation will only display endpoint for the currently logged
user based on JWT.

6. Check the GQL schema, there are more mutations and queries there
   to play.

## Potential improvements

### Functional

- Pagination.
- Options for search and ordering.
- Data streams.

### Technical

- Split the API and Scheduler parts for better scalability.
- Data model is pretty simple, consider NoSQL as a storage.
- Better test-coverage.
- Consider [Nest.JS code first approach for GraphQL](https://docs.nestjs.com/graphql/resolvers#code-first).
It can bring additional features like query complexity for free.

## License

Nest is [MIT licensed](LICENSE).
