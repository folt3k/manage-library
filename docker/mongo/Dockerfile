FROM mongo:6

RUN apt-get install -y openssl && \
    openssl rand -base64 700 > /opt/replica.key && \
    chmod 600 /opt/replica.key

ENTRYPOINT ["/usr/bin/mongod"]
