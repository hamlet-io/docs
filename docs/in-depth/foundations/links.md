---
sidebar_label: Links
title: Links
---

Links define an association between two components. Linking one component (the link source) to another (the link target) grants the source component access to the configuration of the target.

Links enable a consistent approach to sharing configuration across component types. You can view the structure for a link at the [AttributeSets and Reference data](./reference) page.

## Link Behaviour

One of the primary purposes for links is to assign permissions between two components. Each component may expose a collection of  Roles  which control permissions to its resources. A Link configuration with a  Role  will then grant those permissions to the source component.

Provider resources that are created as a result of a link belong to the component it is defined on, regardless of Link direction.

## Defining a Link

When linking to a component, you must specify the  Tier  and  Component  attributes. Links to a SubComponent first link to the parent using the  Component  attribute and then use the specific attribute type named for that SubComponent. To create a link to a Lambda Function for example, the  Component  attribute is used to filter to the parent, whilst the  Function  attribute specifies the exact  Function  SubComponent.

## Link Filters

Link definitions assume both source and target have matching "Instance" and "Version" identifiers. Where this is not the case the difference must be explicitly configured using attributes  Instance  and/or  Version .

The example below shows:

*  example-function  linking to  example-db 
     example-db  has different  Instance  and  Version  so they are defined on the link.
*  second-example-function  linking to  example-db 
     Instance  and  Version  match, so they are not required.
*  example-db  linking to  example-function 
     example-function  has neither  Instance  or  Version , but   example-db  has both - empty strings define the difference.

## Linking to a Component

   json
{
    "Tiers" : {
        "db" : {
            "Components" : {
                "example-db" : {
                    "db" : {
                        "Instances" : {
                            "example-instance" : {
                                "Versions" : {
                                    "v1" : {
                                        "DeploymentUnit" : [ "example-db-v1" ]
                                    }
                                }
                            }
                        },
                        // db configuration ...
                        "Links" : {
                            "lambda-function-link" : {
                                "Tier" : "app",
                                "Component" : "example-lambda",
                                "Function" : "example-function",
                                "Instance" : "",
                                "Version" : ""
                            }
                        }
                    }
                }
            }
        },
        "app" : {
            "Components" : {
                "example-lambda" : {
                    "lambda" : {
                        // lambda configuration ...
                        "Functions" : {
                            "example-function" : {
                                // function configuration ...
                                "Links" : {
                                    "db-link" : {
                                        "Tier" : "db",
                                        "Component" : "example-db",
                                        "Instance" : "example-instance",
                                        "Version" : "v1"
                                    }
                                }
                            }
                        }
                    }
                },
                "second-lambda-example" : {
                    "lambda" : {
                        // lambda configuration
                        "Instances" : {
                            "example-instance" : {
                                "Versions" : {
                                    "v1" : {
                                        "DeploymentUnits" : [ "example-lambda-v1" ]
                                    }
                                }
                            }
                        },
                        "Functions" : {
                            "second-example-function" : {
                                // function configuration
                                "Links" : {
                                    "db-link" : {
                                        "Tier" : "db",
                                        "Component" : "example-db"
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

   

## Link Roles

Specified with the  Role  attribute on a link, a Link Role informs the access requirements for the link source on the link target. For example a link created with a role of  Consume  will create the required provider resources for the link source to read and access anything stored by the link target.

## Link Direction

Links are uni-directional and can be created as either Outbound (default) or Inbound. An  Outbound  link indicates that the link source interacts with the link target whilst Inbound is the inverse. If two components each require configuration from the other then each of them must specify their own link. Inbound links enable a component to nominate itself as the link target. This provides the component access to its own Role definitions.

## Links and Contexts

The Context Model provides components with configuration outside of their own scope (product, account, tenant configuration). By compiling this information with the component, context is determined.

The  IncludeInContext  optional attribute on a link is used to restrict which links are included in the context. This permits environment space to be conserved where only a few attributes are necessary and prevents undesired overrides. When not specified, the context will contain all attributes regardless of whether they are missing or empty.

## Validating a Link

Run the following command in the hamlet container to validate your component's link configuration:

```bash
hamlet component describe-occurrence \
    --name
    solution
