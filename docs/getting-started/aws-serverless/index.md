---
sidebar_label: Introduction
title: AWS Serverless App Deployment
slug: /getting-started/aws-serverless/
---

This guide takes you through the deployment of an application on AWS using hamlet and a range of AWS services.

:::caution
While we have tried to minimise the cost of the services we selected in this guide, there will still be costs incurred running this guide.
Please make sure to clean up any resources created during the guide.

To clean up what has been deployed through these guides, at any time run:

```bash
hamlet deploy run-deployments -d account -d segment --no-refresh-outputs -m stop
```

:::

## What are we building?

The app we are going to build through the guide is the Hello Everywhere app. It is made up of an API which is configured to say hello from various locations and a web front end to display the Hello API results.

This basic application is being used in order to focus on how to manage the deployment of the infrastructure required to host it.

## What do I need?

Before getting into the guide here are a couple of requirements you need to know first:

- You will need an active AWS account and administrative access to this account. If you don't have an account head to [AWS](https://aws.amazon.com/) to sign up and create an account. New accounts have an extended free tier for the first year to reduce your costs and get you started.
- In this account you will need an IAM user that has administrative access. If you haven't done this before [Create your first IAM user](https://docs.aws.amazon.com/IAM/latest/UserGuide/getting-started_create-admin-group.html) with administrative access to the account. You will need the AWS_SECRET_ACCESS_KEY and AWS_ACCESS_KEY_ID for hamlet to deploy your infrastructure.
- Having Docker installed and running will be required to complete some of the deployment steps. If you haven't worked with Docker before, head to the [getting started](https://docs.docker.com/get-started/) guide for what Docker is and how it works.

## AWS Credential Setup

hamlet uses the [awscli](https://aws.amazon.com/cli/) to access your AWS account and this comes with a number of different ways to log in to your account. hamlet supports most of these and integrates them to make it easier to deal with multiple AWS accounts.

The easiest way is to use the standard CLI environment variables. To use this method you will need an Access Key/Secret Key pair for a user that has administrative access to your AWS account. Once you have these, set them as environment variables in the shell that you will use to run your hamlet commands.

```bash
export AWS_ACCESS_KEY_ID=<Access Key>
export AWS_SECRET_ACCESS_KEY=<Secret Key>
```

After you have set these we need to tell hamlet to use them.

```bash
export HAMLET_AWS_AUTH_SOURCE=ENV
```

This tells hamlet to use the ENV source mode which will look for these environment variables when it needs to access AWS.
