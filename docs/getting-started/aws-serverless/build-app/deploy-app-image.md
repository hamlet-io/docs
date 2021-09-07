---
sidebar_label: Deploying the App
title: Deploying the App
---

We've run our build and testing of the application, created a production build of the hello world UI and uploaded it as an image to hamlet. The last step in the process is to deploy it into our hamlet segment.

## Deploying a single page application

The image that we have for the ui was provided to hamlet as an SPA, single page application. Since SPA application logic is run from the users browser we don't need to have a server running it. In hamlet the app image is hosted on an S3 bucket and then make this bucket available through a CloudFront distribution. This provides a highly scalable and cached deployment of our single page application.

In hamlet we use two component types to create this deployment:

- **cdn** - This is the cloudfront distribution along with a collection of routes. The routes can forward traffic through to different origins. Static content will be cached on the distribution to reduce the calls required to our backend
- **spa** - This is the S3 based storage of the app image. The content is hosted on the baseline ops data bucket that was deployed as we setup the segment. When deploying the component the build reference for the application is used to pull the right image from the registry and then expand it into the bucket. The spa component doesn't deploy any new resources and instead just uses what is available.

Now lets update the solution to include he required components

### Solution updates

1. From your terminal change into the segment within your CMDB

    ```bash
    cd ~/hamlet_hello/mycmdb/myapp/config/solutionsv2/integration/default/
    ```

1. Open the segment.json file in this directory in your code editor and add the following

    ```json
    {
        "Tiers" : {
            "web" : {
                "Components" : {
                    "hellouicdn" : {
                        "cdn" : {
                            "Instances" : {
                                "default" : {
                                    "deployment:Unit" : "hellouicdn"
                                }
                            },
                            "Routes" : {
                                "default" : {
                                    "Origin" : {
                                        "Link" : {
                                            "Tier" : "web",
                                            "Component" : "helloui"
                                        }
                                    },
                                    "PathPattern" : "_default",
                                    "Compress" : true
                                }
                            }
                        }
                    },
                    "helloui": {
                        "spa": {
                            "Instances": {
                                "default": {
                                    "deployment:Unit": "helloui"
                                }
                            },
                            "Links": {
                                "cdn": {
                                    "Tier": "web",
                                    "Component": "hellouicdn",
                                    "Route" : "default",
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

    This adds two new components the cdn and the spa. The spa has the same deployment unit name as the image we uploaded in the last guide. The details of the image will be looked up during the component deployment processing and used by the component.

    The CDN links to the SPA as its origin and uses the default path to make it available at the root of the CDN url.

    The SPA has a link back to the CDN with a direction of inbound. The direction means that instead of the link performing an action on the component that the link comes from, the link will perform an action on the destination. In this case when the spa is updated the CDN cache will be invalidated. This ensures that the latest image is available as soon as a deployment is completed.

1. Now run the deployment of the new components

    ```bash
    hamlet --account acct01 deploy run-deployments -u hellouicdn -u helloui
    ```

    This will create the CDN ( it might take a little while ), when that has completed the image will be unzipped and the contents copied to the components s3 prefix.

1. When the command has finished we should now have the website ready to go. Get the cdn url from the attributes like the api lookup

    ```bash
    hamlet --account acct01 component describe-occurrence -n web-hellouicdn-cdn attributes
    ```

    ```terminal
    | Key             | Value                                 |
    |-----------------|---------------------------------------|
    | FQDN            | def89101112.cloudfront.net            |
    | DISTRIBUTION_ID | DEF789DEF78                           |
    | INTERNAL_FQDN   | def89101112.cloudfront.net            |
    | URL             | https://def89101112.cloudfront.net    |
    ```

    Copy the URL value and paste it into your browser and you should see the Hello Status website

    ![Showing the website deploy](deployed_website.png)

## Wrap up

This guide has rounded out the initial deployment of our hello status api and a single page app that is linked to our API.
Hamlet has managed the deployment of the whole application and we've been able to find out how what has been deployed and how we can access it
