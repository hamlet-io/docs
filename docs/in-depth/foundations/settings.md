---
sidebar_label: Settings
title: Settings
---

hamlet aligns with the [twelve-factor app configuration](https://12factor.net/config) approach where you define the configuration of your application through the runtime environment of the deployment. In hamlet this environment is defined through settings, each occurrence has its own settings, and includes a range of properties such as the context the occurrence has been deployed into, explicit settings defined by your solution and details of other occurrences in your solution.

Using this collection of settings you can then configure you application to work as you expect to. Defining log levels based on environments, accessing the database deployed in the same environment as the container that needs the database are all examples of how you can use settings with your application.

## Setting Sources

Settings are sourced for an occurrence from a range of locations, these locations are broken into two sources.

- **Explicit** settings are provided as part of your CMDB and are mostly used to provide application specific settings. External service connections, feature flags and log levels are often set through the explicit configuration.
- **Implicit** settings are provided by the hamlet engine and are based on the context where you are deploying a component. This includes settings like database or object store connection strings along with contextual information like the name of the environment that the component is part of.

## Setting Structure

Each setting at its minimum is a key value pair, where the key is the name of the setting and the value is a simple type ( string, boolean, number )

```json
{
    "ENVIRONMENT" : "production"
}
```

This setting is called ENVIRONMENT and its value is production

Settings can be extended to include additional properties as a object instead of a simple type for the setting value

- **Value** allows you to provide a JSON object as the setting

    ```json
    {
        "DATABASE" : {
            "Value" : {
                "Hostname" : "db.local",
                "Username" : "dbadmin",
                "port" : 5432
            }
        }
    }
    ```

    This setting defines a database setting with a collection of properties that describe how to connect to the database. When translating this setting into an environment the Value will be converted to JSON escaped string.

- **Internal** allows you to hide the value from the application and it will not be included in environment variable processing

    ```json
    {
        "USE_KMS" : {
            "Value" : true,
            "Internal" : true
        }
    }
    ```

    The USE_KMS setting won't be added to environment variables but can be used in extensions or other advanced generation scenarios like adaptor and template components

## Environment Variable Translation

The most common use of settings is in environment variables. These are defined in deployments and generally apply to the resource which is responsible for executing the application code you want to deploy.

When settings are used for environment variables the following rules are applied to ensure they are compatible with operating system environment variables.

Each setting is converted to a key value pair where:

- The Key is upper case and any non-alphanumeric characters are replaced with an _
- If the value of the pair is a simple type ( string, number, boolean ) it is converted to a string representation
- If the value of the pair is an object the Value property is converted to a string representation of the Value
- The value is passed as provided, so if you need to encrypt or manage secrets they need to be handled outside of the hamlet deployment process for both encryption and decryption.
