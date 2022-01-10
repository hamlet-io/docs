---
sidebar_label: Engine
title: Engine
---

The engine provides the core logic and data modelling within hamlet. It is written in [Apache Freemarker](https://freemarker.apache.org/) and called by a java command line application, the [engine core](./engine_core). The engine generates file based outputs and each call to the engine should generate at least one output if it is run successfully.

## Installation

The engine does not need to be built into a binary and can be installed by cloning it directly from its Github repository.

```bash
git clone https://github.com/hamlet-io/engine.git
```

## Configuration

Each call to the engine requires a set of options provided to the engine core cli to generate the required outputs

## Plugins

The engine is designed to be extensible and a number of plugins are available to provide cloud provider support, re-usable configuration snippets and component extensions. These are available in the [library](https://github.com/hamlet-io/hamlet-library).

Plugin installation is managed through the CMDB.

### Plugin Configuration

The following Environment Variables must be set in order for the Engine to load each plugin.

| Variable                | Value                                                                                                       |
|-------------------------|-------------------------------------------------------------------------------------------------------------|
| GENERATION_PLUGIN_DIRS  | A semicolon delimited list of fully qualified filepaths, each to a local instance of a hamlet plugin        |
