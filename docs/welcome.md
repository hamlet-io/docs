---
slug: /
sidebar_label: Welcome
title: Welcome to hamlet
---

hamlet is an opinionated cloud deployment platform focused on policies, patterns and standard components.

### Infrastructure Deployment

hamlet provides simplified, best practice, modular components you can use to build your application hosting solution. The components are based on templates designed to work with multiple cloud providers while still maintaining the best practices and features from these providers offer. The components share contextual information between components through the use of links which define their relationships.

For example, linking a lambda component to a database component will provide the lambda function with the SQL connection strings required to connect to the database. This contextual sharing between components also extends to security, linking a Lambda function to an API gateway will give the api gateway the permission to call the lambda function.

## How does it work

The core of hamlet is the Configuration Management Database, CMDB. This is a file based structure containing the configuration and state of your hamlet deployments. Unlike traditional CMDBs which are generally maintained after a deployment has been completed, the hamlet CMDB is used to define what you need to deploy.

The structure of the CMDB is based on a tree like structure that defines your tenancy. The files are merged at runtime to generate a consolidated blueprint. The blueprint is used to generate the outputs required to deploy your solution. This tree like approach allows you to scale your CMDB to suit your requirements. You start with a centralised CMDB which describes your entire hamlet Tenancy then break it up into smaller pieces to align with business areas or product owners.

## How do I use it

Get started with our hands-on [getting started](getting-started/) guide, or learn more about hamlet with our [Foundations documentation.](in-depth/foundations/anatomy)
