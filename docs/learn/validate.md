---
sidebar_label: validate configuration
title: Validating the Blueprint
---
import Admonition from 'react-admonitions';

Regularly validating that your Blueprint contains only valid configuration is not only good practice, it will help you catch mis-configurations early.

In this short guide we'll take a look over how you can make the most of Blueprint validation.

## Requirements

The following sections assume you are working inside the development workspace and have a District configured already.

## Running Validation

Validation is performed as an Engine Entrance.


```bash
hamlet entrance invoke-entrance -e validate
```

This will construct the Blueprint from the layers of the District  and bring to your attention any of the following:

- missing mandatory configuration;
- unexpected data types;
- values that do not match those available (where applicable)
- unexpected attributes have been found;

Should any of the above be present Hamlet Deploy will provide you with the cause of the invalid configuration and which configuration it was found within.

<Admonition type="question" title="Having Trouble?">
You can always compare invalid configuration against the <a href="https://docs.hamlet.io/reference">Blueprint Reference</a> if you get stuck.
</Admonition>
