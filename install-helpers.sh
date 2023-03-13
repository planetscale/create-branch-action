#!/bin/bash

PSCALE_CLI_HELPER_SCRIPTS_NAME=pscale-workflow-helper-scripts
RELEASE_VERSION=781fa51d4cbb488cba6613e3d4250198e27cc7a7
PSCALE_SCRIPTS_DIR=.pscale/

wget -O ${PSCALE_CLI_HELPER_SCRIPTS_NAME}.zip https://github.com/planetscale/pscale-workflow-helper-scripts/archive/${RELEASE_VERSION}.zip
unzip -o ${PSCALE_CLI_HELPER_SCRIPTS_NAME}.zip

# create .pscale directory
mkdir -p ${PSCALE_SCRIPTS_DIR}

# copy scripts to .pscale directory
cp -r ${PSCALE_CLI_HELPER_SCRIPTS_NAME}-${RELEASE_VERSION}/.pscale/cli-helper-scripts ${PSCALE_SCRIPTS_DIR}/

# remove zip file and extracted directory
rm ${PSCALE_CLI_HELPER_SCRIPTS_NAME}.zip
rm -rf ${PSCALE_CLI_HELPER_SCRIPTS_NAME}-${RELEASE_VERSION}

echo
echo "Successfully installed pscale-workflow-helper-scripts"
echo






