---
sidebar_label: Occurrence
title: Occurrence
---
:::caution
The hamlet.io documentation is currently under significant re-development. Existing content is a placeholder and will be updated very soon.
:::

* the Occurrence is a current Component’s deployment unit configuration as it exists within the context model (link)
* It is the runtime state of the Component
* An occurrence may contain sub occurrences, which reflect the same for each child subcomponent
* The occurrence heavily informs setup routines (link) logic for components.

## Occurrence Sections

### Core

Contains key identity information gathered on the deployment-unit

### State

The occurrence state contains the resultant object from a components state routine (link to state routine reference)

### Configuration

The configuration subsection contains information sourced from the

### Solution

A composite object of component attributes in the solution and a filtered view of the context

### Settings

Contains the discovered “Build”, “Account” and “Product” level settings from the CMDB

### Environment

Contains the discovered “Build”, “General” and “Sensitive” settings from the CMDB scoped to the environment of the occurrence

### Occurrences

* contains the suboccurrences for each subcomponent on the parent
* Individual sub-occurrence structure matches that of the occurrence - each contains “core”, “state” and “configuration” objects.

```json
// example  partial context model /w occurrence highlighted to emphasise it's relationship
```
