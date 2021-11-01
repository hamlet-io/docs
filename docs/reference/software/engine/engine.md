---
sidebar_label: Engine
title: Engine
---
The Engine establishes the data models used within hamlet, its Plugins and Extensions. It is written in Apache Freemarker templating language using an extended binary from the [Engine Core](./engine_core).

## Installation

The engine does not need to be built into a binary.

It can be installed by cloning it directly from its Github repository.

```bash
git clone https://github.com/hamlet-io/engine.git
```

## Configuration

The Engine requires no additional configuration.

## Plugins

The engine is designed to be extensible and a number of plugins are available to provide cloud provider support, re-usable configuration snippets (hamlet Modules) and component extensions.

These are available in the [library](https://github.com/hamlet-io/hamlet-library).

### Module Configuration

The following Environment Variables must be set in order for the Engine to load each module.

| Variable                | Value                                                                                                       |
|-------------------------|-------------------------------------------------------------------------------------------------------------|
| GENERATION_PLUGIN_DIRS  | A semicolon delimited list of fully qualified filepaths, each to a local instance of a hamlet module |
