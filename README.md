# WAYF Admin
## Introduction
An administrative user interface for the WAYF project. Provides users ability to view and manage data stored for their device. 

## Solution Overview
### React and Relay
[React](https://facebook.github.io/react/) tooling provides encapsulated display components. Coupled with [Relay](https://facebook.github.io/relay/) modern, responsible for managing each component's data needs, allows for a modular front-end.

### GraphQL
The [wayf-cloud](https://github.com/Atypon-OpenSource/wayf-cloud) is wrapped with a custom [GraphQL](http://graphql.org/) schema. This provides a layer of abstraction from the core API and integrates well with the React/Relay front-end.

### Node and Express
The [Express](https://expressjs.com/) framework for [node](https://nodejs.org/en/) is leveraged to provide a lightweight but flexible server for handling client requests. Static resources can be served and data requests can be marshalled to the GraphQL server.
the application where to load the wayf environment configuration from. If no value is specified, the application will attempt to load it from the classpath

## Building and Running WAYF Cloud
### Service Dependencies
1. Node Package Manager (Version 5.3.0+)
2. Node (Version 4.4+)
3. [Watchman](https://facebook.github.io/watchman/docs/install.html)

### Build and Deploy Instructions
1. Checkout the desired branch from Github.
2. Open a command line prompt located in the top-level project directory where "package.json" is located
3. Execute the command `npm install`. This will download and install all of the required node modules.
4. Ensure all of the GraphQL schemas are built and up to date `babel-node tools/updateSchema.js`
5. Run the relay compiler and load the newly generated schema file with `npm run relay-compiler --src src --schema src/data/schema.graphql`
6. Start the server with `babel-node src/server`
7. You may now verify that it started successfully by visiting localhost:3000. If the express port was overriden in the configuration, use that port.


