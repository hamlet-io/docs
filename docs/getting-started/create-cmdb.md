---
sidebar_label: Creating a CMDB
title: Creating a CMDB
---

The Configuration Management Database (CMDB) is the heart of hamlet. It contains the configuration, infrastructure code and state of your hamlet deployed infrastructure.

CMDBs use a file based structure with a strict directory layout which hamlet uses to build its configuration. hamlet uses nested CMDBs of differing types to compile a solution using an overlay approach - but we won't go into too much depth at this stage!

If you'd like to deep dive however, head to the [navigating the cmdb](/how-to/define/navigate-the-cmdb) how-to guide to learn more.

### Generating the CMDB

We can start a new CMDB using the CLI.

1. Create a new directory that will be used for the main CMDB which is effectively the top scope. This directory will contain your entire infrastructure and should be treated as code.

    :::info
    This directory is generally added to your source control provider to share the configuration with your team or CI deployments.
    :::

    ```bash
    mkdir -p ~/hamlet_hello/mycmdb
    ```

1. Change into the directory and create the `root.json` file. This file tells hamlet where the top of the CMDB file structure is.

    ```bash
    cd ~/hamlet_hello/mycmdb
    echo '{}' > root.json
    ```

1. Now that we have the root defined let's add our `tenant` CMDB. The tenant CMDB represents your overall hamlet deployment. This could well be a single application with a single cloud account, or **all** of your applications and **all** of their cloud accounts. hamlet allows you to define your infrastructure in a standardised way based on your deployment requirements.

    We can create a tenant using the hamlet CLI. It will create the files and folder structure that we need and ask some questions to fill in the gaps.

    ```bash
    hamlet generate tenant-cmdb
    ```

    You will be prompted for details that describe your tenancy. The 'tenant id' below will be used to identify resources created for this tenant.

    ```bash
    [?] tenant id: acmeinc
    ```

    Enter the details as requested and a new directory will be created in your CMDB called **accounts**.

    ```bash
    tree  ~/hamlet_hello/mycmdb
    ```

    ```bash
    |-- accounts
    |   -- acmeinc
    |       |-- ipaddressgroups.json
    |       |-- tenant.json
    |-- root.json
    ```

1. Once you have your tenant CMDB we now need to create an `account` CMDB to host your infrastructure. The account CMDB holds the configuration of your cloud account or subscription and can be shared across different applications as needed.

    Change into the tenant CMDB directory.

    ```bash
    cd ~/hamlet_hello/mycmdb/accounts
    ```

    Run the the following to create your account CMDB:

    ```bash
    hamlet generate account-cmdb
    ```

    When prompted, enter the account id (the name of the account as it exists on your chosen cloud provider) and the provider id (This is the ID of your cloud provider account that we will deploy to - you can use a random ID for this for now).

    ```bash
    [?] account id: acct01
    [?] provider id: 1234567890
    ```

    A new account directory will now be created in your CMDB based on the supplied account name.

    ```bash
    tree  ~/hamlet_hello/mycmdb
    ```

    ```bash
    |-- accounts
    |   |-- acct01
    |   |   |-- config
    |   |   |   |-- account.json
    |   |   |   |-- settings
    |   |   |       |-- shared
    |   |   |           |-- settings.json
    |   |   |-- infrastructure
    |   |       |-- operations
    |   |           |-- shared
    |   |               |-- credentials.json
    |   |-- acmeinc
    |       |-- ipaddressgroups.json
    |       |-- tenant.json
    |-- root.json
    ```

1. Now that the overall hosting environment has been defined we can create a `product` CMDB. Products represent applications deployed through their lifecycle.

    Change into the root directory of your CMDB.

    ```bash
    cd ~/hamlet_hello/mycmdb
    ```

    Run the following to create your product CMDB:

    ```bash
    hamlet generate product-cmdb
    ```

    When prompted, supply the product id. This is simply an identifier for referencing your product. Resources that get created under this scope will have this prepended, as well as a short random string to ensure that those resources are globally unique.

    ```bash
    [?] product id: myapp
    ```

## Ready To Build

Now that you have your base CMDB set up you can move on to our deployment guides which cover how to use the CMDB with real world examples.

- [AWS Serverless](aws-serverless/index.md) - Deploy an API and Web interface using serverless techniques in Amazon Web Services
