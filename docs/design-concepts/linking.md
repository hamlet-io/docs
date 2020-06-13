---
sidebar_label: links
title: Component Links
---
import Admonition from 'react-admonitions';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## Understanding Links

Links specify a dependency between two or more components. They allow a component to share its attributes with any component dependant on it.

## Link Direction

Links are directional. Though an optional attribute of a link, the direction can be used to specify that a given component should be granted access to the linked component. An `Inbound` link specified on a API Gateway component for example, linking to a Lambda function would specify that the Lambda should be granted appropriate access for the API Gateway to invoke the lambda. Conversely, an `Outbound` link between these resources would imply that the API Gateway should be permitted to access the Lambda function.

A link is only required to specified on one end of the link - either the `Inbound` or `Outbound` end.

For simple linking where both ends of a link are known then defining a link on a component with only the mandatory attributes - outlined below - will indicate a one-way dependancy on the referenced component. In a situation where you may not know one side of the links up-front - such as with subcomponents - then an "Inbound" link could be used to create a link to any that do exist.

## Links and Contexts

The Context Model provides components with configuration outside of their own scope (product, account, tenant configuration). By compiling this information with the component, context is determined. 

The `IncludeInContext` optional attribute on a link is used to restrict which links are included in the context. This permits environment space to be conserved where only a few attributes are necessary and prevents undesired overrides. When not specified, the context will contain all attributes regardless of whether they are missing or empty.

## Link Instance and Versions
Links always match with components in their matching Instance and Version. The `Version` link attribute can be used to override this default behaviour if necessary.


## Link Structure & Placement

The structure for each link is the same, however the object's depth - where it can be defined on any given component - will depend on the component itself. [Refer to the Component definitions for placement.](../reference/component-reference.md)

<Tabs
    defaultValue="json"
    values={[
        {label: 'JSON', value: 'json'},
        {label: 'YAML', value: 'yaml'},
        {label: 'Reference', value: 'md'},
    ]
}>

<TabItem value='json'>

```json
{
    "Links" : {
        "<component-name>": {
            "Role": "<string>",
            "Direction": "<string>",
            "Type": "<string>",
            "Enabled": "<boolean>",
            "IncludeInContext": ["<array>", "<of>", "<strings>"],
            "Any": "<string>",
            "Tenant": "<string>",
            "Product": "<string>",
            "Environment": "<string>",
            "Segment": "<string>",
            "Tier": "<string>",
            "Component": "<string>",
            "Function": "<string>",
            "Instance": "<string>",
            "Version": "<string>"
        }
    }
}
```

</TabItem>
<TabItem value='yaml'>

```yaml
---
Links:
  "<component-name>":
    Role: "<string>"
    Direction: "<string>"
    Type: "<string>"
    Enabled: "<boolean>"
    IncludeInContext:
    - "<array>"
    - "<of>"
    - "<strings>"
    Any: "<string>"
    Tenant: "<string>"
    Product: "<string>"
    Environment: "<string>"
    Segment: "<string>"
    Tier: "<string>"
    Component: "<string>"
    Function: "<string>"
    Instance: "<string>"
    Version: "<string>"
```

</TabItem>
<TabItem value='md'>

| Attribute       	| Alternate Names 	| Type   	| Mandatory 	| Comment                                                    	|
|-----------------	|-----------------	|--------	|-----------	|------------------------------------------------------------	|
| Role             	|                 	| string 	| false     	|                                                            	|
| Direction        	|                 	| string 	| false     	| Valid values: `Inbound`, `Outbound`                          	|
| Type             	|                 	| string 	| false     	|                                                            	|
| Enabled          	|                 	| boolean 	| false     	| Is the Component enabled or disabled?                       	|
| IncludeInContext 	|                 	| array 	| false     	|                                                            	|
| Any             	|                 	| string 	| false     	|                                                            	|
| Tenant          	|                 	| string 	| false     	|                                                            	|
| Product         	|                 	| string 	| false     	|                                                            	|
| Environment     	|                 	| string 	| false     	|                                                            	|
| Segment         	|                 	| string 	| false     	|                                                            	|
| Tier            	|                 	| string 	| true      	| Often, Tier and Component are sufficient to create a link. 	|
| Component       	|                 	| string 	| true      	|                                                            	|
| Function        	|                 	| string 	| false     	|                                                            	|
| Instance        	|                 	| string 	| false     	|                                                            	|
| Version         	|                 	| string 	| false     	|                                                            	|

</TabItem>
</Tabs>

## Links to Sub-Components
Linking to subcomponents is performed through additional attributes on the Link. Specifying these indicates that you are linking to the subcomponent only, not the parent.

Like specifying a Component type in a link, the additional attributes each specify the type of sub-component with the attribute key being the sub-component type and the attribute value being the named instance of that sub-component.

*Linking to a Key subcomponent of a baseline component in the mgmt tier.*
<Tabs
    defaultValue="json"
    values={[
        {label: 'JSON', value: 'json'},
        {label: 'YAML', value: 'yaml'},
    ]
}>

<TabItem value='json'>

```json
{
    "Links": {
        "cf_key": {
            "Tier": "mgmt",
            "Component": "baseline",
            "Key": "oai"
        }
    }
}
```

</TabItem>
<TabItem value='yaml'>

```yaml
---
Links:
  cf_key:
    Tier: mgmt
    Component: baseline
    Key: oai
```

</TabItem>
</Tabs>

<Admonition type="note" title="Subcomponent Types">
    Make sure you are linking to the correct subcomponent by reviewing the component structure first.
</Admonition>

## Validating a Link

Run the following command in the hamlet container to validate your component's link configuration:

```
cot query describe occurrence \
    --tier-id <tier> \
    --component-id <component> \
    --instance-id <instance> \
    --version-id <version> \
    attributes
```

## Examples

The following examples contain only the component structure required to illustrate the full link.

### Inbound Link

*An SPA Component links to a CDN's Route subcomponent, specifying Inbound permissions. This grants the CDN permissions to access content of the SPA.*

<Tabs
    defaultValue="json"
    values={[
        {label: 'JSON', value: 'json'},
        {label: 'YAML', value: 'yaml'},
    ]
}>
<TabItem value='json'>

```json {9-13,18,22}
{
    "Tiers": {
        "web": {
            "Components" : {
                "maintenance" : {
                    "spa" : {
                        "Instances" : {},
                        "Links" : {
                            "cdn" : {
                                "Tier" : "web",
                                "Component" : "static-cdn",
                                "Route": "default",
                                "Direction" : "inbound"
                            }
                        }
                    }
                },
                "static-cdn": {                
                    "cdn": {
                        "Instances" : {},
                        "Routes": {
                            "default" : {
                                "PathPattern" : "_default",
                                "Compress": true,
                                "Origin": {}
                            }
                        }
                    }
                }
            }
        }
    }
}
```

</TabItem>
<TabItem value='yaml'>

```yaml {11-12,14,18}
---
Tiers:
  web:
    Components:
      maintenance:
        spa:
          Instances: {}
          Links:
            cdn:
              Tier: web
              Component: static-cdn
              Route: default
              Direction: inbound
      static-cdn:
        cdn:
          Instances: {}
          Routes:
            default:
              PathPattern: _default
              Compress: true
              Origin: {}
```

</TabItem>
</Tabs>

### Child Component

*An ECS Component's child service "Container" links to a database in another Tier* 
<Tabs
    defaultValue="json"
    values={[
        {label: 'JSON', value: 'json'},
        {label: 'YAML', value: 'yaml'},
    ]
}>
<TabItem value='json'>

```json {12-13,22,24}
{
    "Tiers": {
        "app": {
            "Components":{
                "app-ecs" : {
                    "ECS" : {
                        "Instances" : {},
                        "Containers": {
                            "Configuration" : {
                                "Links" : {
                                    "database" : {
                                        "Tier": "db",
                                        "Component": "database"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        "db": {
            "Components": {
                "database": {
                    "RDS" : {
                        "Instances" : {},
                        "Engine" : "postgres"
                    }
                }
            }
        }
    }
}
```

</TabItem>
<TabItem value='yaml'>

```yaml {12-13,14,16}
---
Tiers:
  app:
    Components:
      app-ecs:
        ECS:
          Instances: {}
          Containers:
            Configuration:
              Links:
                database:
                  Tier: db
                  Component: database
  db:
    Components:
      database:
        RDS:
          Instances: {}
          Engine: postgres
```

</TabItem>
</Tabs>