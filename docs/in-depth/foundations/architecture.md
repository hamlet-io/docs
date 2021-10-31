---
sidebar_label: Architecture
title: hamlet Architecture
---

hamlet is comprised of two major parts - the `Engine` and the `Executor`. It is designed to be both modular and plug-able, so that additional cloud providers or capablities may be easily added and common deployment patterns may be shared.

## hamlet Engine

The `Engine` compiles the `Solution` and evaluates it based on instructions it receives from the `Executor`. For tasks that involve outputs the `Engine` will initially create a list of tasks for the `Executor` called a `Contract`. Tasks may require further invocations of the `Engine` to perform more specific workloads against the `Solution`.

## Engine Providers

`Providers` expose new integrations with a `Solution`. Some `Providers` enable cloud infrastructure template generation capabilities, whilst others enable testing, documentation and more. The `Engine` itself contains the "Shared" `Provider`, which is used to define common `Components` and other data types which `Providers` can optionally use.

## hamlet Executor

The hamlet `Executor` establishes the context of the current runtime environment (known as the Execution Environment) from environment variables and command-line options and translates them into instructions for the `Engine`.

The `Executor` can initiate tasks, such as:

* Establish the context of the execution environment, including validation of mandatory environment variables
* Invoke the `Engine` to manipulate the `Solution` based on the current context. Examples of this include:
  * Create a `Contract`
  * Invoke an `Entrance`
* Undertake a deployment to a cloud provider using generated templates
* Querying a `Solution` using both pre-defined queries and JMESpath expressions
* Test-case execution & reporting

## Build Environment

The `Build Environment` is a subset of the Execution Environment used to build and manage code artefacts. The configuration of the Build Environment is unique in that it must contain information pertaining to source-code repositories and appropriate credentials to access them.

## Clients

A "client" is anyone or anything that may invoke the `Executor`, and includes individual users as well as CI/CD services.
