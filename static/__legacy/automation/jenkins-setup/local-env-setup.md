---
sidebar_label: local environment setup
title: Local Environment Setup
---
The first thing we need to is create a CMDB, the CMDB is the core of `hamlet` and is used to define your product and how it is deployed. We have a set of predefined templates to get you started

Create a directory that will be used to store the CMDB and change into it

```bash
mkdir ~/msw
cd ~/msw
```

Pull down the [`hamlet` docker image](https://hub.docker.com/r/`hamlet`/gen3/)

```bash
  docker image pull `hamlet`/gen3
```

Run the `hamlet` container as an interactive session. This will provide you with a terminal session with all dependencies installed and ready to go

!!! info
  Your AWS profile might be in a different location

!!! info
  You will need to run docker commands within this container during the setup process. To do this you will need access to your local machines docker socket.

```bash
  docker run -it --rm --volume $(pwd):/var/opt/`hamlet` --volume ~/.aws:/root/.aws --volume /var/run/docker.sock:/var/run/docker.sock `hamlet`/gen3
```

Change into the CMDB directory and create the root marker file ( this file is used to define where the CMDB starts)

```bash
cd /var/opt/`hamlet`
touch ./root.json
```

## Next Step: [Create the CMDB](./cmdb-setup.md)
