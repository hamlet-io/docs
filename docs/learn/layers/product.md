---
sidebar_label: product
title: The Product
---

A Product is an operational service that has its own lifecycle, often aligning with a organsation Project. 

We're going to use it to represent a basic phone directory website for our "Acme Inc" organisation.

```bash
hamlet @ ~/cmdb
└─ $ hamlet generate product base --prompt
Enter product id: phonedir
Enter product name [phonedir]:
Enter domain id []: acmeinc
Enter solution id: phonedir
Enter solution name [phonedir]:
Enter environment id: int
Enter environment name [int]: integration
Enter segment id [default]:
Enter segment name [default]:
+-----+------------------+-------------+
|   № | parameter        | value       |
|-----+------------------+-------------|
|   1 | product id       | phonedir    |
|   2 | product name     | phonedir    |
|   3 | domain id        | acmeinc     |
|   4 | solution id      | phonedir    |
|   5 | solution name    | phonedir    |
|   6 | environment id   | int         |
|   7 | environment name | integration |
|   8 | segment id       | default     |
|   9 | segment name     | default     |
+-----+------------------+-------------+
Is everything correct? [y/N]: y
```

There are a number of default Product types that can be used but here we've chosen the "base" Product - this will give us a well-rounded set of configuration to start us off.

Prompt 3 here is asking us what the `Id` value is for the Domain our Product will use. If you recall, we defined our `Domains` object on the Tenant, as it is typically an organisationally owned resource and may be required across a number of Accounts and Products. So reviewing that configuration we see that our new Tenant only has the one domain defined - `acmeinc`.

Our Product generation prompts are also going to ask us for the `Id` and `Name` values for the final 3 layers - Solution, Environment and Segment. Each of these provide a new way for us to define unique instances of our Product, and we need at least 1 of each of them in order to move forward.

Here we've configured our Solution based on our Product's name, we'll use the common "integration" environment as our sole deployment environment and name our Segment "default".

And the outputs:

```bash
hamlet @ ~/cmdb
└─ $ tree
.
├── accounts
│   ├── acmedev01
│   │   ├── config
│   │   │   ├── account.json
│   │   │   └── settings
│   │   │       └── shared
│   │   │           └── settings.json
│   │   └── infrastructure
│   │       └── operations
│   │           └── shared
│   │               └── credentials.json
│   └── acmeinc
│       ├── domains.json
│       ├── ipaddressgroups.json
│       └── tenant.json
└── phonedir
    ├── config
    │   ├── product.json
    │   ├── settings
    │   │   ├── integration
    │   │   │   ├── default
    │   │   │   │   └── settings.json
    │   │   │   └── settings.json
    │   │   └── shared
    │   │       └── settings.json
    │   └── solutionsv2
    │       ├── integration
    │       │   ├── default
    │       │   │   └── segment.json
    │       │   └── environment.json
    │       └── shared
    │           └── default
    │               ├── segment.json
    │               └── solution.json
    └── infrastructure
        └── operations
            └── integration
                └── default
                    └── credentials.json
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

Nice and minimal Product configuration here. As is the case for every layer, we define our `Name` and `Id` for it, and our domain association is configured here too.

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

The Environment name we chose - `integration` - now has its own directory tree, alongside one called `shared`. This will allow us to separate out configuration intended for a specific environment from that intended to be Environment-layer wide.

Underneath this, the same has happened for our Segment layer too - however we've opted to go with the `default` segment name. We could create a `shared` Segment directory too, however in this instance we'll only be using the one Segment so its unnecessary.

Each of the new files defines only it's layer's `Name` and `Id` to distinguish them from eachother, and the solution file also configures an empty `Tiers` object. Though this could have been defined on any Layer, assigning it here means that it will become a part of every Solution for our `phonedir` Product.

```json
{
    "Solution" : {
        "Id" : "phonedir",
        "Name" : "phonedir"
    },
    "Tiers" : {
    }
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