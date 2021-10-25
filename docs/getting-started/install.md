---
sidebar_label: Installing hamlet
title: Installing hamlet
---

import Tabs from '@theme/Tabs'
import TabItem from '@theme/TabItem'

hamlet is made up of two key parts:

- **engine** looks after generating contracts that describe what you want to do, e.g. create infrastructure, draw diagrams, find the hostname of a deployment etc. This is built on Java using the [apache freemarker](https://freemarker.apache.org/) template engine.
- **executor** runs the contracts from the engine and provides the user interface to the engine. We have two executors which work together, a bash based backend along with a Python based CLI.

The CLI manages the installation of the required parts once it has been installed, but we do have some extra dependencies. This task will take you through the process of installing these dependencies. Here we've included some standard environments and included a description of what's required.

## Getting Everything Installed

<Tabs
  defaultValue="docker"
  values={[
    {label: 'Docker', value: 'docker'},
    {label: 'Ubuntu/Windows WSL2', value: 'ubuntu'},
    {label: 'MacOS', value: 'macos'},
    {label: 'General', value: 'general'},
  ]}
>

<TabItem value="docker">

Docker provides a container based workflow to isolate hamlet and its dependencies. We provide a general purpose container environment with hamlet installed and it includes a number of tools and packages to set up a general purpose application build container for Continuous Integration.

1. Install docker for your operating system using the official Docker guide here https://docs.docker.com/get-docker/
1. double-check that Docker is running. If you don't get a response from the following command, you'll need to start Docker before continuing.

  ```console
  docker info
  ```

1. Once Docker is running, pull down the hamletio/hamlet container to your local desktop.

  ```console
  docker pull hamletio/hamlet
  ```

1. Docker storage is removed after the container stops, so we'll want a directory on our local machine that can be used to store all of our work. Let's make one now. In your local terminal change into a directory that works for you ( e.g. ~/hamlet ) and then make a new directory for your hamlet work.

  ```bash
  ## create a new directory
  mkdir -p ~/hamlet
  ```

1. Start an interactive terminal inside of the _hamletio/hamlet_ container and make the _hamletdeploy_ directory available in the container.

  :::info
  Each time you would like to return to this workspace you will just need to run the following Docker CLI command inside of a terminal window
  :::

  ```console
  docker run -it --volume ~/hamlet:/home/hamlet/cmdb hamletio/hamlet
  ```

  ```console
  hamlet @ ~/cmdb
  └─ $
  ```

  _Outside of the container_ you can open an IDE or code-editor of choice and access your _~/hamlet_ directory. Any changes you make here will be reflected inside of the container at the path `/home/hamlet/cmdb`

  _Inside of the container_ in the terminal session, you will now have access to the hamlet CLI and the rest of the packages used to run hamlet.

1. To check that everything is working as expected open up a second terminal window - this one won't be inside the container.

Navigate into the _~/hamlet_ directory and create a test file called _text.txt_

```console
cd ~/hamlet
echo "testing" > test.txt
```

Now back in the container's terminal session check that you can see the new file.

```console
## ls - list information in the current directory
ls
```

```console
test.txt
```

</TabItem>

<TabItem value="ubuntu">

This process covers the installation of the required packages for running hamlet on an ubuntu based instance.
We used `Ubuntu 20.04` when creating this guide. Other versions might be a bit different but we hope to give you enough information to point you in the right direction.

This process should also work on Windows Subsystem for Linux if you are running on a Windows based PC.

:::info
This will require the installation of system level packages so you will need root level access to install permissions

Using sudo is generally the best way to do this instead of running everything as root
:::

1. Run the following to install the required packages.

  ```console
  apt-get update && apt-get install openjdk-8-jdk jq zip unzip graphviz python3 python3-pip docker
  ```

  When prompted, confirm the installation and make sure the packages you are installing are suitable for the machine you are running on.

1. After the OS packages are installed run the following to install the python based packages.

  ```console
  pip install hamlet awscli az diagrams
  ```

  This will install the CLI tools that we use to run hamlet along with some extra tools like the cloud provider CLI tools.

1. Start the Docker service so that we can use it to manage images that we build and push using hamlet.

  ```console
  systemctl enable --now docker
  ```

1. Confirm that Docker is running with the following:

  ```console
  docker ps
  ```

  The console should show an empty list of Docker containers. If you get an error the service hasn't started up.

</TabItem>

<TabItem value="macos">

For MacOS instances we recommended setting up the required dependencies using [HomeBrew](https://brew.sh/) which is a great package manager for MacOS and takes a lot of hassle out of setting things up.

1. If you haven't got Homebrew installed, head over to the [Homebrew docs page](https://brew.sh/) and follow the instructions to get Homebrew running.

1. Once you have Homebrew installed run the following commands to install the base packages.

  ```console
  brew update
  brew install openjdk@8 jq bash graphviz
  ```

1. Install Python using pyenv

  :::info
  We recommend using pyenv to manage your Python installations. This keeps your changes isolated from the default macOS Python.
  If you prefer to manage Python yourself then you'll need to make sure that at least Python 3.6 is available along with pip
  :::

  Head over to the pyenv installation guide https://github.com/pyenv/pyenv#installation and follow the macOS guide to installing pyenv.

  It will be something like:

  ```console
  # install through homebrew
  brew update
  brew install pyenv

  # update your bash shell startup process
  echo 'export PYENV_ROOT="$HOME/.pyenv"' >> ~/.profile
  echo 'export PATH="$PYENV_ROOT/bin:$PATH"' >> ~/.profile
  echo 'eval "$(pyenv init --path)"' >> ~/.profile

  # Add pyenv into your shell
  echo 'eval "$(pyenv init -)"' >> ~/.bashrc

  # Install a Python version
  pyenv install 3.8.11
  ```

  :::info
  Since hamlet uses bash itself we recommend using bash when calling hamlet to keep things consistent.

  This isn't required if you prefer the macOS default zsh shell
  :::

1. Once you have Python installed you can then install the Python packages.

  ```console
  pip install hamlet awscli az diagrams
  ```

</TabItem>

<TabItem value="general">

This section covers the general requirements and outlines what has been covered in the other tabs and can be used if you have different requirements from what's covered above.

Read through the install links below and ensure that each of the installed parts is available on your PATH.

| Name     | Install Link                                 | Version                  | Purpose                  |
|----------|----------------------------------------------|--------------------------|--------------------------|
| Python   | https://www.python.org/about/gettingstarted/ | 3.6 and above            |                          |
| pip      | https://packaging.python.org/tutorials/installing-packages/ | latest    | Python packages          |
| Java     | https://openjdk.java.net/install/            | 8 (1.8) required         |                          |
| Jq       | https://stedolan.github.io/jq/               | 1.6 and above            |                          |
| Bash     | https://www.gnu.org/software/bash/           | 4.0 and above            |                          |
| Docker   | https://www.docker.com/get-started           | No specific requirements | Container deployments    |
| AWS Cli  | https://aws.amazon.com/cli/                  | v1 currently supported   | AWS deployments          |
| Az       | https://docs.microsoft.com/en-us/cli/azure/  | No specific requirements | Azure deployments        |
| Graphviz | https://graphviz.org/                        | No specific requirements | Diagram generation       |

Once you have the required packages installed you can install hamlet.
```console
pip install hamlet
```

</TabItem>

</Tabs>

## Confirm your setup

Now that we have hamlet installed we should confirm that everything is working as expected with a couple of tests.

1. Make sure hamlet is installed and available from your shell. In a terminal window run:

  ```console
  hamlet --version
  ```

  This will return the version of hamlet you have installed.

  ```console
  hamlet, version 9.3.0
  ```

1. We now want to test that the individual parts of hamlet are working as expected.

  Run the following command:

  ```console
  hamlet entrance list-entrances
  ```

  You should now see the following output which confirms that hamlet is available and that it can call the engine.

  ```console
    [*] no default engine set using train
    ╒════╤════════════════╤════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╕
    │    │ Type           │ Description                                                                                                                    │
    ╞════╪════════════════╪════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╡
    │  0 │ blueprint      │ Provides a detailed representation of everything in a given segment, this includes its parent, environment, product and tenant │
    ├────┼────────────────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
    │  1 │ buildblueprint │ Provides a given deployment unit's occurrences and their suboccurrences                                                         │
    ├────┼────────────────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
    │  2 │ deployment     │ Generates the required documents to deploy a given deployment unit / deployment group combination                              │
    ├────┼────────────────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
    │  3 │ deploymenttest │ Generates the required documents to deploy a given deployment unit / deployment group combination                              │
    ├────┼────────────────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
    │  4 │ info           │ Provides details on the hamlet engine and the avaiable entrances                                                               │
    ├────┼────────────────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
    │  5 │ loader         │ Generates a set of loader contracts which can be used to set up hamlet                                                          │
    ├────┼────────────────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
    │  6 │ occurrences    │ Provides the state of all occurrences within a district                                                                        │
    ├────┼────────────────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
    │  7 │ releaseinfo    │ Provides information for release management tasks performed by executors                                                       │
    ├────┼────────────────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
    │  8 │ schema         │ Provides JSON schema representations of input configuration                                                                     │
    ├────┼────────────────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
    │  9 │ schemaset      │ Generates Schema Contracts that are used to generate all JSONSchema files by their data type.                                  │
    ├────┼────────────────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
    │ 10 │ unitlist       │ Provides details on all deployment unit | deployment group combinations                                                        │
    ├────┼────────────────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
    │ 11 │ validate       │ Performs validation of the current Blueprint Object                                                                            │
    ╘════╧════════════════╧════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╛
  ```

This will:

- check to see if you have an engine installed
- if not, install it and configure the engine for the CLI
- query the engine for entrances that the engine knows about.

We will get into entrances later on, this is just to make sure all the parts are set up.

Now that we have hamlet installed and ready to go we can create our first CMDB.
