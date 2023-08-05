---
title: "Setup Nodes"
sidebar_label: "Nodes"
sidebar_position: 2
pagination_prev: null
tags:
  - docker swarm
---

Let's start building our cluster. You can use either bare-metal machines or virtual machines - the configuration would be the same.

Here i use Proxmox ubuntu cloud image VM's.

:::tip What we'll to do:
3 x nodes (bare-metal or VMs), each with:
  * A mainstream Linux OS
  * At least 2GB RAM
  * At least 20GB disk space (but it'll be tight)

Connectivity to each other within the same subnet, and on a low-latency link (i.e., no WAN links)
:::

:::info note
All step below must be done in all nodes.
:::

### Install Docker

Follow this [link](https://docs.docker.com/engine/install/ubuntu/#installation-methods) to setup docker for ubuntu.

### Permit connectivity

Most modern Linux distributions include firewall rules which only only permit minimal required incoming connections (like SSH). We'll want to allow all traffic between our nodes.

Install the (non-default) persistent iptables tools, by running:

```bash
sudo apt install iptables-persistent
```

Establishing some default rules (dkpg will prompt you to save current ruleset), and then add something like this to /etc/iptables/rules.v4:

```bash
sudo micro /etc/iptables/rules.v4
```

```
# Allow all inter-node communication
-A INPUT -s 192.168.0.0/24 -j ACCEPT
```

And refresh your running iptables rules with:

```bash 
sudo iptables-restore < /etc/iptables/rules.v4
```

### Enable hostname resolution
Depending on your hosting environment, you may have DNS automatically setup for your VMs. If not, it's useful to set up static entries in /etc/hosts for the nodes. For example, I setup the following:

192.168.0.21 node-01 nd1.domain.com

192.168.0.22 node-02 nd2.domain.com

192.168.0.23 node-03 nd3.domain.com

:::info note
With ubuntu cloud image, if you edit hostname in /etc/hosts when server reboot cloud-init will overwrite it.

To solve this you can edit in /etc/cloud/templates/hosts.debian.tmpl or comment out `update_etc_hosts` in /etc/cloud/cloud.cfg
:::

### Set Timezone

Set your local timezone, by running:

```bash
sudo timedatectl set-timezone America/New_York
sudo timedatectl set-ntp on
```