# Container image that runs your code
FROM planetscale/pscale:v0.129.0

RUN apk --no-cache add bash jq curl

# Copies your code file from your action repository to the filesystem path `/` of the container
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x entrypoint.sh

# Install the PlanetScale Actions helpers
COPY install-helpers.sh /install-helpers.sh
RUN chmod +x /install-helpers.sh
RUN /install-helpers.sh

# Code file to execute when the docker container starts up (`entrypoint.sh`)
ENTRYPOINT ["/entrypoint.sh"]