---
slug: /
sidebar_label: Welcome
title: Welcome to Hamlet
---

hamlet is an opinionated devops platform that provides an enterprise focused CICD pipeline based on the infrastructure as code methodology

## What's in the box

hamlet provides a collection of tools to support Continuous Integration and Deployment. They are divided into:

### Infrastructure Deployment

hamlet provides a collection of simplified, best practice, modular components which you can use to build your application hosting solution. The components are based on templates designed to work with multiple cloud providers while still maintaining the best practices and features the specific providers offer. The components share contextual information between different components within the solution through the use of links which highlight the relationships between the components in your solution.

For example linking a container component to an database component will provide the container with the SQL connection strings required to connect to the database as environment variables. This contextual sharing between components also extends to security functions, linking a Lambda function to an API gateway will give the api gateway the permission to call the lambda function.

### Code Build Test and Deploy

Along with provisioning your infrastructure, hamlet also includes a suite of utilities to build, test, and deploy your code including release management to control when code is deployed to your environments. Integration with Jenkins provides a familiar and centralised endpoint to manage the deployment process from start to finish.

## How does it work

The core of hamlet is the Configuration Management Database, CMDB. This is a file based database stored in a git repository which contains both the configuration and state of your hamlet tenancy. Unlike traditional CMDBs which are generally maintained after a deployment has been completed, the hamlet CMDB is used to define what you need to deploy. Without an entry in the CMDB your solution will not be deployed.

The structure of the CMDB is based on series of files and folders which create a tree like structure that defines your environment. These files are merged at runtime to generate a consolidated blueprint. The blueprint is used by the Infrastructure Deployment process to generate the infrastructure templates required to deploy your solution. This tree like approach allows you to scale your CMDB to suit your requirements. You can start with a centralised CMDB which describes your entire hamlet Tenancy or break it up into smaller pieces to align with business areas or product owners. You just need to name the folders to outline the tree structure and hamlet will assemble these for you.

## How do I use it

Get started with Hamlet with our hands-on [getting started](getting-started/) guides, or learn more about Hamlet with our [Foundations documentation.](in-depth/foundations/anatomy)
