---
sidebar_label: Engine Core
title: Engine Core
---
The Engine Core is a Java-based cli client built which uses [Apache Freemarker](https://freemarker.apache.org) template language to generate outputs based on CMDB input and the freemarker templates provided by the engine.

## Configuration

Configuration of the engine core is provided through the CLI paramters. No other configuration options are available for the cli client itself.

### CLI Parameters

The follow parameters are available from the client and the executor is responsible for providing the appropriate parameters for what is being executed.

- **-g** A file path to a directory which contains the CMDB data to read and process
- **-d** A file path to directories which contain freemarker template files ( this is mostly the engine)
- **-t** The entrypoint freemarker file which starts output processing
- **-v** A key=value pair input parameter, if the value is a file path the contents of the file path will be the value
- **-r** A key=value pair input parameter
- **-l** The log level of the engine core cli
- **-o** The primary output file - this is used as a debug file

### Mandatory Parameters

To run the engine the following parameters must be provided

- `-g <CMDB root path>` Provides the client with access to the CMDB
- `-t invokeEntrance.ftl` Invokes the standard entrypoint into the hamlet engine
- `-v entrance=< the entrance to invoke>` Specifies the entrance to use for this invocation of the engine
- `-d <template path>` The path to the hamlet engine repo
