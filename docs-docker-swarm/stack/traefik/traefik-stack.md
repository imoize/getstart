---
id: traefik
title: "Traefik Proxy"
sidebar_label: "Traefik"
slug: /stack/traefik
tags:
  - docker swarm
  - stack
---

:::tip Prereq
Already deployed:

✅ Docker [swarm cluster](../../swarm-mode.md) with persistent [shared storage](../../shared-storage.md)

:::

## Installation

### Create Docker Network

```bash
sudo docker network create -d overlay --attachable --subnet=172.20.0.0/16 traefik_proxy
```
Subnet is Optional, you can define ip or not.

### Create Persistent Volume

```bash
sudo mkdir -p /var/data/traefik/{log,config,certs}
cd /var/data/traefik
```
Docker won't start a service with a bind-mount to a non-existent file, so prepare an empty acme.json and .log file (with the appropriate permissions) by running:

```bash
sudo touch certs/acme.json
sudo touch log/{traefik.log,access.log}
sudo chmod 600 certs/acme.json
sudo chmod 600 log/*.log
```

### Cloudflare API

To get your API token, visit [Cloudflare](https://dash.cloudflare.com/profile/api-tokens), go to My Profile, select API tokens and then choose Create Token.
Use the template Edit zone DNS.
Change to the following settings, click Continue to Summary and then Create Token.
- Zone - DNS - Edit
- Zone - Zone - Read
- Zone - Zone Settings - Read
- Zone Resources - Include - All Zones

### Traefik Static Configuration

```bash
sudo micro config/traefik.yaml
```

```yaml
global:
  checkNewVersion: true
  sendAnonymousUsage: false  # true by default

log:
  level: INFO  # DEBUG, INFO, WARNING, ERROR, CRITICAL
  format: common  # common, json, logfmt
  filePath: /var/log/traefik/traefik.log

accesslog:
  format: common  # common, json, logfmt
  filePath: /var/log/traefik/access.log

api:
  dashboard: true  # true by default
  # insecure: true  # Don't do this in production!

# Bypass TLS Verivy to container if using https scheme
# serversTransport:
#   insecureSkipVerify: true

entryPoints:
  http:
    address: :80
    forwardedHeaders:
      trustedIPs: &trustedIps
        # Clouflare public IP list for HTTP requests.
        - 172.19.0.0/16 #ADD YOUR DOCKER NETWORK HERE!!!
        - 173.245.48.0/20
        - 103.21.244.0/22
        - 103.22.200.0/22
        - 103.31.4.0/22
        - 141.101.64.0/18
        - 108.162.192.0/18
        - 190.93.240.0/20
        - 188.114.96.0/20
        - 197.234.240.0/22
        - 198.41.128.0/17
        - 162.158.0.0/15
        - 104.16.0.0/13
        - 104.24.0.0/14
        - 172.64.0.0/13
        - 131.0.72.0/22
        - 2400:cb00::/32
        - 2606:4700::/32
        - 2803:f800::/32
        - 2405:b500::/32
        - 2405:8100::/32
        - 2a06:98c0::/29
        - 2c0f:f248::/32
    # (Optional) Redirect to HTTPS
    http:
      redirections:
        entryPoint:
          to: https
          scheme: https
      middlewares:
        - securityHeaders@file

  https:
    address: :443
    forwardedHeaders:
      trustedIPs: *trustedIps
    http:
      tls:
        # Generate a wildcard domain certificate
        certResolver: cloudflare
        domains:
          - main: yourdomain.com
            sans:
              - '*.yourdomain.com'
      middlewares:
        - securityHeaders@file

# Configure CertificateResolver
certificatesResolvers:
  cloudflare:
    acme:
      email: email@example.com
      storage: /acme.json
      dnsChallenge:
        provider: cloudflare
        # Used to make sure the dns challenge is propagated to the rights dns servers
        resolvers:
          - "1.1.1.1:53"
          - "1.0.0.1:53"

providers:
  docker:
    exposedByDefault: false  # Default is true
    endpoint: "unix:///var/run/docker.sock"
    swarmMode: true
    watch: true
  file:
    # watch for dynamic configuration changes
    filename: /etc/traefik/config.yaml
    watch: true
```

### Traefik Dynamic Configuration

```bash
sudo micro config/config.yaml
```

```yaml
http:

  ## EXTERNAL ROUTING EXAMPLE - Only use if you want to proxy something manually ##
  routers:
    # Homeassistant routing example - Remove if not used
    homeassistant:
      entryPoints:
        - https
      rule: 'Host(`homeassistant.domain.com`)'
      service: homeassistant
      middlewares:
        - "auth"  
  ## SERVICES EXAMPLE ##
  services:
    # Homeassistant service example - Remove if not used
    homeassistant:
      loadBalancer:
        servers:
          - url: http://192.168.0.5:8123/

  ## MIDDLEWARES ##
  middlewares:
    # Only Allow Local networks
    local-ipwhitelist:
      ipWhiteList:
        sourceRange: 
          - 127.0.0.1/32 # localhost
          - 192.168.1.1/24 # LAN Subnet
  
    # Authelia guard
    authelia:
      forwardauth:
        address: http://authelia_auth:9091/api/verify?rd=https://auth.domain.com/ # replace auth with your authelia service name
        trustForwardHeader: true
        authResponseHeaders:
          - Remote-User
          - Remote-Groups
          - Remote-Name
          - Remote-Email
  
    # Authelia basic auth guard
    authelia-basic:
      forwardauth:
        address: http://authelia_auth:9091/api/verify?auth=basic # replace auth with your authelia service name
        trustForwardHeader: true
        authResponseHeaders:
          - Remote-User
          - Remote-Groups
          - Remote-Name
          - Remote-Email

    # Security headers
    securityHeaders:
      headers:
        customResponseHeaders:
          X-Robots-Tag: "none,noarchive,nosnippet,notranslate,noimageindex"
          server: ""
          X-Forwarded-Proto: "https"
        sslProxyHeaders:
          X-Forwarded-Proto: https
        referrerPolicy: "strict-origin-when-cross-origin"
        hostsProxyHeaders:
          - "X-Forwarded-Host"
        customRequestHeaders:
          X-Forwarded-Proto: "https"
        contentTypeNosniff: true
        browserXssFilter: true
        forceSTSHeader: true
        stsIncludeSubdomains: true
        stsSeconds: 63072000
        stsPreload: true

# Only use secure ciphers - https://ssl-config.mozilla.org/#server=traefik&version=2.6.0&config=intermediate&guideline=5.6
tls:
  # stores:
  #   default:
  #     defaultCertificate:
  #       certFile: /etc/traefik/certs/cert.pem
  #       keyFile: /etc/traefik/certs/cert-key.pem
  options:
    default:
      minVersion: VersionTLS12
      cipherSuites:
        - TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256
        - TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256
        - TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384
        - TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384
        - TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305
        - TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305
```

### Stack

```bash
sudo micro traefik-stack.yaml
```
:::info NOTE
Put your Cloudflare email and already generated API token in environment section.
:::

```yaml
version: "3.9"

services:
  proxy:
    image: traefik:latest
    ports:
      - target: 80
        published: 80
        protocol: tcp
        mode: host
      - target: 443
        published: 443
        protocol: tcp
        mode: host
      # Uncomment if expose dashboard to internal ip.
      # - target: 8080
      #   published: 8080
      #   protocol: tcp
      #   mode: host
    environment:
      - TZ=Asia/Jakarta
      - CF_API_EMAIL=email@example.com
      - CF_DNS_API_TOKEN=YOUR_SUPER_SECURE_CLOUDFLARE_API_TOKEN
    networks:
      - traefik_proxy
    volumes:
      - /var/data/traefik/config:/etc/traefik/
      - /var/data/traefik/log:/var/log/traefik/
      - /var/data/traefik/certs/acme.json:/acme.json
      - /var/run/docker.sock:/var/run/docker.sock:ro
    deploy:
      mode: global
      labels:
        - "traefik.enable=true"
        - "traefik.docker.network=traefik_proxy"
        - "traefik.http.routers.api.rule=Host(`traefik.example.com`)"
        - "traefik.http.routers.api.entrypoints=https"
        - "traefik.http.routers.api.service=api@internal"
        - "traefik.http.routers.api.middlewares=authelia@file"
        - "traefik.http.services.api.loadbalancer.server.port=9999"
        - "traefik.http.services.api.loadbalancer.server.scheme=https"
      placement:
        constraints: [node.role == manager]

networks:
  traefik_proxy:
    external: true
```

### Deploy Services

```bash
sudo docker stack deploy traefik -c traefik-stack.yaml
```