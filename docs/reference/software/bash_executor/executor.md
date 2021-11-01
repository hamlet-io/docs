---
sidebar_label: Bash Executor
title: Bash Executor
---
The bash executor handles the invocation of the hamlet components.

## Usage

The capabilities of the executor are exposed through the [python client](../python_executor/cli).

## Configuration

The executor must be configured to be able to locate the other components. This is done through environment variables.

### Environment Variables

The following environment variables can be used to configure the hamlet executor.

#### Mandatory

These options must be set in order for hamlet executor to function correctly.

| Variable                | Value                                                                                                        |
|-------------------------|--------------------------------------------------------------------------------------------------------------|
| AUTOMATION_BASE_DIR     | Full filepath to the root of the hamlet executor's ./automation directory                                    |
| GENERATION_BASE_DIR     | The fully qualified filepath to the executor itself.                                                         |
| GENERATION_DIR          | Fully qualified filepath to the executor's `./cli` directory.                                                |
| GENERATION_ENGINE_DIR   | A fully qualified filepath to a local copy of the hamlet engine core repository.                             |
| GENERATION_PLUGIN_DIRS  | A semicolon delimited list of fully qualified filepaths, each to a local instance of a hamlet plugin.        |

#### Optional

The following optional variables will further configure the hamlet executor.

| Variable            | Value                                                               |
|---------------------|---------------------------------------------------------------------|
| AZURE_EXTENSION_DIR | A filepath to the directory containing extensions to the Azure CLI. |
