---
sidebar_label: Hello Status API
title: Hello Status API
---

This guide works through the deployment of [hamlet hello](https://github.com/hamlet-io/docs-support/tree/master/hello_world_api), a simple hello world API built using [Flask](https://www.palletsprojects.com/p/flask/) and hosted in a [Docker container](https://github.com/hamlet-io/docs-support/pkgs/container/docs-support%2Fhello_world).

This API provides a greeting along with a location. We use this API to build a personal status page in this guide.

:::tip
If you haven't used Docker before head over to the [Docker getting started guide](https://docs.docker.com/get-started/) to install Docker and learn how it works
:::

From your local shell run the following:

```bash
docker run -p 8000:8000 ghcr.io/hamlet-io/docs-support/hello_world:latest
```

This will start the API Docker container and make it available on port 8000

Now let's use curl to see what the API does. From a new terminal window run the following:

```bash
curl http://localhost:8000
```

```bash
{
  "Greeting": "Hello!",
  "Location": "nowhere"
}
```

The API responds with a simple greeting and a location. If we want to set the location we can update an environment variable.

Break the existing Docker run command and replace the Docker run command with:

```bash
docker run -p 8000:8000 -e LOCATION=work ghcr.io/hamlet-io/docs-support/hello_world:latest
```

Now the API is saying hello to the world.

```bash
curl http://localhost:8000
{
  "Greeting": "Hello!",
  "Location": "work"
}
```

## A Component

Let's make the API available as part of our application. To do this a new component will need to be added to our solution.

Components have a type which defines the infrastructure required to provide this function. For hosting containers we have two types available:

- *service* which uses a container orchestrator (kubernetes, AWS ECS etc.) to ensure the container is always running
- *task* which run on demand, complete a specific task and then exit.

This is an API which needs to be available all the time, so we will use the service component.

hamlet provides a library of standard component types which are designed to work with other components and deploy to multiple cloud providers. You can also provide your own component types and define their deployment to other providers. Each component type has its own configuration that defines how this component should behave. Memory and CPU allocation, exposed network ports and connections to load balancers are all parts of the component configuration.

## API Deployment

Now we are going to deploy the service into our existing solution.

:::info
If you haven't already, create a CMDB using the [create CMDB guide](../../create-cmdb.md)
:::

1. Change into the integration default segment directory to set the context.

    ```bash
    # Make sure we are in our CMDB
    cd ~/hamlet_hello/mycmdb

    # Change into the default segment for the integration environment
    cd myapp/config/solutionsv2/integration/default/
    ```

1. Open the segment.json file in this directory using your text editor and add the following:

    :::tip
    The app tier object will already exist if you've worked through the guide in order. If that is the case add the components object from here to the existing tier.
    :::

    ```json
    {
        "Tiers" : {
            "app" : {
                "Components" : {
                    "ecshost" : {
                        "Type" : "ecs",
                        "deployment:Unit" : "ecshost",
                        "Services" : {
                            "helloapi" : {
                                "deployment:Unit" : "helloapi",
                                "Containers" : {
                                    "api": {
                                        "Cpu" : 64,
                                        "MaximumMemory" : 64,
                                        "MemoryReservation" : 64,
                                        "Image": {
                                            "Source": "containerregistry",
                                            "Source:containerregistry": {
                                                "Image": "ghcr.io/hamlet-io/docs-support/hello_world:latest"
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    ```

1. Confirm that the two new deployment units `ecshost` and `helloapi` are available in the deployment list.

    ```bash
    hamlet --account acct01 deploy list-deployments
    ```

    ```terminal
    | Deployment Group   | Deployment Unit   | Provider   | State       | District   |
    |--------------------|-------------------|------------|-------------|------------|
    | segment            | baseline          | aws        | deployed    | segment    |
    | segment            | vpc               | aws        | deployed    | segment    |
    | segment            | igw               | aws        | deployed    | segment    |
    | solution           | ecshost           | aws        | notdeployed | segment    |
    | application        | helloapi          | aws        | notdeployed | segment    |
    ```

1. Run the deployments to get the API up and running.

    :::info
    To deploy the container you will need to have a running Docker installation. Before running the command make sure you have followed the Docker setup guides
    :::

    ```bash
    hamlet --account acct01 deploy run-deployments
    ```

    hamlet will run through all of the deployments and create the resources as required. At the end of the deployment you will have an ECS cluster along with a service running in your AWS account.

## Solution and Components

While the deployment runs let's have a look through the configuration we added.

```json
{
    "Tiers" : {
        "app" : {
            "Components" : {}
        }
    }
}
```

Within hamlet components belong to `Tiers`; they mainly set the network subnet configuration and create a logical group of components which perform a similar purpose to other components. So in this case we've used the app (application) tier.

```json
{
    "ecshost" : {
        "Type" : "ecs",
        "deployment:Unit" : "ecshost"
    }
}
```

This section defines a new component called `ecshost` and it has a type of `ecs`: the second level in the object defines the type. The ecs component type is a container host which provides the base level infrastructure to host containers. The name ecs is a legacy name that aligns with the AWS service ECS.

The component then has an `Instance`.
Instances allow you to create copies of a component which might have some minor configuration changes but you'd like to share as much configuration from a single component as possible.

The `deployment:Unit` parameter. This parameter defines the deployment that this component belongs to. You can put multiple components into the same deployment if you want to. This is useful when you have related components that can all be deployed at the same time.

```json
{
    "Services" : {
        "helloapi" : {
            "deployment:Unit" : "helloapi",
            "Containers" : {
                "api": {
                    "Cpu" : 64,
                    "MaximumMemory" : 64,
                    "MemoryReservation" : 64,
                    "Image": {
                        "Source": "containerregistry",
                        "Source:containerregistry": {
                            "Image": "ghcr.io/hamlet-io/docs-support/hello_world:latest"
                        }
                    }
                }
            }
        }
    }
}
```

The configuration section called `Services` defines subcomponents which belong to the parent ecshost component but also have their own configuration and state independent from the parent.

The containers section then defines the containers required within this service. We've set CPU and memory limits along with an image. hamlet supports images from public container registries, like this one and also supports providing Dockerfiles which hamlet will build and manage the image for. In both cases the image is copied to a local container registry within your account; this ensures that your application doesn't depend on an external service to run the container.

## Next Step

At this stage we can't access our API via HTTP to see where it is saying hello from. The next step is to make it available over the internet with the [load balancer deployment](loadbalancer-deployment).
