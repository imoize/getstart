---
title: "Cloudflare Tunnel"
sidebar_label: "Cloudflared"
slug: cloudflared
tags:
  - docker swarm
  - stack
---

:::tip Prereq
Already deployed:

✅ Docker [swarm cluster](../swarm-mode.md) with persistent [shared storage](../shared-storage.md)

✅ [Traefik](./traefik/traefik-stack.md)
:::

If your network is behind Carrier-grade NAT (CGN), you can use cloudflare tunnel for expose your services without opening port 80 and 443.

### Tunnel

Cloudflare Tunnel provides you with a secure way to connect your resources to Cloudflare without a publicly routable IP address. With Tunnel, you do not send traffic to an external IP — instead, a lightweight daemon in your infrastructure (cloudflared) creates outbound-only connections to Cloudflare’s global network. Cloudflare Tunnel can connect HTTP web servers, SSH servers, remote desktops, and other protocols safely to Cloudflare. This way, your origins can serve traffic through Cloudflare without being vulnerable to attacks that bypass Cloudflare.

### How it works

Cloudflared establishes outbound connections (tunnels) between your resources and Cloudflare’s global network. Tunnels are persistent objects that route traffic to DNS records. Within the same tunnel, you can run as many cloudflared processes (connectors) as needed. These processes will establish connections to Cloudflare and send traffic to the nearest Cloudflare data center.

![](https://developers.cloudflare.com/assets/handshake_hufad68abf6107ffc2ef859ebe1b42b6e2_299675_1768x1102_resize_q75_box-3f75968f.jpg)

## Setup

### Configure Zero Trust

Login to your cloudflare [dashboard](https://dash.cloudflare.com/) go to [Zero Trust](https://one.dash.cloudflare.com/) -> Access -> Tunnels then `Create a tunnel`

#### Install connector
Since we use Traefik Proxy and configure DNS Record in clodflare dashboard setup Public Hostname is slightly different.

* Select `Docker` and copy docker run command or your TOKEN, after copied hit next.

Create two Public Hostname:
* Add first `Puclic Hostname` with the following:
  * Domain: Choose YOUR DOMAIN
  * Type: HTTPS or HTTP if you use it
  * URL: Your Traefik Services name `traefik_proxy`
* Add second `Public Hostname` with the following:
  * Subdomain: *
  * Domain: Choose YOUR DOMAIN
  * Type: HTTPS or HTTP if you use it
  * URL: Your Traefik Services name `traefik_proxy`

:::tip
You may need to disable TLS verify, edit Public Hostname:

* Additional application settings -> TLS -> No TLS Verify set to Enable
:::

### Stack

```bash
sudo micro cloudflare-stack.yaml
```

Put your cloudflare tunnel token to `TUNNEL_TOKEN=`

```yaml
version: "3.9"

services:
  tunnel:
    image: cloudflare/cloudflared:latest
    command: tunnel run
    environment:
      - TUNNEL_TOKEN=YOUR_CLOUDFLARE_TUNNEL_TOKEN
    networks:
      - traefik_proxy
    deploy:
      mode: global
      placement:
        constraints: [node.role == manager]

networks:
  traefik_proxy:
    external: true
```

### Deploy Services

```bash
sudo docker stack deploy cloudflare -c cloudflare-stack.yaml
```

That's it now you can access your services with your domain without opening port forward.

And you can add DNS Record in cloudflare dashboard with CNAME target to your root domain or `@`.