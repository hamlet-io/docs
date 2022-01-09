---
sidebar_label: Environment Setup
title: Product Environment Setup
---

With the account ready to go we can start setting up our product. Before we begin deploying things we will quickly define what a product is and what it does.

- A product represents an application within hamlet and is a collection of infrastructure resources used to make your application run.
- A product contains environments which are copies of your application for testing, development or production.
- If you have a larger application you can also split an environment into multiple segments.
- Each segment has its own solution which you use to describe the infrastructure you need as components.

hamlet understands the overall concept of solution design for applications and we have included that as a key part of how hamlet defines infrastructure.

With that in mind let's starting deploying the base components of our product into an environment.

## Deploying the baseline

The baseline component must be deployed into every product segment. It contains a collection of resources that are used across the majority of the components.

It includes:

- A KMS encryption key that will be used for encryption at rest and password encryption
- S3 buckets that will be used for logging and storing settings files if we need them
- Creating an SSH key that will be used for any ec2 instances we create.

These resources are often included in the AWS Console Wizards but need to be explicitly created when using declarative infrastructure processes.

:::info
If you haven't already, create a CMDB using the [create CMDB guide](../../create-cmdb.md)
:::

1. From your CMDB workspace change into the product integration segment directory.

    ```bash
    # Make sure we are in our CMDB
    cd ~/hamlet_hello/mycmdb

    # Change into the default segment for the integration environment
    cd myapp/config/solutionsv2/integration/default/
    ```

    The `config/solutionsv2/` is where you define your solution. The directory will contain a collection of config files that define your components and their configuration.

1. First off let's have a look at what deployments are available by default.

    ```bash
    hamlet --account acct01 deploy list-deployments
    ```

    ```bash
    | Deployment Group   | Deployment Unit   | Provider   | State       | District   |
    |--------------------|-------------------|------------|-------------|------------|
    | segment            | baseline          | aws        | deployed    | segment    |
    | segment            | cmk               | aws        | notdeployed | segment    |
    | segment            | iam               | aws        | notdeployed | segment    |
    | segment            | lg                | aws        | notdeployed | segment    |
    | segment            | s3                | aws        | notdeployed | segment    |
    | segment            | vpc               | aws        | notdeployed | segment    |
    | segment            | eip               | aws        | notdeployed | segment    |
    | segment            | igw               | aws        | deployed    | segment    |
    | segment            | nat               | aws        | notdeployed | segment    |
    | segment            | ssh               | aws        | notdeployed | segment    |
    | segment            | vpcendpoint       | aws        | deployed    | segment    |
    | solution           | eip               | aws        | notdeployed | segment    |
    | solution           | iam               | aws        | notdeployed | segment    |
    | solution           | lg                | aws        | notdeployed | segment    |
    | application        | iam               | aws        | notdeployed | segment    |
    | application        | lg                | aws        | notdeployed | segment    |
    ```

    The command we ran is somewhat different from the account level deploy command we ran before. Since we aren't in an account directory we need to set the name of the account we will be deploying to. Adding `--account acct01` as an argument to the hamlet command does this for us. We don't need to specify the district on the list-deployments command since the default district is to run in the segment.

1. You can see we have a few deployments that are automatically added. Let's run the `baseline` deployment to get things started.

    ```bash
    hamlet --account acct01 deploy run-deployments -u baseline
    ```

    ```bash
    [*] segment/baseline

    (Info) Generating outputs:
    [*] entrance: deployment | output: contract | subset: generationcontract
    [*] entrance: deployment | output: script | subset: prologue

    (Info) Running stack operation for myapp-integration-seg-baseline
    Status: >>>>>>>>>>>>>>
    (Info) Stack myapp-integration-seg-baseline completed with status CREATE_COMPLETE

    (Info) Processing epilogue script
    (Info) Checking SSH credentials ...
    {
        "KeyFingerprint": "aa:aa:aa:aa:aa:aa:aa:aa:aa:aa:aa:aa:aa:aa:aa:aa",
        "KeyName": "myapp-integration-management-baseline-ssh",
        "KeyPairId": "key-1234567880"
    }
    {
        "KeyPairs": [
            {
                "KeyPairId": "key-1234567880",
                "KeyFingerprint": "aa:aa:aa:aa:aa:aa:aa:aa:aa:aa:aa:aa:aa:aa:aa:aa",
                "KeyName": "myapp-integration-management-baseline-ssh",
                "Tags": []
            }
        ]
    }
    ```

    This will create a new CloudFormation including a KMS key and logging buckets. The epilogue script creates an SSH key and encrypts it using the KMS key.

1. Next up we are going to add some configuration to get our solution ready for the rest of the guide.

    Open the `segment.json` file in the current directory.

    The file should have an empty Segment object in it.

    ```json
    {
        "Segment": {}
    }
    ```

    Inside the Segment object add the following:

    ```json
    {
        "Segment" : {
            "Modules" : {
                "no_master_resourcesets" : {
                    "Provider" : "aws",
                    "Name" : "no_master_resourcesets"
                }
            }
        }
    }
    ```

    This will disable resource sets. They are a more advanced topic that we won't need for this guide.

    To reduce costs we will also update the default networking configuration. Add the following under the Segment object:

    ```json
    {
        "Tiers" : {
            "app" : {
                "Network" : {
                    "RouteTable" : "external"
                }
            },
            "web" : {
                "Network" : {
                    "RouteTable" : "external"
                }
            },
            "mgmt" : {
                "Components" : {
                    "nat" : {
                        "gateway" : {
                            "Enabled" : false
                        }
                    },
                    "vpcendpoint" : {
                        "gateway" : {
                            "Enabled" : false
                        }
                    },
                    "ssh" : {
                        "bastion" : {
                            "Enabled" : false
                        }
                    }
                }
            }
        }
    }
    ```

    To get you started hamlet provides a predefined network stack, with a NAT Gateway, Internet Gateway and VPC endpoints along with a Linux based bastion host for admin access into the private networks of the VPC. This is particularly helpful as your application grows and you want to isolate your services from a security perspective, but some of these services are charged by the hour.

    Now that we've removed a few elements let's have a look at the deployment list again.

    ```bash
    hamlet --account acct01 deploy list-deployments
    ```

    ```terminal
    | Deployment Group   | Deployment Unit   | Provider   | State       | District   |
    |--------------------|-------------------|------------|-------------|------------|
    | segment            | baseline          | aws        | deployed    | segment    |
    | segment            | vpc               | aws        | notdeployed | segment    |
    | segment            | igw               | aws        | deployed    | segment    |
    ```

1. With all the talk of networking let's create our network.

    ```bash
    hamlet --account acct01 deploy run-deployments
    ```

    We aren't including any deployment details on the command. Doing this will run all of the deployments that are are available. This is useful to manage the overall state of your product and make sure everything is up to date. Once this has finished you should now have a full network available and ready to go.

## What was deployed?

Now we have our environment baseline set up and ready to go, along with a network that will be used by components that need it. Let's have a quick look at the network that has been deployed.

```bash
hamlet --account acct01 component describe-occurrence -n management-vpc-network resources
```

```json
{
    "vpc": {
        "Type": "vpc",
        "Address": "10.0.0.0/16",
        "ResourceId": "vpcXmgmtXvpc",
        "Id": "vpcXmgmtXvpc",
        "Deployed": true,
        "Name": "myapp-integration-management-vpc"
    },
    "subnets": {
        "mgmt": {
            "a": {
                "subnet": {
                    "Type": "subnet",
                    "Address": "10.0.240.0/22",
                    "Id": "subnetXmgmtXvpcXmgmtXa",
                    "Deployed": true,
                    "Name": "myapp-integration-management-vpc-management-a"
                },
                "networkACLAssoc": {
                    "Type": "association",
                    "Id": "associationXsubnetXmgmtXvpcXmgmtXaXnetworkACL",
                    "Deployed": false
                },
                "routeTableAssoc": {
                    "Type": "association",
                    "Id": "associationXsubnetXmgmtXvpcXmgmtXaXrouteTable",
                    "Deployed": false
                }
            },
            "b": {
                "subnet": {
                    "Type": "subnet",
                    "Address": "10.0.244.0/22",
                    "Id": "subnetXmgmtXvpcXmgmtXb",
                    "Deployed": true,
                    "Name": "myapp-integration-management-vpc-management-b"
                },
                "networkACLAssoc": {
                    "Type": "association",
                    "Id": "associationXsubnetXmgmtXvpcXmgmtXbXnetworkACL",
                    "Deployed": false
                },
                "routeTableAssoc": {
                    "Type": "association",
                    "Id": "associationXsubnetXmgmtXvpcXmgmtXbXrouteTable",
                    "Deployed": false
                }
            }
        }
    }
}
```

This output shows the resources created for the network component. It shows the VPC and two subnets based on the tiers within our solution that have components. The IP address allocations, naming and IDs are all handled by hamlet to make sure that we have a consistent deployment.

## Next Step

Now that we have worked through how deployments are run and discussed some of the key concepts within hamlet we can start working on our application deployment.
