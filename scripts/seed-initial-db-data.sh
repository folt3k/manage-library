#!/bin/bash

docker exec -it library-cms-app npx prisma db seed
