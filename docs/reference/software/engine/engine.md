---
sidebar_label: Engine
title: Hamlet Deploy Engine
---
The Hamlet Deploy Engine establishes the data models used within the Hamlet Deploy application, its Plugins and Extensions. It is written in Apache Freemarker templating language using an extended binary from the [Engine Core](./engine_core).

## Installation

The Hamlet Deploy Engine does not need to be built into a binary.

It can be installed by cloning it directly from its Github repository.

```bash
git clone https://github.com/hamlet-io/engine.git
```

## Configuration

The Engine requires no additional configuration.

## Plugins

The Engine is designed to be extensible and a number of Hamlet Deploy plugins are available to provide cloud provider support, re-usable configuration snippets (Hamlet Modules) and component extensions.

These are available in the [Hamlet Deploy Library](https://github.com/hamlet-io/hamlet-library).

### Module Configuration

The following Environment Variables must be set in order for the Engine to load each module.

| Variable                | Value                                                                                                       |
|-------------------------|-------------------------------------------------------------------------------------------------------------|
| GENERATION_PLUGIN_DIRS  | A semicolon delimited list of fully qualified filepaths, each to a local instance of a Hamlet Deploy module |
