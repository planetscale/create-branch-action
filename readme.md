**:warning: :warning:**

**This Action has been replaced by [`setup-pscale-action`](https://github.com/planetscale/setup-pscale-action). Which is even faster! [Please see an example here](https://planetscale.com/docs/devops/github-actions#create-a-planetscale-branch).**

**:warning: :warning:**


### Create Database Branch Action

This GitHub Action can be used within your workflows to create new branches of your PlanetScale database.

### Prerequisites

Before you can use this Action, you'll need to configure a service token that has permission to create branches on your database. Refer to our docs on [how to create a service token](https://planetscale.com/docs/concepts/service-tokens) for more details. Once the service token has been created, the following repository secrets must also be set:

- `PLANETSCALE_SERVICE_TOKEN_ID`
- `PLANETSCALE_SERVICE_TOKEN`

These values will be used to authenticate to the PlanetScale service.

## Example

The following example will create a branch on the `recipes_db` database when a pull request is opened. The new branch will be named `mynewbranch` and will be created from the `main` branch.

```yml
name: Create a branch
on:
  pull_request:
    types: [opened]

jobs:
  create_a_branch:
    runs-on: ubuntu-latest
    steps:
      - name: checkout
        uses: actions/checkout@v3
      - name: Create a branch
        uses: planetscale/create-branch-action@v4
        id: create_branch
        with:
          org_name: bmorrison-ps
          database_name: recipes_db
          branch_name: mynewbranch
          from: main
        env:
          PLANETSCALE_SERVICE_TOKEN_ID: ${{ secrets.PLANETSCALE_SERVICE_TOKEN_ID }}
          PLANETSCALE_SERVICE_TOKEN: ${{ secrets.PLANETSCALE_SERVICE_TOKEN }}
```

## Input variables

**Required**

- `org_name` - The name of the PlanetScale organization.
- `database_name` - The name of the database to create the branch on.
- `branch_name` - The name of the new branch.

**Optional**

- `from` - The name of the branch that the new branch will be created from. Defaults to the branch defined in your database settings.
- `restore` - The ID of the backup that will be restored to the new branch. If not set, no backup will be restored.
- `region` - The region to create the new branch in. Defaults to the region where the `from` branch currently is.
- `wait` - If this value is set to "true", the action will ensure that the branch is created before exiting. If not, the action will exit immediately once the PlanetScale service has received the command to create the branch.
- `check_exists` - If set to "true", the action won't create the branch if it already exists.
- `seed_data` - Set to "true", to enable seed data from the latest backup using Data Branching™.\*

\* The Data Branching™ feature is not available on all plans. More details can be found here: [PlanetScale plans](https://planetscale.com/docs/concepts/planetscale-plans).

## Outputs

This Action has no output variables.
