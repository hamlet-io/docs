FROM typesense/docsearch-scraper

RUN apt-get update && apt-get install -y jq gettext \
    && rm -rf /var/lib/apt/lists/

COPY search/crawler/config.json /search/config.json
COPY search/crawler/entrypoint.sh /entrypoint.sh
RUN chmod u+x /entrypoint.sh

ENTRYPOINT [ "/entrypoint.sh" ]
