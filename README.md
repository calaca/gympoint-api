<h1 align="center">
  <img alt="Gympoint" title="Gympoint" src=".github/logo.png" width="200px" />
</h1>

<h3 align="center">
  Gym manager app RESTful API
</h3>

<p align="center">
  <img alt="GoStack" src="https://img.shields.io/badge/GoStack-9.0-%2304D361">

  <img alt="License" src="https://img.shields.io/badge/license-MIT-%2304D361">
</p>

## Getting Started

### Prerequisites

You'll need [Node](https://nodejs.org), NPM (comes with Node) or [Yarn](https://yarnpkg.com).

### Installing

Install dependencies with:

```
npm install
```
or
```
yarn install
```

### Running

Scripts used to run the app:

- `yarn dev`: development mode with server auto-reload on code changes
- `yarn dev:debug`: development on debug mode with server auto-reload on code changes
- `yarn queue`: queue thread that processes jobs
- `yarn queue:debug`: queue thread on debug mode

**PS:** you should always keep both `yarn dev` and `yarn queue` if you want the API and queue jobs to run.

## Debugging

### VS Code
1. Run `yarn dev:debug` or `yarn queue:debug` (depends on which piece of code you want to debug);
2. Go to VS Code's debug tab (`shift + command + d`);
3. Set your breakpoints throughout the code;
4. Click "launch program";
5. That's it!

## Running the tests

Explain how to run the automated tests for this system

## Deployment

Add additional notes about how to deploy this on a live system

## Built With

* [Node](https://nodejs.org/) - JavaScript runtime built on Chrome's V8 JavaScript engine
* [Express](https://expressjs.com/) - Fast, unopinionated, minimalist web framework for Node.js
* [Sequelize](https://sequelize.org) - promise-based Node.js ORM for Postgres, MySQL, MariaDB, SQLite and Microsoft SQL Server
* [JWT](https://jwt.io/) - open, industry standard RFC 7519 method for representing claims securely between two parties
* [Redis](https://redis.io/) - open source (BSD licensed), in-memory data structure store, used as a database, cache and message broker
* [Postgres](https://www.postgresql.org/) - open source object-relational database system
* [Docker](https://www.docker.com/) - tool designed to make it easier to create, deploy, and run applications by using containers
* [Docker Compose](https://docs.docker.com/compose/) - tool for defining and running multi-container Docker applications
* [Bee-Queue](https://bee-queue.com/) - Redis-backed job queue for Node.js

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
