---
title: Kde Connect
sidebar_label: "Kde Connect"
# sidebar_position: 4
slug: "kde-connect"
tags:
    - arch linux
    - tutorial
    - guide
# pagination_next: tail
---

KDE Connect is a tool that allows users to connect their Linux systems with other devices, which may be another system running Windows, macOS, Linux, or Android. KDE Connect is a useful tool developed by the people working at KDE that easily allows communication between many different kinds of devices.

## Problem

After installing KDE-connect to both your PC and phone and on same network but still not able to connect. As when you open KDE-connect it does not show any device.

## Reason

KDE Connect uses dynamic ports in the range 1714–1764 for UDP and TCP. So if you are behind a firewall, make sure to open this port range for both TCP and UDP. Otherwise, make sure your network is not blocking UDP broadcast packets.

## Solution

### Make some changes in IPtables;

Run following 2 commands in your terminal.

```bash
sudo iptables -I INPUT -p tcp --dport 1714:1764 -j ACCEPT
```
```bash
sudo iptables -I INPUT -p udp --dport 1714:1764 -j ACCEPT
```

And that’s it now you hopefully see the devices, now you can pair it and start using it.

## Reference

[KDE Connect Wiki](https://userbase.kde.org/KDEConnect#)

[KDE Connect Not showing any devices](https://ahnashwin1305.medium.com/kde-connect-not-showing-any-devices-solution-99f2eb176de6)