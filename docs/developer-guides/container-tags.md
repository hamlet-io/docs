---
sidebar_label: docker images
title: Docker Images and Tags
---
import Admonition from 'react-admonitions';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

There is currently one [official hamlet docker image](https://hub.docker.com/repository/docker/hamletio/hamlet). Each tag associated with it is designed for a different purpose. This document outlines what they are for.

[Dockerfile](https://github.com/hamlet-io/docker-hamlet/tree/master/images)

<Admonition type="tip" title="tags and versions">
    Each of the below tags will have two versions : versioned, and non-versioned which corresponds to the latest version of that tag.

    `hamletio/hamlet:<version>-base`
    `hamletio/hamlet:base`
</Admonition>

### :latest

This tag is designed to be the default tag used by end-users and developers of hamlet, though not for any kind of automated tasks such as builds or CI. It includes a number of hamlet-specific and quality-of-life features that enhance the experience of hamlet.

### :base
Built on top of a Debian buster image, the base tag ontains core operating system dependencies and the hamlet CLI. Designed to be the base for other image builds, not intended for development or end-user interaction.

### :builder
Used for building application code as a part of the hamlet build process. Contains everything required to build and test all [official hamlet applications and plugins](./repository-index.md).

### :builder-meteor
An extension for the 'builder' tag, including [Meteor](https://www.meteor.com/) and a pre-cached package repository for it. 

<Admonition type="warning" title="Requirement">
    This is only supported on buster based images.
</Admonition>

### :jenkins
CI/CD tooling with support for the jenkins. The Jenkins JNLP agent is installed and configured to run as the entrypoint for this image tag. Designed to work with container-based cloud agents.

### :azpipelines
CI/CD tooling with support for Azure Pipelines. Upon running this container image tag, the container downloads and configures the agent specific to the pipeline its called within. It then initialises the listener and becomes available to the pipeline.