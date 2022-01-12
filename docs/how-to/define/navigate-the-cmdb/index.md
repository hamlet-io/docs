---
sidebar_label: Introduction
title: Navigating the CMDB
slug: /how-to/define/navigate-the-cmdb
---

hamlet enables us to express the varying needs of an organisation in a uniform way. As an organisation changes, we want to be sure that old objectives continue to be met, whilst responding to emerging ones. But managing each of them - together with possible conflicts and edge cases - is particularly challenging. How can we ensure that none of them are forgotten?

hamlet was designed to address this challenge.

:::info
If you haven't already been through the [install guide for hamlet](/getting-started/install) to get your local hamlet environment setup, you should do that before working through this guide.
:::

## A Layered Approach

hamlet captures a holistic view of an organisation's application deployment requirements, and applies them across its entire scope. A particular security policy may be applied for just a single product, or across the entire organisation. The implementation of that policy is the same either way, and in both cases it is only implemented once - but the layer at which it is defined ensures it will apply across the scope it is intended.

There are 6 layer types available in hamlet, each representing a unique configuration scope

- Tenant
- Account
- Product
- Environment
- Segment

In the following sections we will walk through each one, exploring how they work together.

By the end of of this tutorial you will have sufficient experience to navigate hamlet CMDBs and begin working in hamlet.
