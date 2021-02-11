---
sidebar_label: tenant
title: The Tenant
---
import Admonition from 'react-admonitions';

A Tenant represents an organsation or entity and is the greatest scope within Hamlet. All configuration applied at this layer is going to influence all Accounts and Products within it.

Lets create one now so that we have something to look at. 

From your terminal, run the following to pull down and run the offical Hamlet Docker container and start an interactive terminal session inside of it:

```bash
docker run -it --rm hamletio/hamlet:latest
```

Your terminal window should now look like this - if not, you might need to ensure you have Docker installed and configgured correctly.

```bash
hamlet @ ~/cmdb
└─ $
```

:::note
All Hamlet CLI commands have useful help pages that can be accessed within the container:

```bash
hamlet <command> --help
```
:::

## Creating the Tenant

Create your first Hamlet Tenant. After entering the command you will be asked a series of questions to help bootstrap the Tenant structure. The default option - available by leaving the prompt blank - is displayed in square-brackets.

```bash
hamlet @ ~/cmdb
└─ $ hamlet generate cmdb tenant --prompt
Enter tenant id: acmeinc
Enter tenant name [acmeinc]:
Enter domain stem []: acme.io
Enter default region [ap-southeast-2]:
Enter audit log expiry days [2555]:
Enter audit log offline days [90]:
+-----+------------------------+----------------+
|   № | parameter              | value          |
|-----+------------------------+----------------|
|   1 | tenant id              | acmeinc        |
|   2 | tenant name            | acmeinc        |
|   3 | domain stem            | acme.io      |
|   4 | default region         | ap-southeast-2 |
|   5 | audit log expiry days  | 2555           |y
|   6 | audit log offline days | 90             |
+-----+------------------------+----------------+
Is everything correct? [y/N]: y
```

That's all it takes to create your first Tenant and its minimal configuration. 

Now let's take a look at what Hamlet has created for us. 

```bash
hamlet @ ~/cmdb
└─ $ tree
.
└── accounts
    └── acmeinc
        ├── domains.json
        ├── ipaddressgroups.json
        └── tenant.json
```


Notice the directory structure here - `./accounts/acmeinc`. The `tenant name` that we provided to Hamlet - *"acmeinc"* - has been used for the directory name to store our configuration in.

A Tenant alone isn't sufficient for us to perform any Hamlet activities with it yet, so instead lets take a peek at the files Hamlet generated for us:

```bash
hamlet @ ~/cmdb
└─ $ cat ./accounts/acmeinc/tenant.json
{
    "Tenant" : {
        "Id" : "acmeinc",
        "Name" : "acmeinc",
        "CertificateBehaviours" : {
            "External" : true
        }
    },
    "Account" : {
        "Region" : "ap-southeast-2",
        "Domain" : "hamlet",
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