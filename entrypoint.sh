#!/bin/bash

create_branch=true
command="pscale branch create $1 $2 --org $3"

if [ -n "$4" ];then
  command="$command --from $4"
fi

if [ -n "$5" ];then
  command="$command --restore $5"
fi

if [ -n "$6" ];then
  command="$command --region $6"
fi

if [ "$7" == "true" ]; then
  command="$command --seed-data"
fi

# Check if branch already exists
if [ "true" == "$8" ];then
  output=$(eval "pscale branch show $1 $2 --org $3" 2>&1)
  exit_status=$?
  if [ $exit_status -ne 0 ]; then
    create_branch=true
  else
    create_branch=false
  fi
fi

if $create_branch; then
  eval $command

  ret=$?
  if [ $ret -ne 0 ]; then
    exit $ret
  fi

  if [ "true" == "$7" ];then
    . /.pscale/cli-helper-scripts/wait-for-branch-readiness.sh
    wait_for_branch_readiness 40 "$1" "$2" "$3" 5
  fi
else
  echo "Branch $2 already exists"
fi
