---
title: "Portainer GUI"
sidebar_label: "Portainer"
slug: portainer
tags:
  - docker swarm
  - stack
---

:::tip Prereq
Already deployed:

✅ Docker [swarm cluster](../swarm-mode.md) with persistent [shared storage](../shared-storage.md)

✅ [Traefik](./traefik/traefik-stack.md)

:::

Portainer is a lightweight UI for visualizing your docker environment. It also happens to integrate well with Docker Swarm clusters, which makes it a great fit for our stack.

It's a great addition to any stack, especially if you're just starting your containerization journey!

### Create Persistent Volume

```bash
sudo mkdir /var/data/portainer
cd /var/data/portainer
```

### Stack
 ```bash
sudo micro portainer-stack.yaml
 ```
:::info note
If you use traefik to expose portainer then uncomment `labels` and change `ports` section.
:::

```yaml
version: '3.9'

services:
  app:
    image: portainer/portainer-ce:latest
    command: -H tcp://tasks.agent:9001 --tlsskipverify
    ports:
      - target: 9000
        published: 9000
        protocol: tcp
        mode: host
    networks:
      - agent_network
      - traefik_proxy
    volumes:
      - /var/data/portainer:/data
    deploy:
      mode: replicated
      replicas: 1
      # labels:
      #   - "traefik.enable=true"
      #   - "traefik.docker.network=traefik_proxy"      
      #   - "traefik.http.routers.portainer.rule=Host(`portainer.example.com`)"
      #   - "traefik.http.routers.portainer.entrypoints=https"
      #   - "traefik.http.routers.portainer.middlewares=authelia@file"
      #   - "traefik.http.services.portainer.loadbalancer.server.port=9000"
      #   - "traefik.http.services.portainer.loadbalancer.server.scheme=https"
      placement:
        constraints: [node.role == manager] # or use node.hostname option to specify placement

  agent:
    image: portainer/agent:latest
    networks:
      - agent_network
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - /var/lib/docker/volumes:/var/lib/docker/volumes
    deploy:
      mode: global
      placement:
        constraints: [node.platform.os == linux]

networks:
  agent_network:
    name: agent_network
    driver: overlay
    external: false

  traefik_proxy:
    external: true
```

### Deploy Services

```bash
sudo docker stack deploy portainer -c portainer-stack.yaml
```
