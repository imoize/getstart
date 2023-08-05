---
title: "Authelia Collection"
sidebar_label: "Authelia Collection"
slug: authelia-collection
tags:
  - docker swarm
  - stack
---

:::tip Prereq
Already deployed:

✅ Docker [swarm cluster](../../../swarm-mode.md) with persistent [shared storage](../../../shared-storage.md)

✅ [Traefik](../../traefik/traefik-stack.md)

✅ [CrowdSec](../crowdsec-stack.md)
:::

### Add Authelia Collection

```bash
cd /var/data/crowdsec
sudo micro crowdsec-stack.yaml
```

#### Stack

Add authelia to collections and add authelia log file bind mount

```yaml
version: "3.9"

services:
  security:
    image: crowdsecurity/crowdsec:latest
    environment:
      - PGID=1000
      - TZ=Asia/Jakarta
      - COLLECTIONS=crowdsecurity/traefik crowdsecurity/http-cve crowdsecurity/linux LePresidente/authelia
    networks:
      - traefik_proxy
    volumes:
      - /var/data/crowdsec:/etc/crowdsec
      - /var/data/crowdsec/data:/var/lib/crowdsec/data
      - /var/data/crowdsec/log/auth.log:/var/log/auth.log:ro
      - /var/data/traefik/log/access.log:/var/log/traefik/access.log:ro
      - /var/data/authelia/log/authelia.log:/var/log/authelia/authelia.log:ro
    deploy:
      mode: replicated
      replicas: 1

  bouncer:
      image: fbonalair/traefik-crowdsec-bouncer:latest
      environment:
        - TZ=Asia/Jakarta
        - CROWDSEC_BOUNCER_API_KEY=PUT_YOUR_BOUNCER_API_KEY_HERE
        - CROWDSEC_AGENT_HOST=crowdsec_security:8080
        - GIN_MODE=release
      networks:
        - traefik_proxy
      deploy:
        mode: replicated
        replicas: 1

networks:
  traefik_proxy:
    external: true
```

### Mapping Log File

```bash
sudo micro acquis.yaml
```

Add this following line

```yaml
---
filenames:
  - /var/log/crowdsec/authelia.log
labels:
  type: authelia
```

### Restart Services

```bash
sudo docker stack deploy crowdsec -c crowdsec-stack.yaml
```