---
sidebar_label: executor
title: Hamlet Deploy Executor
---
import Admonition from 'react-admonitions';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

The Hamlet Deploy Executor handles the invocation of Hamlet Deploy actions and is currently primarily written in bash.

## Executor configuration

In order to perform the Hamlet Deploy actions, the Executor must be configured to be able to locate the other Hamlet Deploy components. This is done through Environment Variables. 

## Environment Variables

The following Environment Variables can be used to configure the Hamlet Deploy Executor.

### Mandatory Variables

These options must be set in order for Hamlet Deploy Executor to function correctly.

| Variable                	| Value                                                                                                        	|
|-------------------------	|--------------------------------------------------------------------------------------------------------------	|
| AUTOMATION_BASE_DIR     	| Full filepath to the root of the Hamlet Executor's ./automation directory                                    	|
| GENERATION_BASE_DIR     	| The fully qualified filepath to the Executor itself.                                                         	|
| GENERATION_DIR          	| Fully qualified filepath to the Executor's `./cli` directory.                                                	|
| GENERATION_ENGINE_DIR   	| A fully qualified filepath to a local copy of the Hamlet Deploy Engine Core repository.                      	|
| GENERATION_PATTERNS_DIR 	| A fully qualified filepath to a local copy of the Hamlet Deploy Patterns repository.                         	|
| GENERATION_PLUGIN_DIRS  	| A semicolon delimited list of fully qualified filepaths, each to a local instance of a Hamlet Deploy Plugin. 	|
| GENERATION_STARTUP_DIR  	| A fully qualified filepath to a local copy of the Hamlet Deploy Startup repository.                          	|


### Optional Variables

The following optional variables will further configure the Hamlet Deploy Executor.

#### AZURE_EXTENSION_DIR

| Variable            	| Value                                                               	|
|---------------------	|---------------------------------------------------------------------	|
| AZURE_EXTENSION_DIR 	| A filepath to the directory containing extensions to the Azure CLI. 	|

## Hamlet Deploy Executor Usage

The capabilities of the Executor are exposed through the [Hamlet Deploy CLI](cli).