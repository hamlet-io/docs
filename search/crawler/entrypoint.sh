#!/bin/bash
set -euo pipefail

export CONFIG="$(envsubst < /search/config.json | jq -r tostring)"
exec pipenv run python -m src.index
