---
sidebar_label: Mscros & Functions
title: Shared Macros & Functions
---

This page details the commonly used macros and functions that are implemented within the shared provider and provides additional context where necessary. They are recommended for use across providers wherever possible

## Settings: Functions & Macros

### addSettings

* combines the specified settings object into the global variable  `settingsObject`

### asFlattenedSettings

* restructure an object of unknown depth into single-depth object by concatenating the paths to each settings value with `formatSettingName`

### formatSettingName

* concatenates a series of name-parts - usually capitalised - joined with underscores
  * This is the convention for setting names

### getFirstSetting

* attempts to find a setting name using arrays of string names
  * formats a setting name out of each set and checks for its existance
  * used for checking for the existence of settings, often using setting scopes as parts of the setting names
* returns the first found
* searches in decreasing order of specificity

### getSettingAsEnvironment

* Converts the a provided collection of settings into environment variable format
* Nested keys are merged into a single key in uppercase with _ between key names
* All values are converted to strings (including list and collection types)

## Outputs: Functions & Macros

### addToDefaultJsonOutput

* *adds* the provided content into the default output object

### mergeWithDefaultJsonOutput

* *merges* the provided content into the default output object

### addGenerationContractStepOutputMapping

* adds a new Output  Mapping definition to the Generation Contract Step (link)

  ```freemarker
  [@addGenerationContractStepOutputMapping
      provider=EXAMPLE_PROVIDER
      subset="examplesubset"
      outputType=EXAMPLE_DEFAULT_OUTPUT_TYPE
      outputFormat="bash"
      outputSuffix="example.sh"
  /]
  ```
