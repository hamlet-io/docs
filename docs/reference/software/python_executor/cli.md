---
sidebar_label: Python Executor
title: Python Client
---

Hamlet Deploy CLI is a Python package based on [Click](ttps://click.palletsprojects.com).

The CLI acts as a wrapper around other Hamlet Deploy components and offers a single interface from which to perform Hamlet Deploy actions.

## CLI Installation

The CLI can either be built into a docker container locally, or accessed from within the Hamlet Deploy docker container.

### Local Docker build

The local build will create a local docker image called **hamlet**

```bash
# clone the repository
git clone https://github.com/hamlet-io/executor-python

# build
cd ./executor-python
make build
```

You can then follow the docker steps below using the **hamlet*

### Docker

The Hamlet Deploy docker container is published to Docker Hub. You can download and run it with the one command.

```bash
docker run -it hamletio/hamlet
```

## Hamlet Deploy CLI Usage

A list of available arguments is available at every level of the CLI with the `--help` argument.

```bash
hamlet @ ~/cmdb
└─ $ hamlet --help
Usage: hamlet [OPTIONS] COMMAND [ARGS]...
```

## Configuration

The Hamlet Deploy CLI uses the configuration from the Hamlet Deploy Executor, and does not currently require further configuration of its own.
