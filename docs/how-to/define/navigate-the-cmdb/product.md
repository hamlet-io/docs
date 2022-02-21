---
sidebar_label: Product
title: Product
---

A product is an operational service that has its own life cycle and represents a single system.

We're going to use it to represent a basic phone directory website for our _Acme Inc_ organisation.

```bash
hamlet @ ~/cmdb
└─ $ hamlet generate product-cmdb
[?] product id: phonedir
```

This command will create a basic directory structure that will get you started with our recommended CMDB approach. It defines your first layers: the environment as integration and the segment as default.

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

## Product

```bash
hamlet @ ~/cmdb
└─ $ cat ./phonedir/config/product.json
{
    "Product" : {
        "Id" : "phonedir",
        "Name" : "phonedir"
    }
}
```
Let's take a closer look at the files created by our solution directory.

```bash
.
└── phonedir
    └── config
      └── solutionsv2
           ├── integration
           │   ├── default
           │   │   └── segment.json
           │   └── environment.json
           └── shared
               └── default
                   ├── segment.json
                   └── solution.json
```

### Environment Layer

The environment layer enables configuration for different deployment environments, such as development or production. The environment name we chose - integration - now has its own directory tree, alongside one called shared. This will allow us to separate out configuration intended for a specific environment from that intended to be environment layer wide.

### Segment Layer

Under our environment directory, a similar structure has been created for our segment layer. The segment layer provides a mechanism to further separate out configuration within a given environment. For instance, a single development environment may contain segments unique to each developer on a project. Today we've chosen the option of the default segment name. 

### Tiers

Tiers offer a final scope of configuration separation specifically for components. Tiers are an expansion on the concept of a modular 3-tier architecture design. Not merely a way to group together components that operate together, tiers offer a way to separate and secure components from each other. For instance, it is common practice to place all management components into their own tier, which can then be tightly controlled, while components in a web tier might be publicly available.

Inside of our product each of the new files defines only its layer's name and ID to distinguish them from each other and the solution file which configures an empty `Tiers` object. Assigning it here means that it will become a part of every solution for our `phonedir` product.

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

Having now configured at least one of each layer, we now have what is called a district - any full set of layers. 

To recap, these layers are:

- **Tenant:** acmeinc
- **Account:** acmedev01
- **Product:** phonedir
- **Environment:** integration
- **Segment:** default

Each district is the sum of its configuration.

## Root Directory

You may have noticed that directory names play an important role in the tenant, account and product layers. As hamlet performs a task it determines which district it is currently working with from a combination of:

- current working directory
- CLI arguments
- the product configuration (based on the current working directory).

Collectively these enable hamlet to know which district to perform the task for and therefore which configuration to include in the blueprint - the composite configuration for the current district.

When hamlet is determining the current district, it will walk up the directory tree from the current working directory, seeking out tenants, accounts and products. We need to tell it where to stop walking.

Create an empty JSON object in a file called **root.json** inside the directory housing the district:

```bash
hamlet @ ~/cmdb
└─ $ echo '{}' > root.json

hamlet @ ~/cmdb
└─ $ tree -L 2
.
├── accounts
│   ├── acmedev01
│   └── acmeinc
├── phonedir
│   ├── config
│   └── infrastructure
└── root.json
```

We're now ready to inspect your district's blueprint.
