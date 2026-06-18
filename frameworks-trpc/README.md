<div align="center">
 <a href="https://www.speakeasy.com/" target="_blank">
  <img width="1500" height="500" alt="Speakeasy" src="https://github.com/user-attachments/assets/0e56055b-02a3-4476-9130-4be299e5a39c" />
 </a>
 <br />
 <br />
  <div>
   <a href="https://speakeasy.com/docs/create-client-sdks/" target="_blank"><b>Docs Quickstart</b></a>&nbsp;&nbsp;//&nbsp;&nbsp;<a href="https://go.speakeasy.com/slack" target="_blank"><b>Join us on Slack</b></a>
  </div>
 <br />

</div>


<h2>Speakeasy tRPC OpenAPI Example</h2>

This example tRPC app demonstrates Speakeasy-recommended practices for generating clear OpenAPI specifications and SDKs, using a Train Travel API as the domain.

The API covers finding train stations, searching for trips, managing bookings, and processing payments.

## Prerequisites

You need to have [Node.js](https://nodejs.org/) installed on your system to run this project.

To generate an SDK, you'll also need the Speakeasy CLI installed, or use the Speakeasy dashboard.

## Dependencies

```json
{
  "dependencies": {
    "@trpc/client": "^10.40.0",
    "@trpc/server": "^10.40.0",
    "express": "^4.18.2",
    "trpc-openapi": "^1.2.0",
    "zod": "^3.22.4"
  },
  "devDependencies": {
    "@types/express": "^4.17.18",
    "ts-node": "^10.9.1",
    "typescript": "^5.2.2"
  }
}
```

## Installation

To install the application on your local machine:

1. Clone the repository:
```bash
git clone https://github.com/speakeasy-api/examples.git
```

2. Navigate into the directory:
```bash
cd examples/frameworks-trpc
```

3. Install all dependencies:
```bash
npm install
```

4. [Install Speakeasy CLI](https://github.com/speakeasy-api/speakeasy#installation):
```bash
brew install speakeasy-api/homebrew-tap/speakeasy
```

## Running the application

Start the server:

```bash
npx ts-node index.ts
```

The API will be available at `http://localhost:3000`.

### Working with the OpenAPI specification

To generate an OpenAPI spec in JSON format, run:

```bash
npm run generate-openapi
```

Additionally, you can generate both the specification file and a TypeScript SDK for your API using:

```bash
npm run generate-openapi-and-sdk
```

## License

This project is licensed under the terms of the Apache 2.0 license.

### Working with the OpenAPI specification

To generate an OpenAPI spec in YAML format, run:

```bash
npm run generate-openapi
```

Additionally, you can generate both the specification file and a TypeScript SDK for your API using:

```bash
npm run generate-openapi-and-sdk
```

## License

This project is licensed under the terms of the Apache 2.0 license.
