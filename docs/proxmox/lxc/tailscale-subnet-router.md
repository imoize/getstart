---
id: tail
title: Tailscale as subnet router inside lxc
sidebar_label: 'Tailscale Subnet'
sidebar_position: 1
keywords:
  - lxc
  - proxmox
  - tailscale
tags:
  - lxc
  - proxmox
  - tailscale
---

As i'm often use tailscale for remote my homelab i decide to use tailscale as subnet.

We already know lxc is realy lightweight and fast so i will install tailscale with Alpine Linux inside Proxmox LXC.

### Create Lxc

Create container in Proxmox 

![](/img/tailscale-subnet/figure1.png)

I choose Alpine Linux 3.18 image.

![](/img/tailscale-subnet/figure2.png)

For disk size 1GB is enough

![](/img/tailscale-subnet/figure3.png)

![](/img/tailscale-subnet/figure4.png)

![](/img/tailscale-subnet/figure5.png)

After container created next we need add config to `/etc/pve/lxc/300.conf` ( where 300.conf is ID of created container ).

### Host config

Tailscale subnet need ipv4 forwarding enable if not enable in the host subnet will not work.

1. uncomment this line in `/etc/sysctl.conf`:

```conf
#net.ipv4.ip.forward=1
and
#net.ipv6.conf.all.forwarding=1
```

2. To bring up Tailscale in an unprivileged container, access to the /dev/tun device can be enabled in the config for the LXC. For example unprivileged LXC with ID 300, the following lines would be added to `/etc/pve/lxc/300.conf`:

```conf
lxc.cgroup2.devices.allow: c 10:200 rwm
lxc.mount.entry: /dev/net/tun dev/net/tun none bind,create=file
```

3. Reboot host.

:::danger Note!

It’s important that the container is stopped when you try to edit the file, otherwise Proxmox’s network filesystem will prevent you from saving it.

:::

### Container config

After all necessery configuration done in Proxmox host next start container.

1. Enable IP forwarding in guest container

```bash
echo 'net.ipv4.ip_forward = 1' | tee -a /etc/sysctl.d/99-tailscale.conf
echo 'net.ipv6.conf.all.forwarding = 1' | tee -a /etc/sysctl.d/99-tailscale.conf
sysctl -p /etc/sysctl.d/99-tailscale.conf
```

2. Install Tailscale

```bash
apk add tailscale
```

3. Enable tailscaled service

```bash
rc-update add tailscale
rc-service tailscale start
```

4. Authenticate and connect machine to Tailscale network

```bash
tailscale up --advertise-routes=10.0.0.0/24,10.0.1.0/24
```
  - `Change IP to match your need`

5. Enable subnet routes from admin console

Using the ellipsis icon menu at the end of the table, select Edit route settings. This will open up the Edit route settings panel.

Click Approve all on your routes so that Tailscale distributes the subnet routes to the rest of the nodes on your Tailscale network. Alternatively, you can approve each route individually by clicking the toggle to the left of the route.

### Reference

https://tailscale.com/kb/1130/lxc-unprivileged/

https://tailscale.com/kb/1019/subnets/?tab=linux

https://github.com/tailscale/tailscale/issues/3790