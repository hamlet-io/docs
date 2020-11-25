---
sidebar_label: links
title: Links
---
import Admonition from 'react-admonitions';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';


Links define an association between two components. Linking one component (the link source) to another (the link target) grants the source component access to the configuration of the target.

Link's enable a consistent approach to sharing configuration across component types. You can view the structure for a link at the [metaparameter reference data](./reference/meta) page.

# Link Behaviour
Whilst the precise implications of each link is defined by each provider, a link will ensure that the source component has been granted sufficient privilages on the destination component in order to deploy and operate correctly. This might involve the creation of provider identities, roles, policies and/or rules that can be used by the component. Any provider resources that are the result of a link live with the Component the link is defined on. Removing the link or deleting one of the Component's deployment unit's will result in the removal of those resources. 

# Defining a Link
When linking to a component, you must specify the `Tier` and `Component` attributes. Links to a SubComponent first link to the parent using the `Component` attribute, and then use the specific attribute type named for that SubComponent. To create a link to a Lambda Function for example, the `Component` attribute is used to filter to the parent, whilst the `Function` attribute specifies the exact `Function` SubComponent.

# Link Filters
By default, Link definitions assume that both source and target components have matching "Instance" and "Version" identifiers. Where this is not the case the difference must be explicitely assigned to the link with the `Instance` and/or `Version` attributes (see the example of `example-db` linking to `example-function` below). Where they do match, the `Instance` and `Version` are not required (`second-lambda-example` linking to `example-db` below).

### Linking to a Component
```json
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

```

# Link Roles
Specified with the `Role` attribute on a link, a Link Role informs the access requiresments for the link source on the link target. For example a link created with a role of `Consume` will create the required provider resources for the link source to read and access anything stored by the link target.

# Link Direction
Links are uni-directional and can be created as either `Outbound` (default) or `Inbound`. An `Outbound` link indicates that the link source interacts with the link target whilst `Inbound` is the inverse. If two components each require configuration from the other than each of them must specify their own link. `Inbound` links enable a component to nominate itself as the link target. This provides the component access to its own Role definitions.


# Links and Contexts
The Context Model provides components with configuration outside of their own scope (product, account, tenant configuration). By compiling this information with the component, context is determined. 

The `IncludeInContext` optional attribute on a link is used to restrict which links are included in the context. This permits environment space to be conserved where only a few attributes are necessary and prevents undesired overrides. When not specified, the context will contain all attributes regardless of whether they are missing or empty.

## Validating a Link

Run the following command in the hamlet container to validate your component's link configuration:

```
hamlet query describe occurrence \
    --tier <tier> \
    --component <component> \
    --instance <instance> \
    --version <version> \
    solution
```