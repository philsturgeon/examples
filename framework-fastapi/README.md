# Train Travel API: a FastAPI example

This example demonstrates Speakeasy's recommended practices for generating a clear OpenAPI document from FastAPI. The API finds train stations, searches trips, and creates bookings and payments.

## Install FastAPI

To install and run this example, you'll need a Python virtualenv with FastAPI installed.

1. Activate your Python virtualenv.
2. Install FastAPI. Run the following in the terminal:

  ## Install dependencies

  Create and activate a Python virtual environment, then install FastAPI and the Scalar integration:

  ```bash
  pip install "fastapi[all]" scalar-fastapi pyyaml
  ```

## Run FastAPI server

1. In the `app` directory, run:

  ## Run FastAPI

  From the `app` directory, start the development server:

  ```bash
  uvicorn main:app --reload
  ```

2. Open this link in your browser: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs) to view the default Swagger UI API documentation for the API.

### Scalar API documentation

This example uses the [Scalar FastAPI plugin](https://github.com/scalar/scalar/blob/main/integrations/fastapi/README.md), to add [Scalar](https://scalar.com/), which is a modern, open-source API documentation platform.

Install the Scalar FastAPI plugin:

  ```bash
  pip install scalar-fastapi
  ```

You can access the Scalar API docs at [http://127.0.0.1:8000/scalar](http://127.0.0.1:8000/scalar).

## Install Speakeasy

To save OpenAPI output to a file and regenerate the SDK with Speakeasy, first install Speakeasy by following the [Speakeasy Getting Started](https://speakeasyapi.dev/docs/product-reference/speakeasy-cli/getting-started/) guide.

On macOS, you can install Speakeasy using Homebrew.

In your terminal, run:

```bash
brew install speakeasy-api/homebrew-tap/speakeasy
```

## Regenerate the `openapi.yaml`, `openapi.json` and the client SDK

In the project's directory, run:

Open [http://127.0.0.1:8000/scalar](http://127.0.0.1:8000/scalar) for the Scalar API reference or [http://127.0.0.1:8000/openapi.json](http://127.0.0.1:8000/openapi.json) for the generated document.

## Regenerate the OpenAPI document and SDK

Install the [Speakeasy CLI](https://www.speakeasy.com/docs/speakeasy-cli/getting-started), then run this from the project directory:

```bash
./gen.sh
```

This updates `openapi.json`, `openapi.yaml`, and the generated Python SDK.
