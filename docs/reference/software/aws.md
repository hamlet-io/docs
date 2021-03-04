---
sidebar_label: aws plugin
title: AWS Provider Plugin
---
import Admonition from 'react-admonitions';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

The AWS Provider Plugin contains aws-specific seed data as well as the implementation routines specific to the provider. The Provider Plugin builds upon the data models established within the [Hamlet Deploy Engine](./engine) and are written in Apache Freemarker.

## Installation

The plugin can be installed by cloning the repository from Github and updating the configuration below.

```bash
git clone https://github.com/hamlet-io/engine-plugin-aws.git
```

## Configuration

The following Environment Variables can be set to configure the AWS Plugin.


| Variable                	| Value                                                                                                        	|
|-------------------------	|--------------------------------------------------------------------------------------------------------------	|
| GENERATION_PLUGIN_DIRS  	| A semicolon delimited list of fully qualified filepaths, each to a local instance of a Hamlet Deploy Plugin. 	|