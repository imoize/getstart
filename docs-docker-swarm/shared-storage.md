---
title: "Shared Storage using Ceph"
sidebar_label: "Shared Storage (Ceph)"
sidebar_position: 3
tags:
  - docker swarm
---

While Docker Swarm is great for keeping containers running (and restarting those that fail), it does nothing for persistent storage. This means if you actually want your containers to keep any data persistent across restarts, you need to provide shared storage to every docker node.

### Pick a master node

One of your nodes will become the cephadm "master" node. Although all nodes will participate in the Ceph cluster, the master node will be the node which we bootstrap ceph on. It's also the node which will run the Ceph dashboard, and on which future upgrades will be processed. It doesn't matter which node you pick, and the cluster itself will operate in the event of a loss of the master node (although you won't see the dashboard)

### Install cephadm on master node

Run the following on the master node:

```bash
sudo apt install cephadm ceph-common
```
```bash
sudo mkdir -p /etc/ceph
sudo cephadm bootstrap --mon-ip 192.168.0.21
```

Output will show your username and password of Ceph Dashboard, better write this down.

:::info note
You also need install cephadm and ceph-common on the other nodes.
:::

### Prepare other nodes

It's now necessary to tranfer the following files to your other nodes, so that cephadm can add them to your cluster, and so that they'll be able to mount the cephfs when we're done:

| Path on master                        | Path on non-master                                         |
|---------------------------------------|------------------------------------------------------------|
| /etc/ceph/ceph.conf                   | /etc/ceph/ceph.conf                                        |
| /etc/ceph/ceph.client.admin.keyring   | /etc/ceph/ceph.client.admin.keyring                        |
| /etc/ceph/ceph.pub                    | /root/.ssh/authorized_keys (append to anything existing)   |

Back on the master node, run:
```bash 
sudo ceph orch host add <node-name> <node-ip>
```
Once for each other node you want to join to the cluster. You can validate the results by running:
```bash
sudo ceph orch host ls
```

### Add OSDs

Now the best improvement since the days of ceph-deploy and manual disks.. on the master node, run:
```bash
sudo ceph orch apply osd --all-available-devices
```
This will identify any (unpartitioned, unmounted) disks attached to each participating node, and configure these disks as OSDs.

### Setup CephFS

On the master node, create a cephfs volume in your cluster, by running:
```bash
sudo ceph fs volume create data
```
Ceph will handle the necessary orchestration itself, creating the necessary pool, mds daemon, etc.

You can watch the progress by running:
```bash
sudo ceph fs ls
```
To see the fs is configured run:
```bash
sudo ceph -s 
```
Wait for HEALTH_OK

### Mount CephFS volume

On every node, create a mountpoint for the data
```bash
sudo mkdir /var/data
```

Mount cephFS using systemd mount, since ceph mgr deployed in container and mount using fstab from cold boot sometime will not work because container not ready yet.

Create var-data.mount

```bash
sudo micro /etc/systemd/system/var-data.mount
```
```conf
[Unit]
Description=Mount CephFS
Requires=network-online.target local-fs.target docker.service
After=docker.service ceph.target
OnFailure=ceph-mount-helper.service

[Mount]
What=192.168.0.21:6789,192.168.0.22:6789,192.168.0.23:6789:/
Where=/var/data
Type=ceph
Options=name=admin,noatime,_netdev
TimeoutSec= 3min

[Install]
WantedBy=multi-user.target ceph.target
```

Specified OnFailure because container it's not ready yet, service helper will retry mounting cephFS until mounted.

Create ceph-mount-helper.service

```bash
sudo micro /etc/systemd/system/ceph-mount-helper.service
```
```conf
[Unit]
Description=ceph mount helper for cephFS cluster mount

[Service]
Type=oneshot
ExecStartPre=/usr/bin/sleep 5
ExecStart=/usr/bin/systemctl restart var-data.mount
Restart=on-failure
RestartSec=5s
TimeoutStartSec=200
TimeoutStopSec=120
StartLimitInterval=5min
StartLimitBurst=20
```

Reload and enable service

```bash
sudo systemctl daemon-reload
sudo systemctl enable var-data.mount
sudo systemctl start var-data.mount
```

### Ceph Dashboard

The dashboard will be accessible at https://ip_of_master_node:8443

#### Extra Options

Show Ceph Dashboard Config

```bash
sudo ceph config dump
```

Change Dashboard IP

```bash
sudo ceph config set mgr mgr/dashboard/server_addr NEW_IP
```

Change Grafana IP

```bash
sudo ceph dashboard set-grafana-api-url https://NEW_IP:3000
```

Change Prometheus API Host

```bash
sudo ceph dashboard set-prometheus-api-host http://NEW_IP:9095
```

Change Alertmanager API Host

```bash
sudo ceph dashboard set-alertmanager-api-host http://NEW_IP:9093
```
