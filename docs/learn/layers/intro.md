---
sidebar_label: overview
title: Hamlet Layers
---

import Admonition from 'react-admonitions';


As an organisation grows more and more people want to have a say in the way that things are done. It's alright for them to talk the talk, but we know who the actual implementation of it all is going to fall down to - the engineers. 

Managing all of these requirements, together with their conflicts and edge cases is very challenging. Hamlet was designed to address this challenge.

## A Layer-ed Approach

Hamlet captures a wholistic view of an organsations requirements, and applies each one across its entire scope. A particular security policy may be applied for just a single product, or across the entire organsation. The implementation of that policy is the same either way, and in both cases it is only implemented the once - but the layer at which it is defined ensures it will apply across the scope it is intended.

There are 6 layer types available in Hamlet, each representing a unique configuration scope

- Tenant
- Account
- Product
- Solution
- Environment
- Segment

In the following sections we will walk through each one, exploring how they work together.

By the end of of this tutorial you will have sufficient experience to create your own Hamlet CMDB's and begin working in Hamlet.

:::note
The following tutorials presume that you are operating inside of the Hamlet docker container.

```
docker pull hamletio/hamlet:latest
```
:::