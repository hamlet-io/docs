---
sidebar_label: Creating an Image
title: Creating the App Image
---

This guide will take you through the process of building and uploading an image of our web app to the hamlet registry. The registry is where hamlet stores any application build artefacts that will be used by our components. There are different registry types for different build formats, but within AWS the majority of them are stored as S3 objects.

Each image has the following properties:

- format: this sets the type of image and is used by components to find images that they can support
- reference: a unique reference for each build of an image. This is usually something like a git hash
- scope: sets where the image is available. The default is segment which means the image is only available with the segment specified when it was upload
- unit: a setting namespace value which is used to by components to reference the image. You can use a setting namespace of the component that the image is going to be used for to save having to create a new namespace

## Building the web app

So now that we've seen what our app can do lets create a build of the app that we can deploy

:::tip
If you haven't run the app locally head to the [build locally](./build-locally) guide before going through with these steps
:::

1. Change into the app directory

    ```bash
    cd ~/hamlet_hello/docs-support/hello_world_ui
    ```

1. Run the tests on the app to make sure its working as expected

    ```bash
    yarn install
    yarn test

    # press a to run all tests
    # if they all pass press q to exit
    ```

1. Before running the build we need to provide the API Url into the environment so that it can be included in the build process. We will do this using the describe-occurrence command in hamlet

    ```bash
    cd ~/hamlet_hello/mycmdb/myapp/config/solutionsv2/integration/default/
    export REACT_APP_API_URL="$( hamlet --account acct01 component describe-occurrence -n elb-apicdn-cdn attributes --output-format json | jq -r '.URL' )"
    ```

    The command gets the attributes of the api cdn and then get the URL attribute using jq

1. Create a build of the app which will create a new directory which a compiled and minified version of our app

    ```bash
    cd ~/hamlet_hello/docs-support/hello_world_ui
    yarn build
    ```

    This should create a new directory under ~/hamlet_hello/docs-support/hello_world_ui/build with the app code that will become our image

1. So we now have our application build image ready for deployment into our environment. The next step is to upload the image to the registry

    ```bash
    # Change into the hamlet cmdb to set our context
    cd ~/hamlet_hello/mycmdb/myapp/config/solutionsv2/integration/default/

    # Get the git reference from the UI code repository
    # - update this directory if you are using a different base directory
    ui_git_dir=~/hamlet_hello/docs-support/hello_world_ui

    # A bit of git magic to get the sha1sum reference for the current branch of the code
    ui_git_ref="$(git -C "${ui_git_dir}"  show-ref -s --verify "$(git -C "${ui_git_dir}" symbolic-ref HEAD)")"

    # upload the image to the hamlet registry
    hamlet --account acct01 release upload-image \
        --deployment-unit "helloui" --build-reference "${ui_git_ref}" --image-format spa \
        --image-path "${ui_git_dir}/build/"
    ```

1. Now that we have uploaded the image we need to tell our integration environment that a new image has been uploaded to the registry and that it can use it for the next deployment

    ```bash
    hamlet --account acct01 release update-image-reference \
        --deployment-unit "helloui" --build-reference "${ui_git_ref}" \
        --image-format spa
    ```

In this guide we've created a build of our application ready to host in our deployment and uploaded it to the hamlet registry. The image provides the link between the application code and the hamlet infrastructure deployment. Once the image has been created hamlet works with the images and deploys these into the  environment.

## Configuration and image hosting

Hamlet follows the idea of a build once deploy many approach where we create a single build image that is deployed into multiple environments. This is useful when you can control the configuration of your component at run time with Environment variables or configuration files that are loaded as the app starts.

Single page applications (SPA) or Static Websites are designed to be served as a collection of files which are executed on the clients browser. This means that all of the configuration needs to be included in files at build time.

This guide has focussed on this approach and we will cover the idea of image promotion in line with the build once deploy many approach in more advanced guides
