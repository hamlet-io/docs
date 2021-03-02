---
sidebar_label: blueprint
title: District Blueprint
---

To show how all of the layers work together, consider the directory structure we've made.

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

And alongside all of _that_ we have at least one Product. But though our Product does reference configuration defined on the Tenant (the "Domain") Hamlet doesn't interpret this link. It might find several Tenant's with the same Domain Id.

So how does Hamlet know which Product we intend for it to use? And beyond that, which is the intended Solution, Environment and Segment?

---

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

### Provider Definitions

Hamlet Provider Plugins extend Hamlet's capabilities to work with that Provider. The AWS provider plugin for example extents Hamlet to create CloudFormation templates and undertake stack deployments into AWS.

Along with the Plugin comes a collection of Reference definitions that are specific to the Provider and which save the user from having to create and maintain them themselves.

Inside of the Hamlet Deploy engine itself is the Shared Provider. This Provider contributes common Reference configuration to the District that **_is not_** Provider-specific. 

When we generated our `phonedir` Product you will recall that we set our Environment to `integration`. Let's review what this Environment consists of now.

```json
{
  "Environments" : [
      {
          "Id" : "int",
          "Name" : "intengration",
          "Title" : "Integration Environment",
          "Description" : "Mainly for devs to confirm components work together",
          /* ... */
      }
  ]
}
```

:::note
You can find this configuration in the blueprint with a word-search by typing `/"Environments"<return>`
:::

We certainly provided the `Name` and `Id`, but the remainder of this Environment configuration was contributed by the Shared Provider. An "integration" Environment is commonly required and understood - so its available to use out of the box.


### Plugins

If your Layers define non-Provider Plugins to load (not yet covered) then they may also be contributing definitions in the same manner as the Provider Plugins.