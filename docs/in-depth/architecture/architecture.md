---
sidebar_label: Architecture
title: hamlet Architecture
---

hamlet is comprised of two major parts - the engine and the executor. It is designed to be both modular and plug-able, so that additional cloud providers or capabilities may be easily added and common deployment patterns shared.

## Engine

The Engine compiles the solution and evaluates it based on instructions it receives from the executor. For tasks that involve outputs the engine will initially create a list of tasks for the executor called a contract. Tasks may require further invocations of the engine to perform more specific workloads against the solution.

## Plugins

Plugins extend the engine to expose new integrations with a Solution. Some plugins enable cloud infrastructure template generation capabilities, whilst others enable testing, documentation and more. The engine itself contains the "shared" plugin, which defines common components and other data types which other plugins can use.

## Executors

A hamlet executor establishes the context of the current runtime environment (known as the execution environment) from environment variables and command-line options and translates them into instructions for the engine.

The executor can initiate tasks, such as:

* Establish the context of the execution environment, including validation of mandatory environment variables
* Invoke the engine to manipulate the solution based on the current context. Examples of this include:
  * Create a contract
  * Invoke an entrance
* Undertake a deployment to a cloud provider using generated templates
* Querying a solution using both pre-defined queries and JMESpath expressions
* Test-case execution & reporting
