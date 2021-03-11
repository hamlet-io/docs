---
sidebar_label: account
title: The Account
---

An Account reflects a single, provider-specific cloud account or subscription. 

An Account is not restricted in how it is used. It could be used by many Products, or just a single one depending on the needs of the organisation. Wherever a new cloud provider account or subscription is to be used by Hamlet, a new Account is required.

Let's create one now and see how it intereacts with the Tenant and Product layers.

In our docker container, run the following:

```bash
hamlet @ ~/cmdb
└─ $ cd accounts
hamlet @ ~/cmdb/accounts
└─ $ hamlet generate cmdb account
[?] account id: acmedev01
[?] account name [acmedev01]: 
[?] account seed [igtfze6ar0]: 
[?] provider type (aws, azure) [aws]: 
[?] provider id: 012345678912
```

Returning to the root directory and revewing our outputs:

```bash
hamlet @ ~/cmdb
└─ $ cd ..
hamlet @ ~/cmdb
└─ $ tree
.
└── accounts
    ├── acmedev01
    │   ├── config
    │   │   ├── account.json
    │   │   └── settings
    │   │       └── shared
    │   │           └── settings.json
    │   └── infrastructure
    │       └── operations
    │           └── shared
    │               └── credentials.json
    └── acmeinc
        ├── domains.json
        ├── ipaddressgroups.json
        └── tenant.json
```

Now alongside the Tenant `acmeinc` we have an Account: `acmedev01`.

The `config` and `infrastructure` directories separate out our Account configuration - the "inputs" - from the templates, documentation and other files that the Hamlet Deploy engine will soon create for us - "outputs". We'll see this structure reflected inside of the Product shortly as well.

Lets quickly take a look at the new Account.

## account.json

```bash
└─ $ cat accounts/acmedev01/config/account.json
{
    "Account" : {
        "Id" : "acmedev01",
        "Name" : "acmedev01",
        "Seed" : "igtfze6ar0",
        "Provider" : "aws",
        "ProviderId" : "012345678912"
    }
}
```

The bare-bones configuration of our **account.json** file defines the usual Name and Id attributes for this Account-layer, and establishes this Account with the cloud provider it is intended for. Our `acmedev01` Account is now setup to work with AWS. 

The `ProviderId` is the unique cloud account / subscription indentifier, so this value is going to be different for each provider. AWS uses a 12-digit number for this.

The `Seed` is defined here too, ensuring that it's value is known by all Products that deploy into this Account.

## settings.json

```bash
hamlet @ ~/cmdb
└─ $ cat ./accounts/acmedev01/config/settings/shared/settings.json
{
    "Registries" : {
        "docker" : {
            "EndPoint" : "aws.dkr.ecr.ap-southeast-2.amazonaws.com"
        },
        "lambda" : {
            "EndPoint" : "account-registry-igtfze6ar0",
            "Prefix" : "lambda/"
        },
        "openapi" : {
            "EndPoint" : "account-registry-igtfze6ar0",
            "Prefix" : "openapi/"
        },
        "spa" : {
            "EndPoint" : "account-registry-igtfze6ar0",
            "Prefix" : "spa/"
        },
        "scripts" : {
            "EndPoint" : "account-registry-igtfze6ar0",
            "Prefix" : "scripts/"
        },
        "contentnode" : {
            "EndPoint" : "account-registry-igtfze6ar0",
            "Prefix" : "contentnode/"
        },
        "dataset" : {
            "EndPoint" : "account-registry-igtfze6ar0",
            "Prefix" : "dataset/"
        },
        "pipeline" : {
            "EndPoint" : "account-registry-igtfze6ar0",
            "Prefix" : "pipeline/"
        },
        "rdssnapshot" : {
            "EndPoint" : "rds",
            "Prefix" : "registry"
        }

    }
}
```

The `shared` Segment's **settings** file shown here defines the default Registries that will be used by the Account. Though some may never be used, their definition here ensures that all possible Product build artefacts have an agreed endpoint.

## credentials.json

Currently just an empty JSON object, the creation of this file bootstraps the directory structure for any future Account credentials.

Lets now head on to create our first Product so that we can see the way that the Tenant, Account and Product interact.