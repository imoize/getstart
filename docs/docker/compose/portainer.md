---
title: "Deploy Portainer GUI"
sidebar_label: "Portainer"
slug: portainer
keywords:
  - docker
  - portainer
tags:
  - docker
  - portainer
---

Deploy portainer gui for docker.

1. Create compose file

```bash
micro portainer.yaml
```

2. Paste this stack

```yaml
---
version: "3.4"
services:
  portainer:
    image: portainer/portainer-ce:latest
    container_name: portainer
    ports:
    # for http
    #  - 8000:8000
    # for https
      - 9443:9443
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - portainer_data:/data
    restart: always

volumes:
  portainer_data:
    name: portainer_data
```

3. Deploy container

```bash
docker compose -f portainer.yaml up -d
```

Give the container a moment to spin up and then point a web browser to http://localhost:9443 or http://ip-address:9443 (Where localhost is the IP address of the docker IP). Create an admin user and log in.