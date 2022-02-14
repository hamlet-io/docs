---
sidebar_label: Blueprint
title: District Blueprint
---

import Mermaid from '@theme/Mermaid';

## Blueprint Layer-by-Layer

A district is a unique combination of the layer instances and the blueprint is the composite configuration for that district. The configuration for each layer in the district is combined with any shared configuration and layered on top of the others.

The resulting blueprint is a reflection of all entities (layers) having their say in how the district is built and anything that comes from the district such as cloud infrastructure templates or application deployments should be implemented.

<Mermaid chart={`
  flowchart LR
      Masterdata--> Tenant
      Tenant --> Account
      Account --> Product
      Product --> Environment
      Environment --> Segment
`}/>

## Determining the District

Now that we've seen how the layers work together, how can we tell what district we're working in? Let's take a closer look at the directory structure we've created:

```bash
.
├── accounts
│   ├── acmedev01
│   └── acmeinc
├── phonedir
│   ├── config
│   └── infrastructure
└── root.json
```

The root of our hamlet structure is defined by a **root.json** file, so hamlet knows the bounds of its search for configuration.

Our accounts directory contains a single tenant (acmeinc) alongside at least one account (acmedev01). hamlet understands their association from this structure.

In addition to that we have at least one product. But we could have many products in this directory next to each other. How can we - or hamlet! - work out our district from all of this?

## Set the Segment

A segment is the smallest scope inside of our district. If we can tell hamlet which segment to use, it can walk up the directory tree and infer the environment, solution and product.

Rather than tell hamlet this information, it will capture it from the current working directory. So let's change into the segment of our district.

```bash
hamlet @ ~/cmdb
└─ $ cd phonedir/config/solutionsv2/integration/default/
```

## Set the Account

Now that we have covered the layers product through segment, the last step is to set which account belongs to our current district.

We set an environment variable of `ACCOUNT` to a value of the `ID` that matches the target account.

```bash
export ACCOUNT=acmedev01
```

This is where we have two districts meet. The tenant and account act as one district and the product, environment and segment act as another. Since we can deploy multiple products into the same account we need to tell the product which account it will work with.

## Generate the District Blueprint

It's often helpful to review what configuration hamlet is working with in the district. Let's pull this up to see how each of our layers contributes to the blueprint.

```bash
hamlet @ ~/cmdb/phonedir/config/solutionsv2/integration/default
└─ $ hamlet entrance invoke-entrance -e blueprint
(Info) Generating outputs:
(Info)  - generationcontract
(Info)  - config
(Info) Differences detected:
(Info)  - updating blueprint-generation-contract.json
(Info)  - updating blueprint-config.json
```

Until now we've only been working with the configuration of our product. This CLI command has generated our first output. You will find that hamlet has updated your product with your outputs under the infrastructure path.

```bash
└─ $ tree ~/cmdb/phonedir/infrastructure/
/home/hamlet/cmdb/phonedir/infrastructure/
├── hamlet
│   └── integration
│       └── default
│           └── default
│               ├── blueprint-config.json
│               └── blueprint-generation-contract.json
└── operations
    └── integration
        └── default
            └── credentials.json
```

Let's review the **blueprint.json** now. Open it up with `vim` before we go on:

```bash
hamlet @ ~/cmdb/phonedir/config/solutionsv2/integration/default
└─ $ vim ~/cmdb/phonedir/infrastructure/hamlet/integration/default/default/blueprint-config.json
```

:::warning
To get out of vim and back to the bash prompt, type `:q!<return>`
:::

## Reviewing the Blueprint

There an enormous of data that hamlet has already established about our district. Some of it you have provided (e.g. you should be able to spot your tenant information near the top) and some of it will be new.

If the blueprint is the composite of your tenant, account and product configuration, where is the rest coming from?

The configuration we've created so far isn't the only source of configuration for the blueprint. hamlet's engine comes with a collection of default and common configuration references. Let's review the `Environment` as an example.

When we generated the `phonedir` product you will recall that we set our environment to `integration`. Let's review what this environment consists of now.

```json
{
  "Environments": [
    {
      "Id": "int",
      "Name": "integration",
      "Title": "Integration Environment",
      "Description": "Mainly for devs to confirm components work together"
      /* ... */
    }
  ]
}
```

:::note
You can find this configuration in the blueprint with a word-search by typing `/"Environments"<return>`
:::

We provided the name and ID, but the remainder of this environment configuration was contributed by a standard set of configuration in the hamlet engine. An integration environment is often required so hamlet provides its configuration for ease of use.

hamlet provides this data with its own layer of CMDB data called the Master Data. This includes our best practice recommendations for environments as well as some basic data relating to things like network ports and regional endpoints and configuration for cloud providers. This is the first layer of configuration included in the blueprint so any data within the Master Data can be overridden by your own configuration.
