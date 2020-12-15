---
sidebar_label: Hello Hamlet
title: Hello Hamlet
---
import Mermaid from '@theme/Mermaid';
import Admonition from 'react-admonitions';

:::caution
The hamlet.io documentation is currently under significant re-development. Existing content is a placeholder and will be updated very soon.
:::

The intention of this guide is to give you an understanding of the hamlet core concepts and how they can be applied when deploying applications and their supporting infrastructure.

The guide works through the deployment of [hamlet hello](https://github.com/codeontap/docker-hello), a simple hello world website built using [Flask](https://www.palletsprojects.com/p/flask/) and hosted in a [docker container](https://hub.docker.com/r/codeontap/hello). To host the application we will use [AWS](https://aws.amazon.com/) and this guide will cover deploying the application itself along with the supporting infrastructure required for the app to run

Let's get started..

## An App

<Mermaid chart={`
    graph LR;
    container[Hello]
`}/>

Here is our widget, it performs a specific function, saying `Hello!`. While it might be part of a bigger application, it still acts as an independent unit. If we run this container locally and access it over http we meet our hello widget and it lets us know where it is

```bash
docker run -p 8000:8000 hamletio/hello
curl http://localhost:8000

{
  "Greeting": "Hello!",
  "Location": "nowhere"
}
```

Oh! It's currently nowhere lets update the runtime configuration of the app so that it knows where its saying hello from

```bash
docker run -p 8000:8000 -e LOCATION=world hamletio/hello

curl http://localhost:8000
{
  "Greeting": "Hello!",
  "Location": "world"
}
```

## A Component

So we've seen our widget and what it does when we run it locally, now we want to to make this widget available as pat of our application. In hamlet this widget, a specific function performed in your application is called a **component**, they form the basis of deploying infrastructure within hamlet.

Components have a **type** which defines the infrastructure required to provide this function. For hosting containers we have two types available:
- **service** which uses a container orchestrator (kubernetes, AWS ECS etc.) to ensure the container is always running, and
- **task** which run on demand, complete a specific task and then exit.

We want to say `Hello!` all the time so we will make the type of this component a **service**.

Hamlet provides a library of standard components which are designed to work with other components and deploy to multiple cloud providers. You can also provide your own component types and define their deployment to other providers as well. Each component type has its own configuration that defines how this component should behave. Memory and cpu allocation, exposed network ports and connections to load balancers are all parts of the component configuration

Here is the the initial configuration for our service. It has a single container in the service, hello, that has a fixed memory and cpu allocation.

```json
{
    "Components" : {
        "hello" : {
            "service" : {
                "Containers" : {
                    "hello" : {
                        "Cpu" : "64",
                        "MaximumMemory" : "64",
                        "MemoryReservation" : "64",
                    }
                }
            }
        }
    }
}
```

## Component Reuse

If we wanted to say `Hello!` from multiple locations we would need to deploy multiple widgets and update the location for each one. Our component is performing the same function with different run time configuration to provide different features.
In hamlet we can specify **instances** which can optionally have **versions** of our components. This allows us to override specific properties for a given instance or version while inheriting the rest from the component configuration.

A given instance and version of a component is called an **occurrence**.

<Mermaid chart={`
    graph LR;
    container[Hello <br> Component]
    instanceEarth((Earth <br> Instance))
    versionEarth1((v1 <br> Version))
    instanceMars((Mars <br> Instance))
    container -.- instanceEarth
    container -.- instanceMars
    subgraph Earth v1 Occurrence
    instanceEarth -.- versionEarth1
    end
    subgraph Mars Occurrence
    instanceMars
    end
`}/>

We've configured one instance of this component to start with called `world`


## A link

In an application, we don't just deploy one component, we deploy a collection of components which work together to provide a specific purpose, in hamlet this collection is called a **Solution**.

<Mermaid chart={`
    graph LR;
    loadbalancer{{ Hello-LB <br> Load Balancer }}
    loadbalancer --- containerA
    loadbalancer --- containerB
    subgraph Hello Service
    containerA[ A ]
    containerB[ B ]
    end
`}/>

To create this relationship in hamlet we create a link between components. In this case, from the `Hello` component to the `Hello-LB` component. When we deploy this infrastructure the container will be configured to register with the load balancer which will send traffic to either copy of the `Hello` Service.
