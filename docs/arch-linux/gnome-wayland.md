---
title: GNOME Wayland
sidebar_label: "GNOME Wayland"
# sidebar_position: 4
slug: "gnome-wayland"
tags:
    - arch linux
    - tutorial
    - guide
# pagination_next: tail
---

Edit GDM custom.conf
```bash
sudo nano /etc/gdm/custom.conf
```

Replace 
```bash
#WaylandEnable=false
```
With
```bash
WaylandEnable=true
```

Disable GDM udev rules which force the use of Xorg

```bash
sudo ln -s /dev/null /etc/udev/rules.d/61-gdm.rules
```
