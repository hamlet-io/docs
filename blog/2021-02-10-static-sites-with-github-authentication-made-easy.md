---
title: Static Sites with Github Authentication Made Easy
author: rossmurr4y
author_url: https://github.com/rossmurr4y
---
import Admonition from 'react-admonitions';
import Mermaid from '@theme/Mermaid';

Static websites are everywhere nowadays, alongside them on their rise in popularity are the numerous app frameworks like Jekyll, Gatsby and Docusaurus that allow anyone to spin up and deploy documentation, a blog or simple website, often for for little or no cost.
<!--truncate-->

An common pattern for this deployment is to use an object store ( AWS S3, Azure Object Store ) combined with a content distribution network (CDN) such as AWS CloudFront. Most providers of these services charge on usage and often have great free tier offerings for small sites

<Mermaid
    chart={`
        graph LR;
        cdn[CDN]
        s3[S3 Bucket]
        user[User]
        user-->|browses to website|cdn
        cdn-->|cdn gets content from object store|s3
        style s3 height:75px,width:90px;
    `}
/>

However, not every static site is intended to be public. Adding authentication is considerably greater in complexity than the site alone. Thankfully, this is where Hamlet Modules really shine.

In this article, we will be stepping through the process of using two of the recently published Hamlet modules - _cfcognito_ and _githubidp_. Used alongside a Hamlet Solution for a typical `spa` deployment into AWS, these modules will include everything necessary to restrict access to our site with Github.

<Mermaid
    chart={`
        graph LR;
        cdn[CDN]
        s3[S3 Bucket]
        user[User]
        auth[AuthService]
        github[GitHub]
        user-->|browses to website|cdn
        cdn-->|sends user to authenticate|auth
        auth-->|sends user to Github|github
        cdn-->|cdn returns static content after authentication|s3
    `}
/>

Before we get started, let’s cover off what you need prior to following along.

## Prerequisites

You will need to have configured a Hamlet Tenant, Account(s) and Product for our site, and have deployed all the “out-of-the-box” deployment-units:

```bash
hamlet deploy run-deployments -u baseline
```

The Hamlet Modules used here are going to restrict access to your chosen GitHub team(s) in a specific GitHub organisation. Select an appropriate one to test with, and note them down as you'll need them shortly.

Within your selected Github organisation you will need to register a new [OAuth Application](https://docs.github.com/en/developers/apps/creating-an-oauth-app). This will require admin access to the Organisation. Enter a placeholder Callback URL for the time being, we’ll update it along the way. Generate a clientSecret that we can use within our Solution.

Finally, you’ll need to build and publish into our Solution’s artefact registry a unique build for the _githubidp_ module’s lambda function. Though already developed, the function is used to sign JWT’s and the private key for this is generated during the build. A Jenkins pipeline template for the build can be found [here](https://github.com/gs-gs/github-idp/blob/master/hamlet/pipelines/Jenkinsfile-example), and requires the following additions to our [product.properties file](https://docs.hamlet.io/docs/integrations/jenkins/examplelibrary/examples/properties/properties):

```bash
APPLICATION_UNITS=<MODULE_ID>-lambda

# Code Properties
<PRODUCT>_<MODULE_ID>_LAMBDA_CODE_REPO=github-idp

# Where:
#   ◦   <MODULE_ID> is the id parameter value in the module
#   ◦   <PRODUCT> is the Id of our product in upper case
```

We've put together a basic [Jenkins declarative pipeline template](https://github.com/gs-gs/github-idp/blob/master/hamlet/pipelines/Jenkinsfile-exmaple) which will handle the build of the code and uploading the lambda zip file to our registry. When using the pipeline you will need to update the environment section to match your configuration. :

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

## Initial Setup

Update your Solution with the configuration below.

This does the following:

- Adds 2 plugins:
  - cfcognito which enables Cognito Integration for CloudFront Distributions
  - github-idp which enables github federation with Cognito
- In out mgmt tier adds a cognito `userpool` which will be used for the integration. I’ve simply called pool

```json
{
    "Solution": {
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
                    "Ref" : "master",
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

## Working with Plugins

If you haven’t used Hamlet Plugins before, Plugins extend hamlet and can provide a wide range of functions, including modules which provide prebuilt solutions that can be added to your own solution.
After adding a plugin it needs to be installed in your workspace so that it can be used:

```bash
# from the Product's Segment dir
hamlet setup
```

```bash
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
Deploy the updated solution to make sure the userpool is available

```bash
hamlet deploy run-deployments
```

:::

### Configuring Modules :  githubidp+

Now that the plugins have been installed we can start using them. The first thing we will be using from the Plugins is the `cognito_github_api` module from the `githubidp` plugin.
This module adds an `apigateway` and `lambda` components to our Solution. The `apigateway` uses the `lambda` component to create a Github Authentication service which is supported by Cognito.

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

### Configuring Existing Components

With the `cognito_github_api` module configured, we now configure our `userpool` to include a `userpoolauthprovider` which adds a trust between our Cognito userpool and the Github Authentication service ( the `apigateway` we just added).

We configure the AuthProvider to use a new `DeploymentProfile` added by the module, the `DeploymentProfile` includes all the configuration required on the `userpoolauthprovider`. The new profile is named after the `id` parameter you’ve specified on our module configuration - in our case the profile name will be githubidp_githubprovider.

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
                            "github" : {
                                "Profiles" : {
                                    "Deployment" : "githubidp_githubprovider"
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
hamlet deploy run-deployments -u githubidp-lambda
hamlet deploy run-deployments -u githubidp-apigateway
hamlet deploy run-deployments -u pool
```

:::info
If you've used hamlet before you'll see that we don't have an openapispec for the `apigateway` this is included as part of the module.
:::

### Configuring Modules: cfcognito

The `cdnlambda` module in the `cfcognito` plugin enables OIDC compliant authentication at the CloudFront layer. This will allow us to use Cognito to provide course - in or out - level access to all content behind the CloudFront distribution.

:::warning
When using this authentication approach, your static site won't know which user is accessing the site. Make sure all your users should access the same content
:::

Lets add the module to our solution:

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
- `userpoolClientLink` - a link to a `userpoolclient` ( we will add this client in the next couple of steps)

### Update Lambda Region

The `cdnlambda` module includes a lambda ( deployment unit `door-lmb`) that must be specifically deployed into the **us-east-1** ( this is required for cloudfront Lambda@Edge ). For this to happen we must override any other Region configuration you may have, but only for this one component. The below example will apply it product-wide for an components which belong to the deployment unit `door-lmb`:

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

### Adding the site

As this module adds the `cdn` into our Solution we need to add a `userpoolclient` sub-component to our `userpool` which will be used by CloudFront to access the `userpool`.

So that it picks up the Callback URL information for the `cdn`, we need to provide a Link on it to the `cdn` component configuration inside of the Module.

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
                                "AuthProviders" : [ "github" ],
                                "Links" : {
                                    "cdn" : {
                                        "Tier" : "web",
                                        "Component" : "doorauth"
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
                                        "deployment:Unit": "docs-v1"
                                    }
                                }
                            }
                        },
                        "Links": {
                            "cdn": {
                                "Tier": "web",
                                "Component": "door",
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
hamlet deploy run-deployments -u door-lmb
```

After that is finished deploying we can ensure the remainder of our changes are picked up by deploying all deployment units.

```bash
hamlet deploy run-deployments
```

Remember you can list the discovered deployment units with `hamlet deploy list-deployments` if you would like to review what is available.

## Retrieving the Github App Callback

Our Github OAuth Application needs to be updated with the Callback Url of the Cognito userpool’s hosted UI. Once you’re `userpool` has been deployed, this can be retrieved with the Hamlet CLI:

```bash
hamlet query describe occurrence --tier-id mgmt --component-id pool attributes
```

The result should be of the format `<UI_BASE_URL>/oauth2/idpresponse`. You should now replace the placeholder URL with this value in the Github OAuth Application.

## Testing Our Site

Once our Github OAuth App is configured, we can now test it all out! Retrieve the `cdn` URL and test out your access.

```bash
hamlet query describe occurrence --tier-id web --component-id door attributes
```

And with that, your Single Page Application should be secured behind Github OAuth!

:::warning
When you're done, don't forget to stop any unwanted infrastructure.

```bash
hamlet deploy run-deployments -m stop
```

:::
