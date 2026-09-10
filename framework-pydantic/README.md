# Pydantic OpenAPI sample project

This sample is a train travel API that shows how Pydantic models become OpenAPI schemas and SDK-ready data models.

## Features

- `GET /stations` and `GET /trips` examples
- `POST /bookings` for a train-travel booking flow
- Generated OpenAPI schema at `openapi.yaml`

## Quick start

This example targets Pydantic 2.13.4.

```bash
cd examples/framework-pydantic
python -m venv .venv
source .venv/bin/activate
pip install -e .
python main.py
```

Then open http://localhost:8000/openapi.json.

## Generate the OpenAPI document

```bash
python generate_openapi.py
```

This writes both `openapi.json` and `openapi.yaml`.

## Preview the OpenAPI document

Generate and preview the latest OpenAPI document with the Scalar CLI:

```bash
python generate_openapi.py
npx @scalar/cli document serve openapi.yaml
```
