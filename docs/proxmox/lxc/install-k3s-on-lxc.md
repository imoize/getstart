---
title: Install K3s On LXC
sidebar_label: "K3s on LXC"
sidebar_position: 3
keywords:
    - k3s
tags:
    - lxc
    - ubuntu
    - k3s
    - proxmox
---

### Proxmox Configuration

Now, we need to tweak a few things under-the-hood to give our containers proper permissions. You’ll need to SSH into your Proxmox host as the root user to run these commands.

In the /etc/pve/lxc directory, you’ll find files called XXX.conf, where XXX are the ID numbers of the containers we just created. Using your text editor of choice, edit the files for the containers we created to add the following lines:

```conf
lxc.apparmor.profile: unconfined
lxc.cgroup.devices.allow: a
lxc.cap.drop:
lxc.mount.auto: "proc:rw sys:rw"
```

:::danger Note!

It’s important that the container is stopped when you try to edit the file, otherwise Proxmox’s network filesystem will prevent you from saving it.

:::

### Container Configuration

Simply download [this script](https://github.com/imoize/boilerplates/blob/master/proxmox/lxc/k3s-lxc.md) from my repo for easiest setup k3s this will also install necessery dependencies and also install helm.

To grab the script run this following command:

```bash
wget -qO k3s-lxc.sh https://raw.githubusercontent.com/imoize/boilerplates/master/proxmox/lxc/scripts/k3s-lxc.sh
```

```bash
sudo chmod +x k3s-lxc.sh
```
```bash
sudo ./k3s-lxc.sh
```
