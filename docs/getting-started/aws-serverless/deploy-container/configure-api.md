---
sidebar_label: API Configuration
title: API Configuration
---

This guide works through configuring the API using hamlet settings. When we first looked at the [hello_world](https://github.com/hamlet-io/docs-support/pkgs/container/docs-support%2Fhello_world) container it had an environment variable `LOCATION` that specifies where we are saying the greeting from.
With hamlet we can define environment variables using settings. The most common use for settings is to provide environment variables to our components, but they can also be used for providing files and adding support for dynamic resource setups. This guide will focus on using them for environment variables.

So let's set the environment variable `LOCATION` to "work".

:::info
If you haven't already, create a CMDB using the [create CMDB guide](../../create-cmdb.md)
:::

1. Change into the integration default segment directory to set the context.

    ```bash
    # Make sure we are in our CMDB
    cd ~/hamlet_hello/mycmdb

    # Change into the default segment for the integration environment
    cd myapp/config/solutionsv2/integration/default/
    ```

1. Open the segment.json file in your code editor and update the helloapi Service to include the Settings section

    ```json
    {
        "Tiers" : {
            "app" : {
                "Components" : {
                    "ecshost" : {
                        "Services" : {
                            "helloapi" : {
                                "Settings" : {
                                    "LOCATION" : {
                                        "Value" : "work"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    ```

    The Settings attribute is available on every component in hamlet and is a simple way to provide environment variables to your components.

1. Now we can generate the deployment. This time we will have a look at what will change before the deployment is run:

    ```bash
    hamlet --account acct01 deploy run-deployments -u helloapi --dryrun --confirm
    ```

    - -- `dryrun` command submits the CloudFormation as a changeset, the changeset shows what will happen when this change is run on the current state
    - -- `confirm` will wait for you to review the changes from the changeset and gives you a prompt to start the deployment.

    This will add the CloudFormation changeset response to the console.

    ```terminal
    (Info) (Dryrun) Results for myapp-integration-app-helloapi
    {
    "Changes": [
        ...
        {
            "Type": "Resource",
            "ResourceChange": {
                "Action": "Modify",
                "LogicalResourceId": "ecsTaskXappXecshostXhelloapi",
                "PhysicalResourceId": "arn:aws:ecs:ap-southeast-2:123456789:task-definition/myapp-integration-app-helloapi-ecsTaskXappXecshostXhelloapi-WtMacCYhJcCm:1",
                "ResourceType": "AWS::ECS::TaskDefinition",
                "Replacement": "True",
                "Scope": [
                    "Properties"
                ],
                "Details": [
                {
                    "Target": {
                        "Attribute": "Properties",
                        "Name": "ContainerDefinitions",
                        "RequiresRecreation": "Always"
                    },
                    "Evaluation": "Static",
                    "ChangeSource": "DirectModification"
                }
                ]
            }
        }
    ]
    ...
    Start Deployment of application/helloapi ? [y/N]: n
    ```

    In this changeset the TaskDefinition properties have been updated, but we can't see exactly what changes have been made. To find these changes we can check the generated CloudFormation template.

    Press `n` on the confirmation prompt so that we can confirm the new environment variable has been set.

1. hamlet saves the content of the CloudFormation template that it generates as part of the CMDB. This is useful for following the history of the deployment if this repo is part of source control or you want to troubleshoot the deployment.

    ```bash
    # change to the root of the CMDB
    cd ~/hamlet_hello/mycmdb

    # change to the integration segment deployment directory
    cd myapp/infrastructure/cf/integration/default/helloapi/default
    ```

1. Let's look at what's in the directory. We will find a collection of json and sh scripts which are used to deploy the helloapi:

    ```terminal
    app-helloapi-acct01-ap-southeast-2-generation-contract.json
    app-helloapi-acct01-ap-southeast-2-lastchange.json
    app-helloapi-acct01-ap-southeast-2-pregeneration.sh
    app-helloapi-acct01-ap-southeast-2-stack.json
    app-helloapi-acct01-ap-southeast-2-template.json
    ```

    - generation-contract.json - tells hamlet the files need to be generated for the deployment
    - lastchange.json - collects the changeset that hamlet generates for each CloudFormation update. This shows the updates that have been completed.
    - pregeneration.sh - is a script run before the standard outputs are generated by the engine. For this deployment it is used to pull down the container image.
    - stack.json - captures the cloudformation stack outputs so that hamlet can reference them
    - template.json - is our cloudformation template.

1. Open the template.json file ( app-helloapi-acct01-ap-southeast-2-template.json ) in your code editor and search for LOCATION. Under the Environment section of the container definition you should find the LOCATION variable set to our setting. When doing this search you will also see a collection of other variables. These are added automatically by hamlet for the base level services that are available to all components.

1. Now that we know the variable has been set, let's run the deployment:

    ```bash
    # change to the root of the CMDB
    cd ~/hamlet_hello/mycmdb

    # change to the integration segment to set context
    cd myapp/config/solutionsv2/integration/default/

    hamlet --account acct01 deploy run-deployments -u helloapi
    ```

1. Just like we did for the API deployment, we will get the URL for the load balancer to check that the location has changed.

    ```bash
    hamlet --account acct01 component describe-occurrence -n elb-apilb-http-lbport attributes
    ```

    From the output get the URL attribute and run a curl on the URL.

    ```bash
    curl http://myapp-int-elb-apilb-1234567890.ap-southeast-2.elb.amazonaws.com
    ```

    ```json
    {
        "Greeting": "Hello!",
        "Location": "work"
    }
    ```

    Now our API is saying hello from work.

This guide has covered how to include application level configuration into your solution and how it is applied to your occurrences.
