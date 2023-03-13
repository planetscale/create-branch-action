# Container image that runs your code
FROM planetscale/pscale:v0.129.0

RUN apk --no-cache add bash jq

# Copies your code file from your action repository to the filesystem path `/` of the container
COPY entrypoint.sh /entrypoint.sh
COPY install-helpers.sh /install-helpers.sh

# Install the PlanetScale Actions helpers
RUN /install-helpers.sh

# Code file to execute when the docker container starts up (`entrypoint.sh`)
ENTRYPOINT ["/entrypoint.sh"]