---
id: crowdsec
title: "CrowdSec"
sidebar_label: "CrowdSec"
slug: /stack/crowdsec
tags:
  - docker swarm
  - stack
---

:::tip Prereq
Already deployed:

✅ Docker [swarm cluster](../../swarm-mode.md) with persistent [shared storage](../../shared-storage.md)

✅ [Traefik](../traefik/traefik-stack.md)
:::

### Create Persistent Volume
First we need create folder for crowdsec

```bash
sudo mkdir -p /var/data/crowdsec{data,log}
sudo touch /var/data/crowdsec/log/auth.log
cd /var/data/crowdsec
```

### Stack

```bash
sudo micro crowdsec-stack.yaml
```

```yaml
version: "3.9"

services:
  security:
    image: crowdsecurity/crowdsec:latest
    environment:
      - PGID=1000
      - TZ=Asia/Jakarta
    networks:
      - traefik_proxy
    volumes:
      - /var/data/crowdsec:/etc/crowdsec
      - /var/data/crowdsec/data:/var/lib/crowdsec/data
      - /var/data/crowdsec/log/auth.log:/var/log/crowdsec/auth.log:ro
    deploy:
      mode: replicated
      replicas: 1

networks:
  traefik_proxy:
    external: true
```
### Deploy Services

```bash
sudo docker stack deploy crowdsec -c crowdsec-stack.yaml
```