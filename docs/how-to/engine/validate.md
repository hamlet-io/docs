---
sidebar_label: Validating Configuration
title: Validating the Blueprint
---
Regularly validating that your Blueprint contains only valid configuration is not only good practice, it will help you catch mis-configurations early.

In this short guide we'll take a look over how you can make the most of Blueprint validation.

## Requirements

The following sections assume you are working inside the development workspace and have a District configured already.

## What Gets Validated?

The validation process will construct the District's Blueprint and compare it against the [Blueprint Reference](https://docs.hamlet.io/reference). The process will alert you if any of the following issues are present:

- missing mandatory configuration;
- unexpected data types;
- values that do not match those available (where applicable)
- unexpected attributes have been found;

## Running Validation

Validation is performed as an Engine Entrance. It does not require any additional arguments.

```bash
hamlet entrance invoke-entrance -e validate
```

That's all there is to it!

Regular validation will help you catch issues early and ensure that hamlet is working the way you intend it to.

:::note
You can always compare invalid configuration against the [Blueprint Reference](https://docs.hamlet.io/reference) if you get stuck.
:::
