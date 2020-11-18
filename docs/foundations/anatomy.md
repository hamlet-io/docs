---
sidebar_label: anatomy
title: Anatomy of a Hamlet
---
import Admonition from 'react-admonitions';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Hamlet CMDBs

A `Hamlet` is comprised of 2 kinds CMDB - the `Account` CMDB and the `Product` CMDB. An `Account` CMDB contains both the `Tenant` and all `Accounts` within it, whilst individual `Product` CMDBs contain the `Solutions` that define and configure `Components` and `ReferenceData`. Each `Product` CMDB can contain multiple instances of a `Solution`, each corresponding to an `Environment`. Together, Hamlet deploys an instance of a `Solution` into an `Account` within the `Tenant`. 

Commonly, a single repository is used to manage the `Account` and `Tenant` and is known as the `accounts-cmdb`. In large organisations or organisations with strict security requirements they may be stored separately.

A `root.json` file at the root directory of all CMDBs informs Hamlet not to search any higher for configuration.

## Tenant CMDB

The tenant CMDB is used to define an organisation or entity. Configuration applied at the `Tenant` scope will apply across all `Accounts`. A `Tenant` CMDB typically defines owned domain configuration, and creates common and shared configuration or resources that are be accessible (or enforced, where appropriate) by all associated `Accounts` and `Products`. Depending on an organisations requirements a `Tenant` might contain the definitions and deployment templates for an organisation-wide audit-log store, or a collection of security policies that must be enforced everywhere they could apply.

## Account CMDB

The `Account` is linked to the `Tenant` CMDB and inherits its configuration. A `Solution` at the `Account` level defines configuration that is to be used account-wide and be applied to all current and future `Products` within it. An `Account` is tied directly to an provider-specific identifier which Hamlet uses to deploy to that cloud provider. Typically an `Account` will be required for each `Environment` that a `Tenant` contains, however this is only due to best-practice of environment isolation and is not a requirement of an `Account`.

## Product CMDB

A `Product` is created for one or more `Accounts` and represents a whole project. Typically the largest of the CMDB's, the `Product` inherits any enforced behaviours from the `Account` and its `Tenant`. It is used to define project-specific or unique `Components`, `Profiles` and `ReferenceData`.

 Additional scopes within the `Solution` definition itself allow for further break-down of a project if required.

# Solutions

A `Solution` is a collection of `Components` which together define a functional service. `Components` each define specific functionality within it and from them, Hamlet performs both infrastructure and application deployments.

Multiple instances of a `Solution` can be deployed into an `Environment`, each one is known as a `Segment`.

# Directory Structure of a Solution
A `Solution` is often spread out over multiple files and directories within a `Product`. The directory structure reflects `Environments` and `Segments`, and the composite of the variations define each `Solution`. "shared" directories contain configuration that is shared across that layer, whilst named-directories will only contribute their configuration to the named `Environment`/`Segment`.

```sh
<cmdb-id>
├── config
│   ├── settings
│   │   ├── <environment>
│   │   │   └── <segment>
│   │   └── shared
│   └── solutionsv2
│       ├── <environment>
│       │   └── <segment>
│       └── shared
│           └── <segment>
└── infrastructure
    ├── cf
    │   └── <environment>
    │       └── <segment>
    │           ├── <deployment-unit>
    │           └── <deployment-unit>
    ├── hamlet
    │   └── <environment>
    │       └── <segment>
    │           └── <deployment-unit>
    └── operations
        └── <environment>
            └── <segment>
```

At the top level of the structure, the CMDB identifier is the Tenant Id for `Tenants`, Account Id for `Accounts` and Product Id for `Products`. Hamlet uses this to identify the applicable ones at runtime.

Directories immediately underneath are `config` and `infrastructure` which correspond to "engine inputs" and "engine outputs".

Within the `config` directory, a further distinction is made between "application runtime settings" (`settings`) and "solution definitions" (`solutionsv2`).

Within the `infrastructure` directory, engine outputs are separated by type. `cf` is the output directory for infrastructure templates and scripts used for infrastructure and application deployment. `hamlet` is used by the engine itself to store outputs that inform further executions, such as Generation and Management `Contracts`. The `operations` directory is where Hamlet will store and access operational files such as generated keypairs and encrypted credentials.

Each of the above levels can then be further broken down as required by directories named after `environment`, `segment` and `deployment-unit`, ensuring that configuration can be made to apply everywhere within an organisation (at the `Tenant` level) down to individual component instance (`Deployment Unit` level). Additionally, each level may also contain a `shared` directory, which will contain configuration to be shared across its scope. For example in the structure shown above, the `shared` directory underneath `settings` exists at the `environment` scope. Any configuration defined there will be implemented across all environments.


## Structure of a Solution File

Any file that contributes to a Hamlet `Solution` can contain [`Components`](https://hamlet.io/reference/components), [`ReferenceData`](https://hamlet.io/reference/data) and [`MetaParameters`](https://hamlet.io/reference/meta) data types. Configuration is applied in a top-down manner at the CMDB-level (`Tenant > Account > Product`) and then again at the `Solution`-level (`Environment > Segment > Deployment Unit`). New content is combined with existing, whilst existing content will be overwritten if re-implemented by a more specific scope. This allows for the most effecient implementation for a given use-case. 

Configuration can be removed for individual scopes by defining it at as an empty object for that scope.