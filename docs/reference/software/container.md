---
sidebar_label: container
title: Docker Container
---
import Admonition from 'react-admonitions';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Hamlet Deploy is published as a Docker container on Docker Hub under the **hamletio** organisation.

```bash
docker pull hamletio/hamlet
```

## Images

The following container images are available

### hamletio/hamlet

A standard Hamlet Deploy installation and the recommended image for typical use-cases.

### hamletio/jenkins

A [Jenkins](https://www.jenkins.io) installation alongside Hamlet Deploy.

### hamletio/hello

A Basic "Hello World" application used in the [Hello Hamlet tutorial](../../hello/hamlet).