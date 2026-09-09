import json
from pathlib import Path

import yaml

from main import app

openapi_schema = app.openapi()

Path("openapi.json").write_text(json.dumps(openapi_schema, indent=2))
Path("openapi.yaml").write_text(yaml.safe_dump(openapi_schema, sort_keys=False))
print("Generated openapi.json and openapi.yaml")
