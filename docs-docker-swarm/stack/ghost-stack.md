---
title: Ghost CMS
sidebar_label: "Ghost"
slug: ghost
tags:
  - docker swarm
  - stack
---

```conf
# User Settings
GHOST_USERNAME=
GHOST_PASSWORD=
GHOST_EMAIL=

# Site Settings
GHOST_BLOG_TITLE=
GHOST_HOST=
GHOST_ENABLE_HTTPS=
GHOST_PORT_NUMBER=2368
GHOST_EXTERNAL_HTTP_PORT_NUMBER=80
GHOST_EXTERNAL_HTTPS_PORT_NUMBER=443
GHOST_SKIP_BOOTSTRAP=no

# Database Settings
GHOST_DATABASE_HOST=
GHOST_DATABASE_PORT_NUMBER=3306
GHOST_DATABASE_NAME=
GHOST_DATABASE_USER=
GHOST_DATABASE_PASSWORD=
GHOST_DATABASE_ENABLE_SSL=no
GHOST_DATABASE_SSL_CA_FILE=no
ALLOW_EMPTY_PASSWORD=no

# Email Settings
GHOST_SMTP_HOST=
GHOST_SMTP_PORT=
GHOST_SMTP_USER=
GHOST_SMTP_PASSWORD=
GHOST_SMTP_PROTOCOL=
GHOST_SMTP_FROM_ADDRESS=

# MySQL Settings
MYSQL_USER=
MYSQL_PASSWORD=
MYSQL_DATABASE=
MYSQL_ROOT_PASSWORD=
ALLOW_EMPTY_PASSWORD=no
MYSQL_CHARACTER_SET=utf8mb4
MYSQL_COLLATE=utf8mb4_0900_ai_ci
```

```yaml
version: '3.9'

services:
  app:
    image: bitnami/ghost:latest
    environment:
      - GHOST_USERNAME=${GHOST_USERNAME}
      - GHOST_PASSWORD=${GHOST_PASSWORD}
      - GHOST_EMAIL=${GHOST_EMAIL}
      - GHOST_BLOG_TITLE=${GHOST_BLOG_TITLE}
      - GHOST_HOST=${GHOST_HOST}
      - GHOST_ENABLE_HTTPS=${GHOST_ENABLE_HTTPS}
      - GHOST_DATABASE_HOST=${GHOST_DATABASE_HOST}
      - GHOST_DATABASE_PORT_NUMBER=${GHOST_DATABASE_PORT_NUMBER}
      - GHOST_DATABASE_NAME=${GHOST_DATABASE_NAME}
      - GHOST_DATABASE_USER=${GHOST_DATABASE_USER}
      - GHOST_DATABASE_PASSWORD=${GHOST_DATABASE_PASSWORD}
    networks:
      - traefik_proxy
      - ghost
    volumes:
      - /var/data/ghost/app:/bitnami/ghost
    deploy:
      mode: replicated
      replicas: 1
      labels:
        - "traefik.enable=true"
        - "traefik.docker.network=traefik_proxy"
        - "traefik.http.routers.ghost.rule=Host(`ghost.example.com`)"
        - "traefik.http.routers.ghost.entrypoints=https"
        - "traefik.http.services.ghost.loadbalancer.server.port=2368"

  db:
    image: rapidfort/mysql:latest
    environment:
      - MYSQL_USER=${MYSQL_USER}
      - MYSQL_PASSWORD=${MYSQL_PASSWORD}
      - MYSQL_DATABASE=${MYSQL_DATABASE}
      - MYSQL_ROOT_PASSWORD=${MYSQL_ROOT_PASSWORD}
      - MYSQL_CHARACTER_SET=${MYSQL_CHARACTER_SET}
      - MYSQL_COLLATE=${MYSQL_COLLATE}
    networks:
      - ghost
    volumes:
      - /var/data/ghost/data:/bitnami/mysql/data
    deploy:
      mode: replicated
      replicas: 1

networks:
  traefik_proxy:
    external: true

  ghost:
    name: ghost
    external: false
```