---
title: Static Sites with Github Authentication Made Easy
author: rossmurr4y
author_url: https://github.com/rossmurr4y
---
import Admonition from 'react-admonitions';

# Github OAuth and S with Hamlet Modules
Static websites are everywhere nowadays, alongside them on their rise in popularity are the numerous app frameworks like Jekyll, Gatsby and Docusaurus that allow anyone to spin up and deploy documentation, a blog or simple website, often for for little or no cost. However, not every static site is intended to be public. Adding authentication is considerably greater in complexity than the site alone. Thankfully, this is where Hamlet Modules really shine.

In this article, I will be stepping through the process of using two of the recently published Hamlet modules - _cfcognito_ and _githubidp_. Used alongside a Hamlet Solution for a typical `spa` deployment into AWS, these modules will include everything necessary to restrict access to our site with Github.

Before we get started, let’s cover off what you need prior to following along.

# Prerequisites

You will need to have configured a Hamlet Tenant, Account(s) and Product for our site, and have deployed all the “out-of-the-box” deployment-units:

```bash
hamlet deploy run-deployments
```

The Hamlet Modules used here are going to restrict access to your chosen **Github Team** in a specific **Github Organisation**. Select an appropriate one to test with, and note them down as you'll need them shortly.

Within your selected Github organisation you will need to register a new [OAuth Application](https://docs.github.com/en/developers/apps/creating-an-oauth-app). This will require admin access to the Organisation. Enter a placeholder Callback URL for the time being, we’ll update it along the way. Generate a clientSecret that we can use within our Solution.

Finally, you’ll need to build and publish into our Solution’s artefact registry a unique build for the _githubidp_ module’s lambda function. Though already developed, the function is used to sign JWT’s and the private key for this is generated during the build. A Jenkins pipeline template for the build can be found [here](https://github.com/gs-gs/github-idp/blob/master/hamlet/pipelines/Jenkinsfile-example), and requires the following additions to our [product.properties file](https://docs.hamlet.io/docs/integrations/jenkins/examplelibrary/examples/properties/properties):

```bash
APPLICATION_UNITS=<MODULE_ID>-lambda

# Code Properties
<PRODUCT>_<MODULE_ID>_LAMBDA_CODE_REPO=github-idp

# Where:
#	◦	<MODULE_ID> is the id parameter value in the module
#	◦	<PRODUCT> is the Id of our product in upper case
``` 

The following environment variables will need to be updated with your details in the [Jenkins pipeline template](https://github.com/gs-gs/github-idp/blob/master/hamlet/pipelines/Jenkinsfile-exmaple): 

```groovy
    environment {
        product_cmdb = '<product CMDB repo url>'
        properties_file = '<product pipeline properties file>'
        GITHUB_CREDENTIALS = credentials('github')
        ENVIRONMENT = params['environment']
        SEGMENT = '<segment>'
    }
```

With that out of the way, let’s get on with it!

# Starting Solution

Update your Solution with the configuration below. We’ve added the Plugins, but the modules within them are not yet configured. Our `mgmt` tier has the definition for a single `userpool` I’ve simply called “pool”. In the `web` tier I’ve configured an `spa` component.

```json
{
    "Solution": {
        "Id": "<id>",      /* update */
        "Name" : "<name>", /* udpate */
        "Plugins" : {
            "cfcognito" : {
                "Enabled" : true,
                "Name" : "cfcognito",
                "Priority" : 200,
                "Required" : true,
                "Source" : "git",
                "Source:git" : {
                    "Url" : "https://github.com/hamlet-io/cloudfront-authorization-at-edge",
                    "Ref" : "master",
                    "Path" : "hamlet/cfcognito"
                }
            },
            "githubidp" : {
                "Enabled" : true,
                "Name" : "githubidp",
                "Priority" : 200,
                "Required" : true,
                "Source" : "git",
                "Source:git" : {
                    "Url" : "https://github.com/gs-gs/github-idp",
                    "Ref" : "v0.0.3",
                    "Path" : "hamlet/githubidp"
                }
            }
        }
    },
    "Tiers": {
        "mgmt" : {
            "Components" : {
                "pool" : {
                    "userpool" : {
                        "deployment:Unit" : "pool",
                        "Instances" : {
                            "default" : {}
                        },
                        "VerifyEmail" : false,
                        "DefaultClient" : false,
                        "Schema" : {
                            "email" : {
                                "DataType" : "String",
                                "Mutable" : true,
                                "Required" : true
                            }
                        }
                    }
                }
            }
        }
    }
}
```

Keen eyes may notice that I’ve not configured a `cdn` yet. This will be provided by our _cfcognito_ module, so we’ll start to see it’s deployment-unit once the module has been configured.

# Working with Plugins
If you haven’t used Hamlet Plugins before, the Plugins configuration demonstrated above informs the Hamlet Deploy engine that they should be loaded alongside any command-line specified providers. This does not configure them in our Solution (up next) but it exposes the capabilities of each plugin to us.

Once added to a Solution, the Plugins need to be loaded into the cache. This will insure they are available for the remainder of our actions:

```bash
# from the Product's Segment dir
hamlet @ ~/cmdb/cmdb/dir/msw-cmdb/indocsrm/config/solutionsv2/integration/default
master└─ $ $GENERATION_DIR/setup.sh 
(Info) Generating outputs:
(Info)  - generationcontract
(Info)  ~ no change in generationcontract detected
(Info)  - plugincontract
(Info) Differences detected:
(Info)  - updating loader-generation-contract.json
(Info)  - updating loader-plugincontract.json
(Info) Loading plugins from contract...
(Info) [*] id:cfcognito - name:cfcognito
(Info) [*] id:githubidp - name:githubidp
```

:::note
If you haven't already deployed the initial Solution, do that now before continuing.

```bash
hamlet deploy run-deployments
```
:::

## Configuring Modules :  githubidp
Our two Plugins not only extend the capabilities of Hamlet, they both include Hamlet Modules - pre-configured sections of a Solution that are layered underneath our Solution.

We’ll first configure the _githubidp_ module, which adds an `apigateway` and `lambda` components to our Solution. The `lambda` contains a number of functions that will perform the necessary authorisation steps for our site.

Add the following to the Solution to configure the module :

```json
{
    "Solution": {
        "Plugins" : { /*...*/ },
        "Modules" : {
            "githubauth" : {
                "Provider" : "githubidp",
                "Name" : "cognito_github_api",
                "Parameters" : {
                    "id" : {
                        "Key" : "id",
                        "Value" : "githubidp"
                    },
                    "tier" : {
                        "Key" : "tier",
                        "Value" : "api"
                    },
                    "githubClientId" : {
                        "Key" : "githubClientId",
                        "Value" : "<github-oauth-app-client-id>"     /* update */
                    },
                    "githubClientSecret" : {
                        "Key" : "githubClientSecret",
                        "Value" : "<github-oauth-app-client-secret>" /* update */
                    },
                    "githubOrg" : {
                        "Key" : "githubOrg",
                        "Value" : "<github-org>"                     /* update */
                    },
                    "githubTeams" : {
                        "Key" : "githubTeams",
                        "Value" : [ "<github-team-name>" ]           /* update */
                    },
                    "cognitoLink" : {
                        "Key" : "cognitoLink",
                        "Value" : {
                            "Tier" : "mgmt",
                            "Component" : "pool",
                            "Instance" : "",
                            "Version" : ""
                        }
                    }
                }
            }
        }
    },
    "Tiers" : { /*...*/ }
}
```

Let’s briefly review the parameters we’ve provided to the module:

- `id` - This will become part of the name for components and deployment-units within the module.
- `tier` - which tier the components defined within should be created within.
- `githubClientId` - the Github OAuth Application client ID defined on the Github Org you want to restrict access to.
- `githubClientSecret` - the clientSecret generated on the Github OAuth Application.
- `githubOrg` - the Github organisation that the restricted group belongs to.
- `githubTeams` - the Github Team within the specified organisation that should be authenticated.
- `cognitoLink` -  a link to our existing `userpool` component. This links the components in our Solution to those within the module.

## Update Solution
With the _githubidp_ module configured, we now configure our `userpool` to include  `userpoolauthprovider`.  

We configure the AuthProvider to use a new `DeploymentProfile` exposed by the module. The new profile is named after the `id` parameter you’ve specified on our module configuration - in our case that’s “githubidp_githubprovider”.

This `DeploymentProfile` will configure AuthProviders to use the `apigateway` as its federation source.


```json
{
    "Tiers": {
        "mgmt" : {
            "Components" : {
                "pool" : {
                    "userpool" : {
                        "deployment:Unit" : "pool",
                        "Instances" : {
                            "default" : {}
                        },
                        "VerifyEmail" : false,
                        "DefaultClient" : false,
                        "Schema" : {
                            "email" : {
                                "DataType" : "String",
                                "Mutable" : true,
                                "Required" : true
                            }
                        },
                        "AuthProviders" : {
                            "githubidp" : {
                                "Profiles" : {
                                    "Deployment" : "<id>_githubprovider" /* update */
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

With that done, let’s deploy our updated configuration and new deployment-units. We should deploy the `lambda` followed by the `apigateway` (as the API it deploy uses the `functions` as a backend) and then finally the updated `userpool`.

```bash
# where <id> is the value for the `id` parameter you've configured
hamlet deploy run-deployments -u <id>-lambda 
hamlet deploy run-deployments -u <id>-apigateway
hamlet deploy run-deployments -u <userpool-deployment-unit>
```

:::info
The Module we are using includes externally sourced files for the `apigateway`, so you do not need to provide it yourself.
:::

## Configuring Modules: cfcognito

The _cfcognito_ module enables OIDC compliant authentication at the CloudFront layer. This will allow us to use Cognito to provide course - in or out - level access to all content behind the CloudFront distribution.

Add its configuration into our Solution:

```json
{
    "Solution": {
        "Plugins" : { /*...*/ },
        "Modules" : {
            "door" : {
                "Provider" : "cfcognito",
                "Name" : "cdnlambda",
                "Parameters" : {
                    "id" : {
                        "Key" : "id",
                        "Value" : "door"
                    },
                    "tier" : {
                        "Key" : "tier",
                        "Value" : "web"
                    },
                    "origin" : {
                        "Key" : "originLink",
                        "Value" : {
                            "Tier" : "web",
                            "Component" : "spa",
                            "Instance" : "",
                            "Version" : "v1"
                        }
                    },
                    "userpool" : {
                        "Key" : "userpoolClientLink",
                        "Value" : {
                            "Tier" : "mgmt",
                            "Component" : "pool",
                            "Client" : "door"
                        }
                    }
                }
            }
        }
    },
    "Tiers" : { /* ... */ }
}
```

Reviewing each of the parameters here, we have:

- `id` - the value you provide here will determine the name of the deployment-units that come along with the module, and will be important to remember when it comes to creating links to the module.
- `tier` - the tier that the components within the module should be created within.
- `originLink` - a link configuration to tell the module what we’re going to use as the `cdn` origin - in this case that’s our `spa`.
- `userpoolClientLink` - a link to a `userpoolclient` - we haven’t created one of those - we’ll do it now.

## Update Lambda Region
This module includes a lambda ( deployment unit `<id>_lmb`) that must be specifically deployed into the **us-east-1** (required for cloudfront Lambda@Edge). For this to happen we must override any other Region configuration you may have, but only for this one component. The below example will apply it product-wide, only for the component with an `id` of `door-lmb`:

```json
{
  "Solution" : { /* ... */ },
  "Product" : {
    "door-lmb" : {
      "Region" : "us-east-1"
    }
  },
  "Tiers" : { /* ... */ }
}
```

## Update Solution
As this module adds the `cdn` into our Solution, we can now include our `userpoolclient` sub-component on our `userpool`. So that it picks up the Callback URL information for the `cdn`, we need to provide a Link on it to the `cdn` component configuration inside of the Module. 

The configuration for the Link is based off of the parameters you have provided to the Module, so you will know which Tier/Component/Instance combination to use. The Component's Id is a concatenation of the `id` Module parameter value you've configured and "auth".

We also want to add in our `spa` now, which has a pre-requisite of at least one CDNRoute link. We've had to hold off until the module was configured before we could add it into our Solution.

```json
{
    "Solution" : { /* ... */ },
    "Product" : { /* ... */ },
    "Tiers": {
        "mgmt" : {
            "Components" : {
                "pool" : {
                    "userpool" : {
                        "Clients" : {
                            "door" : {
                                "AuthProviders" : [ "githubidp" ],
                                "Links" : {
                                    "cdn" : {
                                        "Tier" : "<tier>",       /* update */
                                        "Component" : "<id>auth" /* update */
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        "web": {
            "Components": {
                "spa": {
                    "spa": {
                        "Instances": {
                            "default": {
                                "Versions": {
                                    "v1": {
                                        "DeploymentUnits": [
                                            "docs-v1"
                                        ]
                                    }
                                }
                            }
                        },
                        "Links": {
                            "cdn": {
                                "Tier": "<tier>",    /* update */
                                "Component": "<id>", /* update */
                                "Instance" : "",
                                "Version" : "",
                                "Route": "default",
                                "Direction": "inbound"
                            }
                        }
                    }
                }
            }
        }
    }
}
```

## Deploy
Now we’re all set to go. 

First lets deploy all of the lambda functions that will be performing the Authentication process.

```bash
hamlet deploy run-deployments -u <id>-lmb
```

After that is finished deploying we can ensure the remainder of our changes are picked up by deploying all deployment units.

```bash
hamlet deploy run-deployments
```

Remember you can list the discovered deployment units with `hamlet deploy list-deployments` if you would like to review what is available.

## Retrieving the Github App Callback
Our Github OAuth Application needs to be updated with the Callback Url of the Cognito userpool’s hosted UI. Once you’re `userpool` has been deployed, this can be retrieved with the Hamlet CLI:

```bash
hamlet query describe occurrence --tier-id <pool-tier> --component-id <pool-id> attributes
```

The result should be of the format `<UI_BASE_URL>/oauth2/idpresponse`. You should now replace the placeholder URL with this value in the Github OAuth Application.

## Testing Our Site

Once our Github OAuth App is configgured, we can now test it all out! Retrieve the `cdn` URL and test out your access.

```bash
hamlet query describe occurrence --tier-id <cdn-tier> --component-id <cdn-id> attributes
```

## Adding a Certificate
Though the `cdn` is defined within the _cfcognito_ module, by applying new configuration for it in our Solution we can add a certificate to it.

If you have a certificate ready to be applied (a topic for another article perhaps!), you can use the `id` and `tier` values you’ve configured the module with to apply the certificate:

```json
{
    "Tiers": {
        "<tier-value>": {
            "Components": {
                "<id-value>" : {
                    "cdn" : {
                        "Certificate": {
                            "Host": "<hostname>", /* update */
                            "IncludeInHost": {
                                "Host": true,
                                "Environment": false,
                                "Segment": false,
                                "Product": false,
                                "Tier": false,
                                "Component": false,
                                "Instance": false,
                                "Version": false
                            },
                            "IncludeInDomain": {
                                "Segment": false,
                                "Product": false,
                                "Environment": false
                            }
                        }
                    }
                }
            }
        }
    }
}
```

And with that, your Single Page Application should be secured behind Github OAuth!

:::warning
When you're done, don't forget to stop any unwanted infrastructure.

```bash
hamlet deploy run-deployments -m stop
```
:::