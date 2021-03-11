---
sidebar_label: workspace
title: Setting Up a Workspace
---
import Admonition from 'react-admonitions';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';


This brief guide will walk you through the setup of a simple Hamlet Deploy development workspace. 

Other Learn guides will assume the use of this common workspace.

## Requirements

A basic understanding of working on the command-line is sufficient to follow along with Learn guides. The Docker container we are going to be using built upon [Debian](https://www.debian.org) operating system. All commands will be provided throughout, however you will benefit from understanding how to perform common administrative tasks in a terminal such as directory navigation and creating new files or directories.

The only software requirement for the setup of the develpment workspace is that Docker is installed and that you have network access to download local container images from DockerHub.

[Get Docker](https://docs.docker.com/get-docker/)

## Installing Hamlet Deploy

The simplest and most common way to use Hamlet Deploy is by using the official Docker container. With Docker now installed we can open a terminal window and use the Docker command-line interface (CLI) to download the container image from DockerHub.

First, double-check that Docker is running. If you don't get a response from the following command, you'll need to start Docker before continuing.

```bash
docker --version
```

With Docker running, lets pull down the _hamlet_ container image from the _hamletio_ organsation on DockerHub.

```bash
docker pull hamletio/hamlet
```

We'll want a directory on our local machine that can be used to store all of our work so lets make one now.

First, in your local terminal change into a directory that works for you you and then make a new directory for Hamlet Deploy.

```bash
## change directory into the home directory
cd ~

## create a new directory
mkdir ./hamletdeploy
```

## Launching the Workspace

We're now ready to start our workspace.

Each time you would like to return to this workspace you will just need to run the following Docker CLI command inside of a terminal window.

This will start an interactive terminal inside of the _hamletio/hamlet_ container, and make the _hamletdeploy_ directory available in the container.

```bash
docker run -it --volume ~/hamletdeploy:/home/hamlet/cmdb hamletio/hamlet

hamlet @ ~/cmdb
└─ $
```

_Outside of the container_ you can open an IDE or code-editor of choice and access your _~/hamletdeploy_ directory. Any changes you make here will be reflected inside of the container at the path `/home/hamlet/cmdb`.

_Inside of the container_ in the terminal session, you will now have access to the installed Hamlet Deploy command-line interface.

By configuring a development workspace like this you will now be able to use a code-editor or IDE of choice from your host machine whilst performing Hamlet Deploy actions against them inside of the container from the terminal session.

Lets quickly test everything is working as expected. 

Open up a second terminal window - this one wont be inside the container.

Navigate into the _~/hamletdeploy_ directory and create a test file called _text.txt_

```bash
cd ~/hamletdeploy
echo "testing" > test.txt
```

Now back in the container's terminal session, check that you can see the new file.

```bash
## ls - list information in the current directory
ls

test.txt
```

You are all ready to get started. Once you're finished with a session you can just close the terminal.

## Updating the Workspace

Over time you may wish to update your workspace with the latest version of Hamlet Deploy.

Downloading the latest version of the Hamlet Deploy container image and re-starting your terminal session is all that you need to do.

```bash
docker pull hamletio/hamlet
```

With the latest image downloaded, the Docker CLI will run your workspace using it instead of the previous container image.
