---
title: How to Partition, Format, and Mount drive
sidebar_label: "Format and Mount Drive"
tags:
    - ubuntu
    - tutorial
    - guide
# pagination_next: tail
---

## List logical disks and partitions

```bash
sudo fdisk -l
```

## Partition the disk

```bash
sudo fdisk /dev/sdb
```
:::tip NOTE
* Press `n` to create a partition
* Press `p` or `l` to create primary or logical partitions
* Press `w` to write your changes or `q` to quit
:::

## Format the partition

```bash
sudo mkfs -t ext4 /dev/sdb1
```
```bash
sudo mkfs -t ext4 -N 2000000 /dev/sdb1
```
* This will manually set the number of inodes to 2,000,000

## Mount disk

Shows what is mounted
```bash
mount
```
```bash
mkdir /mnt/mydrive
```
```bash
mount -t ext4 /dev/sdb1 /mnt/mydrive
```

## Get disk's UUID

```bash
ls -al /dev/disk/by-uuid/
```
or  
```bash
blkid
```

## Mount at boot

Add the following line to your `/etc/fstab` file adjusting the UUID to your device's id and the directory to where you want to mount:

`UUID=811d3de0-ca6b-4b61-9445-af2e306d9999	/mnt/mydrive	ext4	defaults 0 0`

Mounts filesystems from `/etc/fstab`
```bash
sudo mount -a 
```