---
sidebar_label: Provider Authentication
title: Cloud Provider Authentication
---

hamlet supports deployments across multiple cloud providers and their accounts. This allows hamlet to control deployments across the application's lifecycle, where you might have a development AWS account and a production AWS account, or when dealing with complex hosting requirements like dedicated DNS accounts.

hamlet supports a range of authentication methods for AWS and Azure which align with their standard configuration options. Configuration of provider authentication is handled when you invoke hamlet and is defined through environment variables. For security best practice this means that each user or service needs to set up their access before they can run hamlet deployments.

## Multiple Authentication Methods

For any of the configuration options below, the environment variables listed will apply the configuration across all accounts that hamlet will work with. If you need to override these values for a specific account, add the hamlet ID of the account after HAMLET in the environment variable.

:::info

For instance, if I had the following account layers available:

```bash
hamlet --profile msw layer list-layers --query "[?Type=='Account']"
| Name     | Id       | Type    | Active   |
|----------|----------|---------|----------|
| mswdev02 | mswdev02 | Account | True     |
```

Setting the environment variable `HAMLET_MSWDEV02_AWS_AUTH_SOURCE=NONE` would disable authentication for the mswdev02 account
:::

## Providers

Each provider has its own authentication processes and aims to expose these as easily as possible within hamlet. We aim to align with the provider's official CLI based authentication approaches where possible.

### Amazon Web Services (AWS)

You can select how you want to authenticate using the environment variable

`HAMLET_AWS_AUTH_SOURCE`

Which supports the following values:

- `ENV` - Use the standard AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY environment variables.
- `USER` - Works like the ENV source but supports a prefix on the AWS keys that you can set with.`HAMLET_AWS_AUTH_USER` if you set HAMLET_AWS_AUTH_USER=SEC hamlet would look for SEC_AWS_ACCESS_KEY_ID for your AWS authentication keys.
- `INSTANCE|INSTANCE:EC2|INSTANCE:ECS` - Uses the ec2 or ecs instance IAM roles. If you specify INSTANCE hamlet will prefer ecs over ec2, but use either one.
- `CONFIG` - Uses an [AWS CLI config file](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html) to determine credentials. hamlet will use a profile with the name of the hamlet account ID or the AWS account ID derived from the hamlet account details. The AWS account is preferred over the hamlet account ID.
- `NONE` - This bypasses authentication and disables the account check. This is useful when you are testing deployment generation locally and don't have access to the AWS account you are working with.

After configuring the source you have the option to configure a role and MFA token.

- `HAMLET_AWS_AUTH_ROLE` - Is either a role ARN or name that would be used to switch into the account that you are deploying into.
- `AWS_AUTH_MFA_SERIAL` - If you need MFA you can set the MFA_SERIAL ARN here and hamlet will use it on any of the authentication sources. If you are using the config provider it should be set in your config file.

The default source for AWS is ENV unless an [AWS CLI config file](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html) can be found. In this case the CONFIG source will be used.

### Microsoft Azure

The Azure provider has a similar configuration option in line with Azure authentication support.

`HAMLET_AZ_AUTH_METHOD`

Which supports the following values:

- `SERVICE` - Uses a service principal supplied with credentials from environment variables `HAMLET_AZ_AUTH_USERNAME` and `HAMLET_AZ_AUTH_PASSWORD`.
- `MANAGED` - Uses a managed identity.
- `INTERACTIVE` - Uses the interactive login process which will ask you to browse to a URL to log in.
- `NONE` - This bypasses authentication and disables the account check. This is useful when you are testing deployment generation locally and don't have access to the Azure account you are working with.

The default method is INTERACTIVE which will provide a URL that you need to log in through to issue credentials.

:::note
When using hamlet in a CI/CD based deployment, ensure you use one of the non-interactive auth methods unless you want to complete the interactive process as part of the pipeline
:::
