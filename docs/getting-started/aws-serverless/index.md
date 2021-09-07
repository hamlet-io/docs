---
sidebar_label: Introduction
title: AWS Serverless App Deployment
slug: /getting-started/aws-serverless/
---

This guides takes you through the deployment of an application on AWS using hamlet and a range of AWS services

:::caution
While we have tried to minimise the cost of the services we selected in this guide there will still be costs incurred running this guide
Please make sure to clean up any resources created during the guide

At any time through these guides to clean-up what has been deployed run

```bash
hamlet deploy run-deployments -d account -d segment --no-refresh-outputs -m stop
```

:::

## What are we building?

The app we are going to build through the guide is the Hello Everywhere app. It is made up of an API which is configured to say hello from various locations and a web front end to display the Hello API results.

This isn't the most useful application but we wanted to focus on how we manage the deployment of the infrastructure required to host it.

## What do I need?

The guide will take you through setting up what is required but before getting into the guide here are a couple of requirements that are worth looking at first.

- You will need an active AWS account and Administrative access to this account. If you don't have an account head to [AWS](https://aws.amazon.com/) to signup and create an account. New accounts have an extended free tier for the first year to reduce your costs and get your started.
- In this account you will need an IAM user that has Administrative access. If you haven't done this before [Create your first IAM user](https://docs.aws.amazon.com/IAM/latest/UserGuide/getting-started_create-admin-group.html) with administrative access to the account. You will need the AWS_SECRET_ACCESS_KEY and AWS_ACCESS_KEY_ID in order for hamlet to deploy your infrastructure.
- Having docker installed and running will be required to complete some of the deployment steps. If you haven't worked with docker before,  head to the [getting started](https://docs.docker.com/get-started/) guide for what docker is and how it works

## AWS Credential Setup

Hamlet uses the [awscli](https://aws.amazon.com/cli/) to access your AWS account and this comes with a collection of different ways to login to your account. Hamlet supports most of these and integrates with them to make it easier to deal with multiple AWS accounts

The easiest approach is to use the standard CLI environment variables. To use this you will an Access Key/Secret Key pair for a user that has administrative access to your AWS account. Once you have these set them as environment variables in the shell that you will be use to run your hamlet commands

```bash
export AWS_ACCESS_KEY_ID=<Access Key>
export AWS_SECRET_ACCESS_KEY=<Secret Key>
```

After you have set these we need to tell hamlet to use them

```bash
export HAMLET_AWS_AUTH_SOURCE=ENV
```

This tells hamlet to use the ENV source mode which will look for these environment variables when it needs to access AWS
