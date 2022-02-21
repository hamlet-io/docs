---
sidebar_label: Account
title: Account
---

An account represents a single, provider-specific cloud account or subscription. An account is not restricted in how it is used. It could be used by many products or just a single one, depending on the needs of the organisation. Whenever a new cloud provider account or subscription is used by hamlet, a new account is required.

Let's create one now and see how it interacts with the tenant and product layers.

In our docker container, run the following:

```bash
hamlet @ ~/cmdb
└─ $ cd accounts

hamlet @ ~/cmdb/accounts
└─ $ hamlet generate account-cmdb
[?] account id: acmedev01
[?] account name [acmedev01]:
[?] account seed [igtfze6ar0]:
[?] provider type (aws, azure) [aws]:
[?] provider id: 012345678912
```

Returning to the root directory and reviewing our outputs:

```bash
hamlet @ ~/cmdb
└─ $ cd ..
hamlet @ ~/cmdb
└─ $ tree ./accounts/
./accounts/
├── acmedev01
│   ├── config
│   │   ├── account.json
│   │   └── settings
│   │       └── shared
│   │           └── settings.json
│   └── infrastructure
│       └── operations
│           └── shared
│               └── credentials.json
└── acmeinc
    ├── ipaddressgroups.json
    └── tenant.json
```

Now alongside the tenant `acmeinc` we have an account: `acmedev01`.

The config and infrastructure directories separate out our account configuration - the inputs - from the outputs: templates, documentation and other files that the hamlet engine will soon create for us. We'll see this structure reflected within the product shortly as well.

Let's quickly take a look at the new account.

## Account

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

The bare-bones configuration of our **account.json** file defines the usual name and ID attributes required for layers and creates a link between hamlet and the cloud provider. Our `acmedev01` account is now set up to work with AWS.

The ProviderId is the unique cloud account/subscription identifier, so this value will be different for each provider. AWS uses a 12-digit number for this.

The Seed is defined here too, ensuring that its value is recognised by all products that deploy into this account. The Seed value is used when cloud resources need to be named with a globally unique identifier across the cloud provider. The Seed value ensures that there is a random element to generated names.

## Settings

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

The shared settings file shown here defines the default registries that will be used by the account. Though some may never be used, their definition here ensures that all possible product build artefacts have an agreed endpoint.

## Credentials

The credentials.json is currently just an empty JSON object. The creation of this file bootstraps the directory structure for any future account credentials.

Let's now head on to create our first product so that we can see the way the tenant, account and product interact.
