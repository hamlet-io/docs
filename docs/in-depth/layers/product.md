---
sidebar_label: Product
title: The Product
---

A Product is an operational service that has its own life-cycle and represents a single system.

We're going to use it to represent a basic phone directory website for our "Acme Inc" organisation.

```bash
hamlet @ ~/cmdb
└─ $ hamlet generate product base
[?] product id: phonedir
[?] dns zone []:
[?] product name [phonedir]:
[?] environment id [int]:
[?] environment name [integration]:
[?] segment id [default]:
[?] segment name [default]:
```

There are a number of default Product types that we can generate but here we've chosen the "base" Product - this will give us a well-rounded set of configuration to start us off.

Prompt 3 here is asking us what the `Id` value is for the Domain our Product will use. Our new Tenant does not contain any Domains yet, so we just leave this empty and no configuration is created for it.

Our Product generation prompts are also going to ask us for the `Id` and `Name` values for the final 3 layers - Solution, Environment and Segment. Each of these provide a new way for us to define unique instances of our Product, and we need at least 1 of each of them in order to move forward.

Here we've configured our Solution based on our Product's name, we'll use the common "integration" environment as our sole deployment environment and name our Segment "default".

And the outputs:

```bash
hamlet @ ~/cmdb
└─ $ tree phonedir/
phonedir/
├── config
│   ├── product.json
│   ├── settings
│   │   ├── integration
│   │   │   ├── default
│   │   │   │   └── settings.json
│   │   │   └── settings.json
│   │   └── shared
│   │       └── settings.json
│   └── solutionsv2
│       ├── integration
│       │   ├── default
│       │   │   └── segment.json
│       │   └── environment.json
│       └── shared
│           └── default
│               ├── segment.json
│               └── solution.json
└── infrastructure
    └── operations
        └── integration
            └── default
```

## product.json

```bash
hamlet @ ~/cmdb
└─ $ cat ./phonedir/config/product.json
{
    "Product" : {
        "Id" : "phonedir",
        "Name" : "phonedir",
        "Domain" : "acmeinc"
    }
}
```

This is a basic Product configuration. All layers have an Id and Name field and each layer type adds its own configuration relevant to the product.

Our Solution directory looks to have made a created a number of files though, lets take a closer look.

```bash
.
└── phonedir
    └── config
       └── solutionsv2
           ├── integration
           │   ├── default
           │   │   └── segment.json
           │   └── environment.json
           └── shared
               └── default
                   ├── segment.json
                   └── solution.json
```

### Environment Layer

The Environment layer enables configuration for different deployment environments, such as `development` or `production`. The Environment name we chose - `integration` - now has its own directory tree, alongside one called `shared`. This will allow us to separate out configuration intended for a specific environment from that intended to be Environment-layer wide.

### Segment Layer

Under our Environment directory, a simmilar structure has been created for our Segment layer too. The Segment layer provides an a mechanism to further separate out configuration within a given Environment. A single development Environment may contain unique Segments for each developer on a project for instance. For our needs today however, we've opted to go with the `default` segment name. We could create a `shared` Segment directory too, however in this instance we'll only be using the one Segment so its unnecessary.

### Tiers

Tiers - whilst not considered a layer - offer a final scope of configuration separation specifically for Components. Tiers are an expansion on the concept of a modular 3-tier architecture design. Not merely a way to group together components that operate together, Tier's offer a way to separate and secure components from eachother. For instance its common to place all "management" components into their own tier, which can then be tightly controlled, whilst components in a "web" tier might be publicly available.

Inside of our Product each of the new files defines only it's layer's `Name` and `Id` to distinguish them from eachother, and the solution file also configures an empty `Tiers` object. Though this could have been defined on any Layer, assigning it here means that it will become a part of every Solution for our `phonedir` Product.

```json
{
  "Solution": {
    "Id": "phonedir",
    "Name": "phonedir"
  },
  "Tiers": {}
}
```

## Your District

We have a complete set of Layers defined.

To recap, they are:

Tenant: `acmeinc`
Account: `acmedev01`
Product: `phonedir`
Solution: `phonedir`
Environment: `integration`
Segment: `default`

Having now configured at least one of each Layer, we've now got what is called a District - any full set of Layers. Each District is the sum of its configuration.

## Root Directory

You may have noticed along the way that the directory names play an important part of the Tenant, Account and Product. As Hamlet performs a task it determines which District it is currently working with from a combination of:

- current working directory
- CLI arguments
- the Product configuration (based on the current working directory).

Collectively these enable Hamlet to know which District to perform the task for, and so which configuration to include in the Blueprint - the composite configuration for the current District.

When it Hamlet is determining the current District it will walk up the directory tree from the current working directory, seeking out Tenants, Accounts and Products. We need to tell it where to stop walking.

Create an empty JSON object in a file called **root.json** inside the directory housing the District:

```bash
hamlet @ ~/cmdb
└─ $ echo '{}' > root.json

hamlet @ ~/cmdb
└─ $ tree -L 2
.
├── accounts
│   ├── acmedev01
│   └── acmeinc
├── phonedir
│   ├── config
│   └── infrastructure
└── root.json
```

We're now ready to inspect your District's Blueprint.
