---
sidebar_label: Account Setup
title: AWS Account Bootstrapping
---

The first step in working with hamlet is establishing the baseline services that will be used by all of your deployed applications.
For AWS this includes a number of deployments that are set up in each account.

Some of the account deployments include:

- S3 Registry - this is used to stage the images used to deploy your application
- Audit logging - enables forwarding S3 access logs to a central location
- Volume Encryption - EBS volume encryption across all volumes created in the account.

hamlet provides a set of these deployments to provide best practice hardening and configuration to your AWS account.

## Deploying the S3 registry

The first step is to create the registry where our code images will be deployed.

:::info
If you haven't already, create a CMDB using the [create CMDB guide](../../create-cmdb.md)
:::

1. From your CMDB workspace change into the account directory.

    :::tip
    hamlet uses your current directory to determine where this deployment should run
    :::

    ```bash
    # Make sure we are in our CMDB
    cd ~/hamlet_hello/mycmdb

    # Change into the account repo
    cd accounts/acct01/config
    ```

1. Check the available deployments that you can run.

    ```bash
    hamlet deploy list-deployments --deployment-group account
    ```

    ```bash
    | Deployment Group   | Deployment Unit   | Provider   | State       | District   |
    |--------------------|-------------------|------------|-------------|------------|
    | account            | cmk               | aws        | notdeployed | account    |
    | account            | iam               | aws        | notdeployed | account    |
    | account            | lg                | aws        | notdeployed | account    |
    | account            | audit             | aws        | notdeployed | account    |
    | account            | s3                | aws        | notdeployed | account    |
    | account            | apigateway        | aws        | notdeployed | account    |
    | account            | console           | aws        | notdeployed | account    |
    | account            | ecs               | aws        | notdeployed | account    |
    | account            | ses               | aws        | notdeployed | account    |
    | account            | sms               | aws        | notdeployed | account    |
    | account            | volumeencrypt     | aws        | notdeployed | account    |
    ```

    Deployments are collections of cloud resources which perform a function. For AWS, each deployment maps to a CloudFormation stack. Separating resources into smaller groups allows for a clearer understanding of what is being deployed and isolates changes when a deployment is run.

1. Let's run a deployment now to create the S3 registry.

    ```bash
    hamlet deploy run-deployments --deployment-group account -u s3
    ```

    :::tip
    If you have MFA configured you will be prompted to enter your MFA token
    :::

    ```bash
    [*] account/s3

    (Info) Generating outputs:
    [*] entrance: deployment | output: contract | subset: generationcontract
    [*] entrance: deployment | output: resource
    [*] entrance: deployment | output: script | subset: epilogue
    (Info)  ~ no change in account-s3-acct01-ap-southeast-2-template.json detected
    (Info)  ~ no change in account-s3-acct01-ap-southeast-2-epilogue.sh detected
    (Info)  ~ no differences detected
    (Info) Preparing the context...
    (Info) Running stack operation for account-s3
    Status: >>>>
    (Info) Stack account-s3 completed with status UPDATE_COMPLETE

    (Info) Processing epilogue script
    (Info) Initialising the registry bucket ...
    upload: ../../../../../../../../../../tmp/hamletc_wWxUu7/manage_stack_CVqEg3/registry to s3://account-registry-d7x9ksa85n/dataset/.registry
    upload: ../../../../../../../../../../tmp/hamletc_wWxUu7/manage_stack_CVqEg3/registry to s3://account-registry-d7x9ksa85n/contentnode/.registry
    upload: ../../../../../../../../../../tmp/hamletc_wWxUu7/manage_stack_CVqEg3/registry to s3://account-registry-d7x9ksa85n/lambda/.registry
    upload: ../../../../../../../../../../tmp/hamletc_wWxUu7/manage_stack_CVqEg3/registry to s3://account-registry-d7x9ksa85n/pipeline/.registry
    upload: ../../../../../../../../../../tmp/hamletc_wWxUu7/manage_stack_CVqEg3/registry to s3://account-registry-d7x9ksa85n/scripts/.registry
    upload: ../../../../../../../../../../tmp/hamletc_wWxUu7/manage_stack_CVqEg3/registry to s3://account-registry-d7x9ksa85n/spa/.registry
    upload: ../../../../../../../../../../tmp/hamletc_wWxUu7/manage_stack_CVqEg3/registry to s3://account-registry-d7x9ksa85n/swagger/.registry
    upload: ../../../../../../../../../../tmp/hamletc_wWxUu7/manage_stack_CVqEg3/registry to s3://account-registry-d7x9ksa85n/openapi/.registry
    ```

## What does a deployment do?

A lot happened here so we will go through some of the key parts of the output.

```bash
(Info) Generating outputs:
[*] entrance: deployment | output: contract | subset: generationcontract
[*] entrance: deployment | output: resource
[*] entrance: deployment | output: script | subset: epilogue
```

Outputs are files generated by hamlet to implement what has been configured in hamlet. The engine is configured to translate its configuration into files that can be used by other services.

In this case we are generating 3 files:

- **generationcontract:**  outlines the required files for this task along with the configuration to create them
- **resource:**  a cloud formation template that will be provided to AWS CloudFormation to create the infrastructure
- **script - epilogue:** a Bash script which performs some extra tasks after the CloudFormation template is deployed.

```bash
(Info) Preparing the context...
```

The context here sets up the executor which will use the generated files to complete the task that is being run, in this case a deployment.
It includes getting your AWS credentials and making sure the credentials can access the account that you are deploying to.

```bash
(Info) Running stack operation for account-s3
Status: >>>>
(Info) Stack account-s3 completed with status CREATE_COMPLETE
```

Now we are ready to go, the executor is running the creation of the CloudFormation Stack using the resource file that was generated before. The executor watches the stack creation to make sure everything works as expected. Once this finishes the stack outputs are saved locally so that we can reference the outputs of the stack in future tasks.

```bash
(Info) Processing epilogue script
```

Deployments in hamlet can create scripts that are run during the deployment process. These scripts allow you to perform extra tasks that might not be supported in CloudFormation.

## Next Step

We now have a registry which will be used to stage build artefacts in future steps of this guide. The next step is to set up the product base infrastructure.
