#!/bin/bash

source .env

MONGO="${MONGO_HOST}:${MONGO_PORT}"
REDIS="${REDIS_HOST}:${REDIS_PORT}"
echo "Wait for POSTGRES=${MONGO} and REDIS=${REDIS}"

wait-for-it ${MONGO}
wait-for-it ${REDIS}

npm run start:dev
