---
sidebar_label: Environment Variables
title: Setting Environment Variables
---

Configuring an application through environment variables allows you to manage the behaviour in your application across multiple environments. Using environment variables you can define environment specific configuration such as database connections, log levels or feature flags without having to change the applications code. The variables are instead provided through the run time environment and the application code looks for these variables when thy are required.

hamlet manages the environment variables of components through settings. They can be converted into environment variables, configuration files or used to stage files that can be accessed an application.

In this guide we will cover how to provide application specific environment variables to your application through the explicit settings source. For more details on the available sources, see the [in-depth guide on settings](/in-depth/foundations/settings)

:::info
Adding environment variables based on other components in your solution is not part of this guide and is covered in the [accessing other components](accessing-components) how-to guide
:::

There are two key approaches to adding settings to your components

## Solution Settings

Solution settings are the simplest approach, they are defined as part of the components in a solution file and are supported across all components. By default all components will include these as environment variables when they are supported.

### Example: Setting the log level

The LOG_LEVEL environment variable is often used in python based applications to set how verbose logging should be. Let's set the LOG_LEVEL through the solution config

Here is a lambda function in our solution.json file for an api

```json
{
    "Solution" : {
        "Id": "solution"
    },
    "Tiers" : {
        "app" : {
            "Components" : {
                "apifunction" : {
                    "Type" : "lambda",
                    "deployment:Unit" : "api",
                    "Functions" : {
                        "get" : {
                            "RunTime" : "python3.8",
                            "Handler" : "lambda.handler",
                            "Memory" : 128
                        }
                    }
                }
            }
        }
    }
}
```

Generating the CloudFormation deployment for this component shows it has no environment variables defined ( they are normally set under Properties.Environment.Variables )

```json
{
  "Resources": {
    "lambdaXappXapifunctionXget": {
      "Type": "AWS::Lambda::Function",
      "Properties": {
        "Role": "arn:aws:iam::123456789012:role/managedPolicyXuserXappXapiuserbaseXlinksXarn",
        "FunctionName": "myapi-integration-application-apifunction-get",
        "MemorySize": 128,
        "Runtime": "python3.8",
        "Description": "myapi-integration-application-apifunction-get",
        "Handler": "lambda.handler",
        "Code": {
          "S3Bucket": "account-registry-7w3vt2eh6d",
          "S3Key": "lambda/myapi/application-apifunction-get/abc123/lambda.zip"
        }
      }
    }
  }
}
```

Now we add the LOG_LEVEL setting to the lambda component

```json
{
    "Solution" : {
        "Id": "solution"
    },
    "Tiers" : {
        "app" : {
            "Components" : {
                "apifunction" : {
                    "Type" : "lambda",
                    "deployment:Unit" : "api",
                    "Functions" : {
                        "get" : {
                            "RunTime" : "python3.8",
                            "Handler" : "lambda.handler",
                            "Memory" : 128,

                            "Settings" : {
                                "LOG_LEVEL" : {
                                    "Value" : "INFO"
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

And the environment variable has now been added to the CloudFormation deployment

```json
{
  "Resources": {
    "lambdaXappXapifunctionXget": {
      "Type": "AWS::Lambda::Function",
      "Properties": {
        "Role": "arn:aws:iam::123456789012:role/managedPolicyXuserXappXapiuserbaseXlinksXarn",
        "FunctionName": "myapi-integration-application-apifunction-get",
        "MemorySize": 128,
        "Runtime": "python3.8",
        "Description": "myapi-integration-application-apifunction-get",
        "Handler": "lambda.handler",
        "Environment": {
          "Variables": {
            "LOG_LEVEL": "INFO"
          }
        },
        "Code": {
          "S3Bucket": "account-registry-7w3vt2eh6d",
          "S3Key": "lambda/myapi/application-apifunction-get/abc123/lambda.zip"
        }
      }
    }
  }
}
```

Solution settings support providing text based environment variables, you can provide any data types as the Value and they will be converted to string escaped JSON values of the types provided. They do not support providing files, such as certificates or configuration files.

## Setting Namespaces

Setting Namespaces are a more complex approach to defining settings. Setting namespace collections are defined in a separate folder structure in the CMDB and allow you to define complex setting structures along with providing files that are staged in an object store and can be accessed from the component when required.

The name of the setting namespace is defined based on the folder structure that you place a settings.json file into. This structure is based on the district you are deploying into.

### Example: External Mutual TLS API

In this example our lambda function needs to connect to an external API that uses Mutual TLS to authenticate our system. To connect to the API we need to provide the lambda function with a few different settings

- The API Url
- A Client Id which is used to identify if we are testing or in production
- A public certificate file that the lambda function needs to present to the API

By default hamlet assigns setting namespaces to components automatically based on the properties of the component, this includes details like the component name, the tier the component belongs to along with any instance or version details if they are being used.

Using the same Solution as our previous example

```json
{
    "Solution" : {
        "Id": "solution"
    },
    "Tiers" : {
        "app" : {
            "Components" : {
                "apifunction" : {
                    "Type" : "lambda",
                    "deployment:Unit" : "api",
                    "Functions" : {
                        "get" : {
                            "RunTime" : "python3.8",
                            "Handler" : "lambda.handler",
                            "Memory" : 128
                        }
                    }
                }
            }
        }
    }
}
```

1. We can get the available setting namespaces of our api function with the following command

    ```bash
    hamlet component describe-occurrence -n application-apifunction-get-function setting-namespaces
    ```

    ```json
    [
        {
            "Key": "application-apifunction-get",
            "Match": "partial"
        },
        {
            "Key": "application-apifunction-get",
            "Match": "partial"
        },
        {
            "Key": "application-apifunction-get-function",
            "Match": "partial"
        },
        {
            "Key": "application-apifunction-get-function",
            "Match": "partial"
        },
        {
            "Key": "app-apifunction-get",
            "Match": "partial"
        },
        {
            "Key": "application-apifunction-get",
            "Match": "partial"
        },
        {
            "Key": "app-apifunction-get-function",
            "Match": "partial"
        },
        {
            "Key": "app-apifunction-get-function",
            "Match": "partial"
        },
        {
            "Key": "api",
            "Match": "exact"
        }
    ]
    ```

    This provides a list of the namespaces that will be included when calculating the settings ( and in turn environment variables ) for this lambda function. To align with structure of the solution file we will use the `app-apifunction-get` namespace for the settings we want to add.

1. Now that we have the namespace lets add the settings to our CMDB. Your CMDB product folder structure should look something like this:

    ```terminal
    myapi/
    ├── config
    │   ├── settings
    │   │   ├── integration
    │   │   │   └── default
    │   │   └── shared
    │   └── solutionsv2
    │       ├── integration
    │       │   └── default
    │       └── shared
    │           └── default
    └── infrastructure
        ├── cf
        │   └── integration
        │       └── default
        │           └── api
        │               └── default
        └── operations
            └── integration
                └── default
    ```

    The `config/settings/` directory is where our setting namespace collections live. Namespaces can either be placed under a specific layer, in this case the integration environment and default segment have been defined, or shared across layers using the shared directory. In the case of our external API the API URL and public certificate are the same across all environments, but we need to set the client Id for each environment.

    To create the shared settings namespace for our API Connection details

    ```bash
    mkdir -p myapi/config/settings/shared/default/app-apifunction-get/
    ```

1. Add a settings.json file to the new directory with the following

  ```json
  {
    "API" : {
      "URL" : "https://an.external.api/rest"
    }
  }
  ```

1. Then we add the public certificate using the asFile settings configuration

    Create a new directory within the setting namespace collection

    ```bash
    mkdir -p myapi/config/settings/shared/default/app-apifunction-get/asFile
    ```

    And add the certificate file to the directory

    ```bash
    echo "my-public-cert-content" > myapi/config/settings/shared/default/app-apifunction-get/asFile/api-public.crt
    ```

1. Now that the shared configuration is in place we can add the district specific configuration

  Create the setting namespace collection for the integration environment in the default segment

  ```bash
  mkdir -p myapi/config/settings/integration/default/app-apifunction-get/
  ```

  Add add a settings.json file to the directory with the following content

  ```json
  {
    "API" : {
      "CLIENT_ID" : "dev"
    }
  }
  ```

1. After all of that you should now have the following structure in your settings folder

  ```terminal
  myapi/config/settings/
  ├── integration
  │   ├── default
  │   │   ├── app-apifunction-get
  │   │   │   └── settings.json
  │   │   ├── application-apifunction-get
  │   │   │   └── build.json
  │   │   └── settings.json
  │   └── settings.json
  └── shared
      ├── default
      │   └── app-apifunction-get
      │       ├── asFile
      │       │   └── api-public.crt
      │       └── settings.json
      └── settings.json
  ```

  Some extra settings files are listed in this tree. You can also define settings at each layer, these will be included for all components that are part of the layer that the settings belong to.

1. Now generating the CloudFormation deployment we can see that the settings have been taken from the namespaces

  ```json
  {
    "Resources": {
      "lambdaXappXapifunctionXget": {
        "Type": "AWS::Lambda::Function",
        "Properties": {
          "Role": "arn:aws:iam::123456789012:role/managedPolicyXuserXappXapiuserbaseXlinksXarn",
          "FunctionName": "myapi-integration-application-apifunction-get",
          "MemorySize": 128,
          "Runtime": "python3.8",
          "Description": "myapi-integration-application-apifunction-get",
          "Handler": "lambda.handler",
          "Environment": {
            "Variables": {
              "API_CLIENT_ID": "dev",
              "API_PUBLIC": "api-public.crt",
              "API_URL": "https://an.external.api/rest",

              "LOG_LEVEL": "INFO"
            }
          },
          "Code": {
            "S3Bucket": "account-registry-7w3vt2eh6d",
            "S3Key": "lambda/myapi/application-apifunction-get/abc123/lambda.zip"
          }
        }
      }
    }
  }
  ```

- The environment variable names have been defined by combining the keys in our settings.json file and adding a _ between each key.
- The layer specific client Id has been included along with our shared API URL.
- The public certificate file name is provided using the file name without the file suffix provided.
- The file itself is stored in an object store and can be collected by the lambda function during startup.
- The LOG_LEVEL we set on the solution settings has also been included in the environment variables. The solution settings are preferred over the namespaces when conflicts occur

As you can see setting namespaces are a more complicated approach to defining settings but they can be useful when you have large configuration requirements which would take over your solution file. The dedicated file allows for you to define easier to understand JSON structures for your environment variables to make the configuration more maintainable
