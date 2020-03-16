---
sidebar_label: development environment
title: Development Environment
---
import Admonition from 'react-admonitions';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Where possible you are encouraged to undertake all your work from the [official hamlet docker image](https://hub.docker.com/repository/docker/hamletio/hamlet), however if you happen to be developing something for the core parts of hamlet, you will want to have a local development environment setup.

This guide will get you up and running with all of the repositories in their expected locations.

## Pre-Requisites
- [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
- [hub](https://github.com/github/hub#installation) (required for the scripted install below)
- [Cookie Cutter](https://github.com/cookiecutter/cookiecutter/blob/master/docs/installation.rst)
- [Docker](https://docs.docker.com/install/) (required for working locally with the docker repo)

## Scripted Install
 If you just want to get setup right away, the following bash script will get you up and running. This clones and forks all the official repos by default. It is **strongly** recommended that if you do not use the scripted guide, that you mimic the directory structure and naming conventions used in it anyway. If you do not, then you will have to define every environment variable listed below to their corresponding directory. Using both the scripted install or the docker container handles all of this for you.****

<Admonition type="warning" title="Github Forks Ahead">
    The scripted install will fork each of the hamlet repos into your github account. If you don't wish to do this, you will need to fork the repositories manually. If you have previously made forks of these repo's and are just setting up a new local environment, github will use the existing forks.
</Admonition>

<Admonition type="tip" title="Github Login">
    You may be asked during the installation to login to your github account. This inforomation is used only by the `git` and `hub` CLI tools.
</Admonition>

<Tabs
    defaultValue="bash"
    values={[
        {label: 'bash', value: 'bash'},
    ]
}>
<TabItem value='bash'>

```bash
# Clones a repo, forks it into your github account
# Creates git remote for hamlet-io/<repo> as "upstream"
# creates git remote for <you>/<repo> as "origin"
function setupFork() {
    local repo=${1}; shift
    local directory=${1}; shift

    # clone the hamlet-io repo
    git clone $repo ${directory}
    cd ${directory}

    # fork the repo
    hub fork --remote-name=origin
    cd ..
}

# create a project directory, with a
# placeholder for your CMDBs.
mkdir -p hamlet/cmdb
cd hamlet

# setup mandatory repos: 
#   engine
#   executor-bash
#   executor-python
#   executor-cookiecutter
mkdir -p engine
cd engine
setupFork "https://github.com/hamlet-io/engine.git" "core"
cd ..
setupFork "https://github.com/hamlet-io/executor-bash.git" "executor"
setupFork "https://github.com/hamlet-io/cloudinit-aws.git" "startup"

# setup official plugins
#   AWS engine plugin
#   Azure engine plugin
mkdir -p engine/plugins
cd engine/plugins
setupFork "https://github.com/hamlet-io/engine-plugin-aws.git" "aws"
setupFork "https://github.com/hamlet-io/engine-plugin-azure.git" "azure"
cd ../..

mkdir -p executor/plugins
cd executor/plugins
setupFork "https://github.com/hamlet-io/executor-python.git" "python"
setupFork "https://github.com/hamlet-io/executor-cookiecutter.git" "cookiecutter"
cd ../..

# Set necessary environment variables
export GENERATION_BASE_DIR=$(pwd)/executor
export GENERATION_DIR=${GENERATION_BASE_DIR}/cli
export GENERATION_ENGINE_DIR=$(pwd)/engine/core
export GENERATION_PLUGIN_DIRS="$(pwd)/engine/plugins/aws;$(pwd)/engine/plugins/azure"
export GENERATION_STARTUP_DIR=$(pwd)/startup
export AUTOMATION_BASE_DIR=$(pwd)/executor/automation
export AUTOMATION_DIR=${AUTOMATION_BASE_DIR}/jenkins/aws

# view structure
tree -d -L 2
```

</TabItem>
</Tabs>

## Non-Essential Installs

The following will install the non-core hamlet repositories: 
- the docker container repository
- the docs repository

These repositories are not location-dependent, but to keep things together they are typically installed inside our project directory anyway.

<Tabs
    defaultValue="bash"
    values={[
        {label: 'bash', value: 'bash'},
    ]
}>
<TabItem value='bash'>

```bash
# Clones a repo, forks it into your github account
# Creates git remote for hamlet-io/<repo> as "upstream"
# creates git remote for <you>/<repo> as "origin"
function setupFork() {
    local repo=${1}; shift
    local directory=${1}; shift

    # clone the hamlet-io repo
    git clone $repo ${directory}
    cd ${directory}

    # fork the repo
    hub fork --remote-name=origin
    cd ..
}

# setup hamlet org management repos
# Note: It doesn't matter where these are created,
#       but might as well keep everything together.
#   Docker
#   Docs
#   engine-core
setupFork "https://github.com/hamlet-io/docker-hamlet.git" "docker"
setupFork "https://github.com/hamlet-io/docs.git" "docs"
setupFork "https://github.com/hamlet-io/engine-core.git" "engine-core"

# view structure
tree -d -L 2
```

</TabItem>
</Tabs>

## Directory Structure
Compare the output of `tree -d -L 2` with the structure below:

```text
.
├── cmdb
├── engine
│   ├── core
│   │   ├── bin
│   │   ├── client
│   │   ├── engine
│   │   ├── legacy
│   │   └── providers
│   └── plugins
│       ├── aws
│       └── azure
├── executor
│   ├── automation
│   │   └── jenkins
│   ├── cli
│   │   └── integrator
│   ├── execution
│   └── plugins
│       ├── cookiecutter
│       └── python
└── startup
    ├── bootstrap
    │   └── centos
    └── puppet

```

## Environment Variables

Whether you are using the docker container or your local environment, the following environment variables will need to be set. If you are in the container, they will already be set to the defaults. If your repo structure is not the same as defined in this guide then you will need to pass the `-e <env variable>` flag to the `docker run` command in order to pass updated Environment Variables into the container.

| Env Variable           | Container Default                                               | Corresponding Directory                                                   |
|------------------------|-----------------------------------------------------------------|---------------------------------------------------------------------------|
| GENERATION_BASE_DIR    | /opt/hamlet/executor                                            | the executor-bash repo directory.                                         |
| GENERATION_DIR         | /opt/hamlet/executor/cli                                        | ${GENERATION_BASE_DIR}/cli                                                |
| GENERATION_ENGINE_DIR  | /opt/hamlet/engine/core                                         | the engine-core repo directory.                                           |
| GENERATION_PLUGIN_DIRS | /opt/hamlet/engine/plugins/aws;/opt/hamlet/engine/plugins/azure | a semicolon-delimited list of plugin directories.                         |
| GENERATION_STARTUP_DIR | /opt/hamlet/startup                                             | the cloudinit-aws repo directory.                                         |
| AUTOMATION_BASE_DIR    | /opt/hamlet/executor/automation                                 | the 'automation' directory within the executor-bash repo.                 |
| AUTOMATION_DIR         | /opt/hamlet/executor/automation/jenkins/aws                     | the '/automation/jenkins/aws' directory inside of the executor-bash repo. |

## CMDB's and a Container Alias
Again, to keep everything together it is recommended that any CMDB's you use for testing or otherwise are created inside this directory. You might have noticed that in the scripted install too.

Knowing exactly where the CMDB is always going to be is useful, because now we can set an alias for running the docker container that volume-mounts the CMDB directory into the container. We've just set up a local working repository for you but it's still recommended that in most cases you work from the container image so lets make that nice and easy now.

<Admonition type="warning" title="Path Required">
    Don't forget to update the path variable in the script below to your hamlet project directory.
</Admonition>

<Tabs
    defaultValue="bash"
    values={[
        {label: 'bash', value: 'bash'},
    ]
}>
<TabItem value='bash'>

```bash
# Path to your hamlet project directory
path = ''

alias hamletgo="cd ${path} && docker run --it --rm -v $(pwd)/cmdb:/hamlet/cmdb -v $(pwd):/opt/hamlet hamletio/hamlet:latest"

# source the ~.bashrc file
source ~/.bashrc
```

</TabItem>
</Tabs>