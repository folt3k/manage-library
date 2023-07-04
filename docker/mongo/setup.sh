#!/bin/bash

echo "Starting replica set initialize"
until mongosh --host library-cms-mongo --eval "print(\"waited for connection\")"
do
    sleep 2
done
echo "Connection finished"
echo "Creating replica set"
mongosh --host library-cms-mongo <<EOF
rs.initiate(
  {
    _id : 'rs0',
    members: [
      { _id : 0, host : "library-cms-mongo:27017" },
    ]
  }
)
EOF
echo "replica set created"
