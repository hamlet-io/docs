# Search Integration

This section contains the resources required to enable search for the staff-handbook.
It uses a GoSource hosted [typesense](https://typesense.org/docs/guide/docsearch.html) cluster which looks after storing the indexed data

Details on how that works and where we use it are available on the [docsearch repo](https://github.com/gs-gs/gs-docsearch)

## Crawling Content

The docker-compose stack in this folder is used to perform search crawling of the site and update the docsearch index. Since the actual production deployment of the handbook is behind Github Pages authentication process, the docker-compose stack hosts a mocked version of the site using docker compose including HTTPS and using the same hostname
we use for the production site.

This process ensures that the crawler results can work in production without having to make the crawler support search.

### Running the Crawl

Running the crawling process requires 2 steps. Building the site and then crawling it

1. From the root of the repo run the following which will create a production build of the site and store it in a docker volume

    ```bash
    docker compose -f search/docker-compose.yml --profile builder run builder
    ```

1. Once that has completed you can either run the crawl and push the index to the hosted typesense cluster or run it locally

    - **local** Running locally will setup a typesense node, setup a static https site and run a crawl of the static site

    ```bash
    docker compose -f search/docker-compose.yml --profile crawl up
    ```

    Access the site at https://localhost:8443 on your local machine

    - **crawl** To just run the crawl service and publish the results to another typesense cluster

    ```bash
        export TYPESENSE_API_KEY=
        export TYPESENSE_HOST=
        export TYPESENSE_PORT=
        export TYPESENSE_PROTOCOL=
    ```

    Where Host, Port and Protocol are the typesense cluster endpoint and API_KEY is a key with the ability to perform the following permissions in typesense

    ```text
        "actions": ["collections:*", "aliases:*", "synonyms:*", "documents:*"],
        "collections": [ {collection_name}.*"]
    ```

    where `{collection_name}` is the name of the collection where the documents will be stored. Note the .* is required as the crawler creates temp collections as it goes
