---
title: "Swarm Cluster"
sidebar_label: "Overview"
sidebar_position: 1
pagination_next: null
pagination_prev: null
---

## Highly Available Docker Swarm Design
In the design described below, our "private cloud" platform is:

* Highly-available (can tolerate the failure of a single component)
* Scalable (can add resource or capacity as required)
* Portable (run it on your garage server today, run it in AWS tomorrow)
* Secure (access protected with LetsEncrypt certificates and optional OIDC with 2FA)
* Automated (requires minimal care and feeding)

## Design Decisions

Where possible, services will be highly available.**
This means that:

* At least 3 docker swarm manager nodes are required, to provide fault-tolerance of a single failure.
* Ceph is employed for share storage, because it too can be made tolerant of a single failure.

:::info note
An exception to the 3-nodes decision is running a single-node configuration. If you only have one node, then obviously your swarm is only as resilient as that node. It's still a perfectly valid swarm configuration, ideal for starting your self-hosting journey. In fact, under the single-node configuration, you don't need ceph either, and you can simply use the local volume on your host for storage. You'll be able to migrate to ceph/more nodes if/when you expand.
:::

Where multiple solutions to a requirement exist, preference will be given to the most portable solution.

This means that:

* Services are defined using docker-compose v3 YAML syntax
* Services are portable, meaning a particular stack could be shut down and moved to a new provider with minimal effort.

## Network Flows

* HTTP (TCP 80) : Redirects to https
* HTTPS (TCP 443) : Serves individual docker containers via SSL-encrypted reverse proxy