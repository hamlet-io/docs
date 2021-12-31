---
sidebar_label: Plugins
title: Engine Plugins
---

hamlet uses a plugin based approach to managing different resource providers and components. The hamlet engine essentially provides a base level context that these plugins use to build out cloud deployments.

The hamlet team maintains a collection of plugins for the major public cloud providers ( Amazon Web Services and Microsoft Azure ), along with a shared plugin which defines common solution level components. These components are implemented by both providers and aim to define common library of functions between each cloud provider.

## hamlet Library

The [hamlet library](https://github.com/hamlet-io/hamlet-library/) is a list of plugins available from the hamlet team or the community. The hamlet team provide the core plugins along with module plugins which provide implementations of specific functions.

## Installing a Plugin

Plugins are registered on layers in your solution. This allows you to set the scope that a plugin is installed. If you add it to the tenant layer the plugin will be installed for all of the accounts and products that belong to the tenant. If you add the plugin at the segment layer then it will only be installed for a particular segment.

### git Repository Installations

The recommended approach to installing plugins is the git based approach, this allows you to have a version controlled plugin which can be installed easily by anyone who needs to use your cmdb.

1. Find the git clone Url of the repository that has your plugin. For this example we will use the [s3 support](https://github.com/hamlet-io/lambda-s3-support.git) plugin which provides a collection of lambda functions for working with Amazon S3
1. Determine the layer you want to install the plugin into. This really depends on how the plugin works. The s3 functions are generally only used in specific products. So for this we have two options, the Product layer makes it available to all segments and environments within your product. Segment will make it available segment in each environment. We will use the Product layer in this example

    :::info
    To find the layers that are currently available set your cmdb context and run the following

    ```bash
    hamlet layer list-layers --query '[?Active]'
    ```

    ```terminal
    | Name           | Id             | Type        | Active   |
    |----------------|----------------|-------------|----------|
    | integration    | int            | Environment | True     |
    | ap-southeast-2 | ap-southeast-2 | Region      | True     |
    | mswdev02       | mswdev02       | Account     | True     |
    | walksregister  | walksregister  | Product     | True     |
    | roleyfoley     | roleyfoley     | Segment     | True     |
    | app            | app            | Solution    | True     |
    | msw            | msw            | Tenant      | True     |
    ```

    This shows each of the layers you are currently working in and you can use this information to see which layer would be best
    :::

1. Open your CMDB and edit the layer file for the layer you have chosen. In this case we will add the plugin to the product.json file
1. Add the following to the layer object

    ```json
    {
        "Product" : {
            "Plugins" : {
                "s3support" : {
                    "Name" : "s3support",
                    "Priority" : 200,
                    "Required" : true,
                    "Source" : "git",
                    "Source:git" : {
                        "Url" : "https://github.com/hamlet-io/lambda-s3-support.git",
                        "Ref" : "main",
                        "Path" : "hamlet/s3support"
                    }
                }
            }
        }
    }
    ```

    The properties of the plugin are:
    - `Name` the name of the plugin based on the provider.ftl file in the plugin ( this is usually outlined in the README file )
    - `Priority` Defines the order that the plugin should be loaded when setting up hamlet. Plugins layer over the top of each other and can require functions from other layers
    - `Required` if the plugin cannot be found when someone runs a hamlet command in this CMDB the command will be stopped
    - `Source` Where to get the plugin from
    - `Source:git` Defines the git properties of the plugin, including the Url, git ref and the path within the repository where the plugin lives.
1. You now need to get the plugin from its source so that it can be included. To do this run the setup command

    ```bash
    hamlet setup
    ```

    This will find the plugins in your context and copy them to a local cache
1. You can now use the services available in the plugin to do what you need to
