---
title: Create LVM Volume With Extend and Reduce
sidebar_label: "Create LVM Volume"
tags:
    - tutorial
    - guide
# pagination_next:
---

Traditional storage capacity is based on individual disk capacity. LVM uses a different concept. Storage space is managed by combining or pooling the capacity of the available drives. With traditional storage, three 1 TB disks are handled individually. With LVM, those same three disks are considered to be 3 TB of aggregated storage capacity. This is accomplished by designating the storage disks as Physical Volumes (PV), or storage capacity useable by LVM. The PVs are then added to one or more Volume Groups (VGs). The VGs are carved into one or more Logical Volumes (LVs), which then are treated as traditional partitions.

## Logical Volume Manager
:::tip NOTE 
* To create lvm login as root or use sudo.
:::

### Install a new hard disk drive
Obviously, there needs to be a storage disk available. Physically install a drive in the server or assign disk in vm.

### Designate Physical Volumes
Physical Volumes (PV) are disks or partitions that are available to LVM as potential storage capacity. They have identifiers and metadata that describes each PV. It is interesting to note that, as opposed to RAID, PVs do not have to be the same size or or on disks that are the same speed. You can mix and match drive types to create PVs. To implement LVM, first designate a drive as a Physical Volume.

Command to create a PV:

```bash
pvcreate /dev/sdb
```

Display PV capacity and additional information:

```bash
pvdisplay
```

### Manage Volume Groups
Once one or more of the disks are available to LVM as Physical Volumes, the storage capacity is combined into Volume Groups (VGs). There may be more than one VG on a server, and disks may be members of more than one VG (but PVs themselves may only be members of one VG).

Use the vgcreate command to create a new Volume Group. The VG must have at least one member.

Command to create a VG:

```bash
vgcreate vg0 /dev/sdb
```

Display information for a VG named vg0:

```bash
vgdisplay vg0
```

### Manage Logical Volumes
The VG can be subdivided into one or more Logical Volumes (LVs). These Logical Volumes are then used as if they were traditional partitions. The VG has a total capacity, and then some part of that capacity is allocated to a Logical Volume.

The lvcreate command carves storage capacity from a VG. There are a few options to be aware of.

| Option | Description |
| :-----:|  :------- : |
| -n     | Name of LV - ex. lv_mydata |
| -L     | Size in G or T - ex. 10G |
| -q     | Quiet, suppresses command output |
| -v     | Verbose mode providing additional details |

Command to create a LV:

```bash
lvcreate -L 10G -n lv_mydata vg0
```

Display information for a LV:

```bash
lvdisplay /dev/vg0/lv_mydata
```

### Apply a filesystem and set a mount point
Once the LV is created, it is managed as any other partition. It needs a filesystem and a mount point, just like we configured in the standard partition management section above.

Create ext4 fs:

```bash
mkfs.ext4 /dev/vg0/lv_mydata 
```

Create a mount point directory:

```bash
mkdir /mnt/mydata
```

Manually mount the volume:

```bash
mount -t ext4 /dev/vg0/lv_mydata /mnt/mydata
```

Mount the volume automatically:

First find disk UUID
```bash
blkid /dev/vg0/lv_mydata
```

Edit the /etc/fstab file
```bash
nano /etc/fstab
```

Put in newline
```bash
UUID=disk-uuid-from-blkid-command     /mnt/mydata     ext4     defaults    0 2
```

## Increase capacity
You can add storage capacity to the Logical Volume. This is useful if the users consume more space than you anticipated. The process is pretty logical:

1. Add a disk and configure it as a PV.
2. Add it to a VG.
3. Add the capacity to the LV and then extend the filesystem.

### Add second storage disk and then configure it as a PV
To increase capacity, install a new disk and configure it as a PV, as per the steps above. If there is already a disk with free space available.

Command to create a PV:

```bash
pvcreate /dev/sdc
```

### Add space to the VG
Once the new capacity is designated for LVM, you can add it to the VG, increasing the pool's size.

Command to add a new PV to an existing VG:

```bash
vgextend vg0 /dev/sdc
```

### Add space to the LV

Command to extend logical volume and resize the file system:

```bash
lvextend -r -L +15G /dev/vg0/lv_mydata
```
* -r will extend logical volume and resize the file system, since ext4 support on-line extend volume.

or if lvextend was executed without -r:

```bash
resize2fs /dev/vg0/lv_mydata
```

## Reduce capacity 
Reducing storage space is a less common task, but it's worth noting. The process occurs in the opposite order from expanding storage.

:::danger NOTE
You can only grow an ext4 filesystem on-line. If you want to shrink it, you will need to unmount it first.
:::

### Unmount volume
```bash
umount /dev/vg0/lv_mydata
```

###  Reduce the LV
It is recommended that you run `fsck` on ext4 filesystems before shrinking them. It is also recommended that you back up the data on the LV in case something unexpected occurs.

Command to reduce logical volume and resize the file system:

```bash
lvreduce -r -L -2T /dev/vg0/lv_mydata
```
