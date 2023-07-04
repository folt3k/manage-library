#!/bin/bash

docker compose -f docker-compose.yaml down

docker build -t library-cms-mongo:latest ./docker/mongo
docker build -t library-cms-app:latest .

docker compose -f docker-compose.yaml up -d

docker rm library-cms-mongo-replica-setup
