---
sidebar_label: schemas
title: Schemas
---
import Admonition from 'react-admonitions';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Config Files

This reference provides an outline of the different classes of items within the CMDB. The classes form a hierarchy in the CMDB which defines your `hamlet` deployment overall. Instances of classes are grouped together in collections and the overall collection is used to define the class

## Hosting

### solution.json

A solution defines the infrastructure in a product. Solutions describe each component and its configuration. A an instance of the solution is then deployed based on the environment and segment of a product.

* Repository - ProductCMDB
* Scope - product, segment, app

<Tabs
    defaultValue="schema"
    values={[
        {label: 'Schema', value: 'schema'},
        {label: 'Example', value: 'example'},
    ]
}>
<TabItem value='schema'>

```json
{
    "test": "testing"
}
```

</TabItem>
<TabItem value='example'>

```json
{
    "Solution" : {
        "Id" : "bdd"
    },
    "Tiers": {
        "web" : {
            "Components" : {
                "bdd" : {
                    "Title" : "BDD Server",
                    "Role" : "ALM",
                    "DeploymentUnits" : ["bdd"],
                    "EC2" : {
                        "Ports" : [
                            {
                                "Port" : "3000"
                            }
                        ],
                        "LoadBalanced": true
                    },
                    "MultiAZ" : false
                }
            }
        }
    },
    "Segment": {
        "SSH": {
            "Active": true
        }
    },
    "Processors": {
        "default": {
            "EC2": {
                "Processor": "t2.medium"
            }
        }
    },
    "Storage" : {
        "default" : {
            "EC2" : {
                "Volumes" : {
                    "`hamlet`": {
                        "Device" : "/dev/sdp",
                        "Size" : "100"
                    }
                }
            }
        }
    }
}
```

</TabItem>
</Tabs>

### segment.json

In more complicated products you might want to split up your infrastructure to make it easier to manage or to deploy resources in different locations. The components of a solution are deployed into a segment and each segment has its own solution.

* Repository - ProductCMDB
* Scope - segment

<Tabs
    defaultValue="schema"
    values={[
        {label: 'Schema', value: 'schema'},
        {label: 'Example', value: 'example'},
    ]
}>
<TabItem value='schema'>

```json
{
    "test": "testing"
}
```

</TabItem>
<TabItem value='example'>

```json
{
    "Segment" : {
        "Title" : "Development",
        "Environment" : "dev",
        "Id" : "dev",
        "Name" : "dev"
    }
}
```

</TabItem>
</Tabs>

## Application

### build.json

* Repository - ProductCMDB
* Scope - app

<Tabs
    defaultValue="schema"
    values={[
        {label: 'Schema', value: 'schema'},
        {label: 'Example', value: 'example'},
    ]
}>
<TabItem value='schema'>

```json
{
    "test": "testing"
}
```

</TabItem>
<TabItem value='example'>

```json
{
    "Commit": "1730ad1e0dc0cb84a066f43836c45409212394a6a",
    "Formats": ["docker" ]
}
```

</TabItem>
</Tabs>

### appsettings.json

* Repository - AccountCMDB, ProductCMDB
* Scope - product, segment, app

<Tabs
    defaultValue="schema"
    values={[
        {label: 'Schema', value: 'schema'},
        {label: 'Example', value: 'example'},
    ]
}>
<TabItem value='schema'>

```json
{
    "test": "testing"
}
```

</TabItem>
<TabItem value='example'>

```json
{
    "ChatBot" : {
        "Rest" : {
            "Url" : "https://bot.skynet.com/dev/api"
        }
    },
    "MAINTENANCE_START" : "2017-11-16T21:00:00+11:00",
    "MAINTENANCE_END" : "2017-11-18T09:00:00+11:00"
}
```

</TabItem>
</Tabs>

## Provisioning

### credentials.json

* Repository - AccountCMDB
* Scope - Account, segment, app
* Type - Artefact
 
<Tabs
    defaultValue="schema"
    values={[
        {label: 'Schema', value: 'schema'},
        {label: 'Example', value: 'example'},
    ]
}>
<TabItem value='schema'>

```json
{
    "test": "testing"
}
```

</TabItem>
<TabItem value='example'>

```json
{
    "Credentials": {
        "ChatBot": {
            "RESTAPI": {
                "Username": "User01",
                "Password": ""
            }
        }
    }
}
```

</TabItem>
</Tabs>

### template.json

* Repository - ProductCMDB
* Scope - provider templates
* Type - Artefact

### stack.json

* Repository - ProductCMDB
* Scope - provider templates
* Type - Artefact

### epilogue.sh

* Repository - ProductCMDB
* Scope - provider templates
* Type - Artefact

### prologue.sh

* Repository - ProductCMDB
* Scope - provider templates
* Type - Artefact

### domains.json

* Repository - AccountCMDB
* Scope - Tenant

<Tabs
    defaultValue="schema"
    values={[
        {label: 'Schema', value: 'schema'},
        {label: 'Example', value: 'example'},
    ]
}>
<TabItem value='schema'>

```json
{
    "test": "testing"
}
```

</TabItem>
<TabItem value='example'>

```json
{
    "Domains" : {
        "Validation" : "hamlet.io",
        "cot" : {
            "Stem": "hamlet.io"
        },
        "syd1" : {
            "Stem": "syd1.hamlet.io"
            }
        }
}
```

</TabItem>
</Tabs>

### tenant.json

A tenant represents an overall `hamlet` deployment

* Repository - AccountCMDB
* Scope - Tenant

<Tabs
    defaultValue="schema"
    values={[
        {label: 'Schema', value: 'schema'},
        {label: 'Example', value: 'example'},
    ]
}>
<TabItem value='schema'>

```json
{
    "test": "testing"
}
```

</TabItem>
<TabItem value='example'>

```json
    {
        "Tenant" : {
            "Title" : "`hamlet`",
            "Id" : "cot",
            "Domain" : "cot"
        },
        "Account" : {
            "Region" : "ap-southeast-2",
            "Domain" : "syd1"
        },
        "Product" : {
            "Region" : "ap-southeast-2",
            "SES" : {
                "Region" : "us-west-2"
            }
        },
        "Segment" : {
            "SSH" : {
                "IPAddressGroups" : ["cbroffice"]
            }
        }
    }
```

</TabItem>
</Tabs>

### ipaddressgroups.json

* Repository - AccountCMDB
* Scope - Tenant

<Tabs
    defaultValue="schema"
    values={[
        {label: 'Schema', value: 'schema'},
        {label: 'Example', value: 'example'},
    ]
}>
<TabItem value='schema'>

```json
{
    "test": "testing"
}
```

</TabItem>
<TabItem value='example'>

```json
{
    "IPAddressGroups" : {
        "cbroffice" : {
            "access" : {
                "Description" : "Canberra Office",
                "CIDR" : [
                    "123.123.123.123/32"
                ]
            }
        }
    }
}
```

</TabItem>
</Tabs>

### countrygroups.json

* Repository - AccountCMDB
* Scope - Tenant

<Tabs
    defaultValue="schema"
    values={[
        {label: 'Schema', value: 'schema'},
        {label: 'Example', value: 'example'},
    ]
}>
<TabItem value='schema'>

```json
{
    "test": "testing"
}
```

</TabItem>
<TabItem value='example'>

```json
{
    "CountryGroups" : {
        "Australia" : {
            "Locations" : "AU"
        }
    }
}
```

</TabItem>
</Tabs>

### account.json

Represents a cloud providers highest billing entity, for AWS this would be an Account
- **Parent** Tenant

* Repository - AccountCMDB
* Scope - Account

<Tabs
    defaultValue="schema"
    values={[
        {label: 'Schema', value: 'schema'},
        {label: 'Example', value: 'example'},
    ]
}>
<TabItem value='schema'>

```json
{
    "test": "testing"
}
```

</TabItem>
<TabItem value='example'>

```json
{
    "Account" : {
        "Title" : "Development Account",
        "Id" : "cotdev01",
        "AWSId" : "1234567890",
        "Seed" : "ab2401"
    }
}
```

</TabItem>
</Tabs>

### deployment_unit.json

* Repository - AppCode
* Scope - product, implementation

<Tabs
    defaultValue="schema"
    values={[
        {label: 'Schema', value: 'schema'},
        {label: 'Example', value: 'example'},
    ]
}>
<TabItem value='schema'>

```json
{
    "test": "testing"
}
```

</TabItem>
<TabItem value='example'>

```json
{
    "Units" : ["cotapp-v1"],
    "Formats" : ["spa"]
}
```

</TabItem>
</Tabs>

### \<resource\>.json

* Repository - AppCode
* Scope - implementation
* Example - apigw.json

<Tabs
    defaultValue="schema"
    values={[
        {label: 'Schema', value: 'schema'},
        {label: 'Example', value: 'example'},
    ]
}>
<TabItem value='schema'>

```json
{
    "test": "testing"
}
```

</TabItem>
<TabItem value='example'>

```json
{
    "Accounts" : ["1234567890"],
    "Regions" : ["ap-southeast-2"],
    "ApiKey" : true,
    "Type" : "lambda",
    "Variable" : "COTAPP_COTAPI_LAMBDA"
}
```

</TabItem>
</Tabs>