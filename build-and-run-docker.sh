#!/bin/bash

#rm ./docker/replica.key -f
#openssl rand -base64 700 > ./docker/replica.key
#chmod 600 ./docker/replica.key
#chown 999 ./docker/replica.key
#chgrp 999 ./docker/replica.key

docker compose -f docker-compose.yaml down
docker build -t library-cms-app:latest .
docker compose -f docker-compose.yaml up -d
docker rm library-cms-mongo-replica-setup
