---
id: authelia
title: "Authelia"
sidebar_label: "Authelia"
slug: authelia
tags:
  - docker swarm
  - stack
---

:::tip Prereq
Already deployed:

✅ Docker [swarm cluster](../swarm-mode.md) with persistent [shared storage](../shared-storage.md)

✅ [Traefik](./traefik/traefik-stack.md)

:::

![](https://raw.githubusercontent.com/authelia/authelia/master/docs/static/images/archi.svg)

Authelia is an open source Single Sign On and 2FA companion for reverse proxies. It helps you secure your endpoints with single factor and 2 factor auth. It works with Nginx, Traefik, and HA proxy. Today, we’ll configure Authelia with Traefik and have 2 Factor up and running with brute force protection!

### Create Persistent Volume

```bash
sudo mkdir -p /var/data/authelia/{log,config,redis}
cd /var/data/authelia
```

### Configuration File

```bash
sudo micro configuration.yml
```

```yaml
---
###############################################################
#                   Authelia configuration                    #
###############################################################

server:
  host: 0.0.0.0
  port: 9091

log:
  level: info
  format: json
  file_path: "/var/log/authelia/authelia.log"
  keep_stdout: true

theme: dark
# This secret can also be set using the env variables AUTHELIA_JWT_SECRET_FILE
jwt_secret: a_very_important_secret
default_redirection_url: https://auth.example.com

totp:
  issuer: authelia.com

# duo_api:
#  hostname: api-123456789.example.com
#  integration_key: ABCDEF
#  # This secret can also be set using the env variables AUTHELIA_DUO_API_SECRET_KEY_FILE
#  secret_key: 1234567890abcdefghifjkl

authentication_backend:
  file:
    path: /config/users_database.yml
    password:
      algorithm: argon2id
      iterations: 1
      salt_length: 16
      parallelism: 8
      memory: 64
      
access_control:
  default_policy: deny
  rules:
    # Rules applied to everyone
    - domain: auth.example.com
      policy: bypass
    - domain: whoami1.example.com
      policy: one_factor
    - domain: whoami2.example.com
      policy: two_factor

session:
  name: authelia_session
  # This secret can also be set using the env variables AUTHELIA_SESSION_SECRET_FILE
  secret: unsecure_session_secret
  expiration: 3600  # 1 hour
  inactivity: 300  # 5 minutes
  domain: example.com  # Should match whatever your root protected domain is

  # Enable redis if using HA or swarm
  # redis:
  #   host: authelia_redis
  #   port: 6379
  #   # This secret can also be set using the env variables AUTHELIA_SESSION_REDIS_PASSWORD_FILE
  #   password: REDIS_PASSWORD
  #   database_index: 0
  #   maximum_active_connections: 10
  #   minimum_idle_connections: 0

regulation:
  max_retries: 3
  find_time: 120
  ban_time: 300

storage:
  encryption_key: a_very_important_secret # Now required
  local:
    path: /config/db.sqlite3

notifier:
  # smtp:
  #   username: test
  #   # This secret can also be set using the env variables AUTHELIA_NOTIFIER_SMTP_PASSWORD_FILE
  #   password: password
  #   host: mail.example.com
  #   port: 25
  #   sender: admin@example.com
  filesystem:
    filename: /config/notification.txt
...
```

### Users Database

To generate hashed password please run this docker run command:

```bash
sudo docker run authelia/authelia:latest authelia hash-password YOUR_PASSWORD
```
Copy generated password and paste in users_database.yml

Add users database file

```bash
sudo micro users_database.yml
```

```yaml
---
###############################################################
#                         Users Database                      #
###############################################################

# This file can be used if you do not have an LDAP set up.

# List of users
users:
  username: # change with your username
    displayname: "Your Name"
    password: "YOUR_HASH_PASSWORD" 
    email: email@example.com
    groups:
      - admins
      - dev
...
```

### Stack

```bash
sudo micro authelia-stack.yaml
```

```yaml
version: '3.9'

services:
  auth:
    image: authelia/authelia:latest
    environment:
      - TZ=Asia/Jakarta
    networks:
      - traefik_proxy
    volumes:
      - /var/data/authelia/config:/config
      - /var/data/authelia/log:/var/log/authelia
    deploy:
      mode: replicated
      replicas: 1
      labels:
        - "traefik.enable=true"
        - "traefik.docker.network=traefik_proxy"
        - "traefik.http.routers.authelia.rule=Host(`auth.example.com`)"
        - "traefik.http.routers.authelia.entrypoints=https"
        - "traefik.http.services.authelia.loadbalancer.server.port=9091"
    healthcheck:
      disable: true

  redis:
    image: redis:alpine
    command: /bin/sh -c 'redis-server --appendonly yes --requirepass $${REDIS_PASSWORD}'
    environment:
      - REDIS_PASSWORD=YOUR_REDIS_PASSWORD
    networks:
      - traefik_proxy
    volumes:
      - /var/data/authelia/redis:/data
    deploy:
      mode: replicated
      replicas: 1

networks:
  traefik_proxy:
    external: true
```

### Deploy Services 

```bash
sudo docker stack deploy authelia -c authelia-stack.yaml
```