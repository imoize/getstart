---
id: traefik-bouncer
title: "Traefik Bouncer"
sidebar_label: "Traefik Bouncer"
slug: /stack/crowdsec/traefik-bouncer
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

Before proceed please follow [`this instruction`](../crowdsec-stack.md) to setup CrowdSec first.
## Crowdsec

### Enable Bouncer

:::info PLEASE NOTE
In Swarm mode, first you need to get your crowdsec container name or id.

This is the only one time the api will be shown, make sure to note down this API key somewhere safe.
:::

Find where container is deployed

```bash
sudo docker service ps crowdsec_app
```

In case crowdsec is deployed on node 2, then ssh to node 2 and find container name by running:

```bash
sudo docker ps
```
You will see container name something like `crowdsec_app.1.aaabbbccc`.


Run this command to get API key

```bash
sudo docker exec crowdsec_app.1.aaabbbccc cscli bouncers add traefik-bouncer
```
After get API key go back to first node.

OR

If you use Portainer, you can exec with builtin shell console, then run:
```bash
cscli bouncers add traefik-bouncer
```

### Stack 

First cd to crowdsec directory

```bash
cd /var/data/crowdsec
```
Edit crowdsec-stack.yaml

```bash
sudo micro crowdsec-stack.yaml
```

#### Adding the API and Collection
Now we need to add the Traefik collection to the CrowdSec compose file and also the bouncer install along with the API key.

```yaml
version: "3.9"

services:
  security:
    image: crowdsecurity/crowdsec:latest
    environment:
      - PGID=1000
      - TZ=Asia/Jakarta
      - COLLECTIONS=crowdsecurity/traefik crowdsecurity/http-cve crowdsecurity/linux
    networks:
      - traefik_proxy
    volumes:
      - /var/data/crowdsec:/etc/crowdsec
      - /var/data/crowdsec/data:/var/lib/crowdsec/data
      - /var/data/crowdsec/log/auth.log:/var/log/auth.log:ro
      - /var/data/traefik/log/access.log:/var/log/traefik/access.log:ro
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
  - /var/log/traefik/*.log
labels:
  type: traefik
```

## Traefik

### Add the CrowdSec Middleware
Edit traefik.yaml file

```bash
sudo micro /var/data/traefik/config/traefik.yaml
```

Add middleware

```yaml
# check to be sure you have your middleware set for both http and https
entryPoints:
  http:
    address: ":80"
    http:
    // highlight-start
      middlewares:
        - crowdsec-bouncer@file
    // highlight-end
  https:
    address: ":443"
    http:
    // highlight-start
      middlewares:
        - crowdsec-bouncer@file
    // highlight-end
```

### Edit Dynamic Configuration File

```bash
sudo micro /var/data/traefik/config/config.yaml
```

Add crowdsec-bouncer to middlewares section

```yaml
crowdsec-bouncer:
  forwardauth:
    address: http://crowdsec_bouncer:8080/api/v1/forwardAuth
    trustForwardHeader: true
```

### Restart CrowdSec and Traefik

```bash
sudo docker stack deploy crowdsec -c crowdsec-stack.yaml
cd /var/data/traefik; sudo docker stack deploy traefik -c traefik-stack.yaml
```
