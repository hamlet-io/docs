FROM typesense/docsearch-scraper

USER root
RUN apt-get update && apt-get install -y jq gettext \
    && rm -rf /var/lib/apt/lists/

COPY --chown=1000:1000 search/crawler/config.json /search/config.json
COPY --chown=1000:1000 search/crawler/entrypoint.sh /entrypoint.sh
RUN chmod u+x /entrypoint.sh

USER 1000

ENTRYPOINT [ "/entrypoint.sh" ]
