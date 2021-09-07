---
sidebar_label: Blueprint
title: District Blueprint
---
import Mermaid from '@theme/Mermaid';

## Blueprint Layer-by-Layer

A District is a unique combination of the Layer instances and the Blueprint is the composite configuration for that District. The instance configuration for each Layer in the District is combined with any "shared" layer-instance configurat and layered on top of the others.

The resulting Blueprint is a reflection of all entities (Layers) having their say in how the District is built, and anything that comes from the district - such as cloud infrastructure templates or application deployments - should be implemented.

<Mermaid chart={`
  stateDiagram-v2
  District
  state District {
    Tenant --> Blueprint : 1 Account --> Blueprint : 2 Product --> Blueprint : 3 Solution --> Blueprint : 4 Environment --> Blueprint : 5 Segment --> Blueprint : 6
  }
`}/>

## Determining the District

Now that we've seen how the Layers work together, how can we tell what District we're working in? Lets take a closer look at the directory structure we've created.

```bash
.
├── accounts
│   ├── acmedev01
│   └── acmeinc
├── phonedir
│   ├── config
│   └── infrastructure
└── root.json
```

The root of our Hamlet structure is defined by a root.json file, so Hamlet knows the bounds of its search for configuration.

Our _accounts_ directory contains a single tenant (acmeinc) alongside at least one account (acmedev01). Hamlet understands their association from this structure.

Alongside all of _that_ we have at least one Product. But we could have many Products in this directory alongside eachother. How can we - or Hamlet! - work out our District from all of this?

## Set the Segment

A Segment is the smallest scope inside of our District. If we can tell Hamlet which Segment to use, it can walk up the directory tree and infer the Environment, Solution and Product.

Rather than Tell Hamlet this information, it will capture it from the current working directory. So lets change into the Segment of our District.

```bash
hamlet @ ~/cmdb
└─ $ cd phonedir/config/solutionsv2/integration/default/
```

:::note
The `shared` directory for any Layer is not its own definition; It's configuration is shared amonst all Layer instances.

This means we do not include it in our list of available Segments.
:::

## Set the Account

With Layers Product through Segment now covered, the last step is to set which Account belongs to our current District.

We set an Environment Variable of `ACCOUNT` to a value of the `Id` that matches the target Account.

```bash
export ACCOUNT=acmedev01
```

## Generate the District Blueprint

It's often helpful to review what configuration Hamlet is working with taken from your Districts. Lets do pull this up to see how each of our Layers contributes to the blueprint.

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

:::info
Entrances are simply a pass through the Hamlet Deploy engine with a specific goal. The Blueprint pass generates the Blueprint file as an output.
:::

Until now we've only been working with configuration of our Product - this CLI command has generated our first output though. You will find that Hamlet has updated your Product with your outputs under the _infrastructure_ path.

```bash
└─ $ tree ~/cmdb/phonedir/infrastructure/
/home/hamlet/cmdb/phonedir/infrastructure/
├── hamlet
│   └── integration
│       └── default
│           └── default
│               ├── blueprint-config.json
│               └── blueprint-generation-contract.json
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

## Reviewing the Blueprint

As you can no doubt see, there an enormous of data that Hamlet has already established about our District. Some of it you have provided (You should be able to spot your Tenant information near the top for example), whilst a lot of it you may not have seen before.

If the Blueprint is the composite of your Tenant, Account and Product configuration, where is the rest coming from?

:::warning
To get out of vim and back to the bash prompt, type `:q!<return>`
:::

### Hamlet Contributions

The configuration we've created so far isn't the only source of configuration for the blueprint. Hamlet's engine comes with a collection of default and common configuration references. Lets review the `Environment` as an example.

When we generated the `phonedir` Product you will recall that we set our Environment to `integration`. Let's review what this Environment consists of now.

```json
{
  "Environments": [
    {
      "Id": "int",
      "Name": "intengration",
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

We certainly provided the `Name` and `Id`, but the remainder of this Environment configuration was contributed by a standard set of configuration in the Hamlet engine. An "integration" Environment is commonly required and it's purpose is understood - so Hamlet provides its configuration for ease of use.
