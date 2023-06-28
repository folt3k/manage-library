#!/bin/bash

MONGODB1=library-cms-mongo

echo "**********************************************" ${MONGODB1}
echo "Waiting for startup.."
sleep 30
echo "done"

echo SETUP.sh time now: `date +"%T" `
mongosh --host ${MONGODB1}:27017 -u ${MONGO_INITDB_ROOT_USERNAME} -p ${MONGO_INITDB_ROOT_PASSWORD} <<EOF
var cfg = {
    "_id": "rs0",
    "protocolVersion": 1,
    "version": 1,
    "members": [
        {
            "_id": 0,
            "host": "${MONGODB1}:27017",
            "priority": 0
        },
    ]
};
rs.initiate(cfg, { force: true });
rs.secondaryOk();
db.getMongo().setReadPref('primary');
rs.status();
EOF
