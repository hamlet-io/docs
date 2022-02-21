---
slug: /
sidebar_label: Welcome
title: Welcome to hamlet
---

hamlet is an opinionated cloud deployment platform focused on policies, patterns and standard components.

### Infrastructure Deployment

hamlet provides simplified, best practice, modular components you can use to build your application hosting solution. The components are based on templates designed to work with multiple cloud providers maintaining the best practices and features these providers offer. The components share contextual information between components through the use of links which define their relationships.

For example, linking a Lambda component to a database component will provide the Lambda function with the SQL connection strings required to connect to the database. This contextual sharing between components also extends to security: linking a Lambda function to an API gateway will give the API gateway the permission to call the Lambda function.

## How does it work

The core of hamlet is the Configuration Management Database, the CMDB. This is a file-based structure containing the configuration and state of your hamlet deployments. Unlike traditional CMDBs which are generally maintained after a deployment has been completed, the hamlet CMDB is used to define what you need to deploy.

The structure of the CMDB is based on a tree-like structure that defines your tenancy. The files are merged at runtime to generate a consolidated blueprint. This blueprint is used to generate the outputs required to deploy your solution. This tree-like approach allows you to scale your CMDB to suit your requirements. You start with a centralised CMDB which describes your entire hamlet tenancy then break it up into smaller pieces to align with business areas or product owners.

## How do I use it

Get started with our hands-on [getting started](getting-started/) guide
