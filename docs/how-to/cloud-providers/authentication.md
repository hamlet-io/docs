---
sidebar_label: Authentication
title: Authentication
---

Hamlet can deploy across different cloud provider regions and accounts. To support this, hamlet manages authentication to a cloud provider itself.

Hamlet supports different methods for AWS and Azure which align with their standard configuration options. The sections below outline how you can configure hamlet to access the different cloud providers.

## Amazon Web Services (AWS)

You can select how you want to authenticate using the environment variable

`HAMLET_AWS_AUTH_SOURCE`

Which supports the following values

- `ENV` - Use the standard AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY environment variables
- `USER` - Works like the ENV source but supports a prefix on the AWS keys that you can set with HAMLET_AWS_AUTH_USER so if you set HAMLET_AWS_AUTH_USER=SEC hamlet would look for SEC_AWS_ACCESS_KEY_ID for your aws authentication keys
- `INSTANCE|INSTANCE:EC2|INSTANCE:ECS` - Uses the ec2 or ecs instance iam roles. If you specify INSTANCE hamlet will prefer ECS over EC2, but use either one.
- `CONFIG` - Uses an aws cli config file to determine credentials. Hamlet will search for a profile in your config file based on the hamlet account id or the AWS account id derived from the hamlet account details
- `NONE` - This bypasses authentication and disables the account check. This is useful when you are testing deployment generation locally and don't have access to the AWS account you are working with.

After configuring the source you can optionally configure a role and MFA token

- `HAMLET_AWS_AUTH_ROLE` - Is either an role ARN or name that would be used to switch into the account that you are deploying into
- `AWS_AUTH_MFA_SERIAL` - If you need MFA you can set the MFA_SERIAL arn here and hamlet will use it on any of the authentication sources. If you are using the config provider it should be set in your config file

## Microsoft Azure

The Azure Provider has a similar configuration option inline with their authentication support

`AZ_AUTH_METHOD`

Which supports the following values

- `SERVICE` - Uses a service principal supplied via HAMLET_AZ_USERNAME
- `MANAGED` - Uses a managed identity
- `INTERACTIVE` - Uses the interactive login process which will ask you to browse to a URL to login
- `NONE` - This bypasses authentication and disables the account check. This is useful when you are testing deployment generation locally and don't have access to the Azure account you are working with.

For both providers you can override the source to use for a specific account by adding the hamlet account id as a suffix on any of these environment keys.
