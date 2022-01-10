---
sidebar_label: Tenant
title: The Tenant
---

A Tenant represents an organisation or entity and is the highest scope within hamlet. All configuration applied at this layer is going to influence all Accounts and Products within it.

## Creating the Tenant

Create your first hamlet Tenant. After entering the command you will be asked a series of questions to help bootstrap the Tenant structure. The default option - available by leaving the prompt blank - is displayed in square-brackets.

```bash
hamlet @ ~/cmdb
└─ $ hamlet generate tenant-cmdb
[?] tenant id: acmeinc
[?] tenant name [acmeinc]:
[?] default region [ap-southeast-2]:
[?] audit log expiry days [2555]:
[?] audit log offline days [90]:
```

That's all it takes to create your first Tenant and its minimal configuration.

Now let's take a look at what hamlet has created for us.

```bash
$ tree ./accounts
./accounts
└── acmeinc
    ├── ipaddressgroups.json
    └── tenant.json
```

Notice the directory structure here - `./accounts/acmeinc`. The `tenant name` that we provided to hamlet, _acmeinc_, has been used for the directory name to store our configuration in.

A Tenant alone isn't sufficient for us to perform any hamlet activities with it yet, so instead lets take a peek at the files hamlet generated for us:

## Tenant

```bash
hamlet @ ~/cmdb
└─ $ cat ./accounts/acmeinc/tenant.json
```

```json
{
    "Tenant" : {
        "Id" : "acmeinc",
        "Name" : "acmeinc"
    },
    "Account" : {
        "Region" : "ap-southeast-2",
        "Audit" : {
            "Offline" :  90,
            "Expiration" :  2555
        }
    },
    "Product" : {
        "Region" : "ap-southeast-2"
    }
}
```

You will recognise most of the values defined in the tenant.json file are responses to the CLI prompts answered earlier. Configuration in this file will impact each Account and Product associated with it. Because of the breadth of its scope, the default configuration created is minimal - mostly it can be considered default values.

We assign the Tenant a Name and Id, along with the default region configuration for the Account and Product layers. Defining defaults here rather than later in those layers means that we can set a single default at the greatest scope and only provide overriding values when necessary, reducing unnecessary duplication and ensuring that exceptions to this configuration will stand out.

## IP Address Groups

```bash
hamlet @ ~/cmdb
└─ $ cat ./accounts/acmeinc/ipaddressgroups.json
```

```json
{
    "IPAddressGroups" : {
    }
}
```

This file simply provides us with a best-practice location to store any IPAddressGroups that would be of interest across our Tenancy. A Tenant might for instance wish to define separate groups for different offices, and ensure that any Account or Product that uses it always reflects the latest details.

With our Tenant setup and reviewed, lets create an Account that belongs to it.
