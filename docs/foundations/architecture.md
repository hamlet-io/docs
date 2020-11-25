---
sidebar_label: architecture
title: Hamlet Architecture
---
import Admonition from 'react-admonitions';

Hamlet is comprised of two major parts - the `Engine` and the `Executor`. It is designed to be both modular and plug-able, so that additional cloud providers or capablities may be easily added and common deployment patterns may be shared.

# Hamlet Engine

The `Engine` is responsible for compiling a `Solution` from all applicable input sources. Actions such as generating outputs and querying the `Solution` are undertaken by the `Engine`. The `Engine` is unable to operate on its own and requires instructions - these are received from the `Executor`.

# Engine Providers

`Providers` expose new integrations with a `Solution`. Some `Providers` enable cloud infrastructure template generation capabilities, whilst others enable testing, documentation and more. The `Engine` itself contains the "Shared" `Provider`, which is used to define common `Components` and other data types which `Providers` can optionally use.

# Hamlet Executor
The Hamlet `Executor` establishes the context of the current runtime environment (known as the Execution Environment) from environment variables and command-line options and translates them into instructions for the `Engine`.

The `Executor` can currently be invoked in two separate ways - bash and python.

## Bash
The bash executor is comprised of a series of bash scripts that are used to undertake hamlet workloads. Such scripts perform tasks such as:

* Establish the context of the execution environment, including validation of mandatory environment variables
* Invoke the `Engine` to manipulate the `Solution` based on the current context. Examples of this include:
    * Create a `Contract`
    * Invoke an `Entrance`
* Undertake a deployment to a cloud provider using generated templates

## Python
The python executor is a CLI wrapper around the bash executor, providing a common interface with the Hamlet `Executor`. The python executor also adds the following capabilities that are not available through the bash executor:

* Querying the `Solution` using both pre-defined queries and JMESpath expressions
* Test-case execution & reporting

## Build Environment
The `Build Environment` is a subset of the Execution Environment used to build and manage code artefacts. The configuration of the Build Environment is unique in that it must contain information pertaining to source-code repositories and appropriate credentials to access them.

## Clients
A "client" is anyone or anything that may invoke the `Executor`, and includes individual users as well as CI/CD services.