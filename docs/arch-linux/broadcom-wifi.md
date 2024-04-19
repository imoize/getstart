---
title: Broadcom Wifi
sidebar_label: "Broadcom Wifi"
# sidebar_position: 4
slug: "broadcom-wifi"
tags:
    - arch linux
    - tutorial
    - guide
# pagination_next: tail
---

## Install Drivers

```bash
sudo pacman -S linux-headers broadcom-wl-dkms
```

## Blacklist driver

```bash
sudo nano /etc/modprobe.d/broadcom-wl-dkms.conf
```

Paste
```bash
blacklist b43
blacklist b43legacy
blacklist bcm43xx
blacklist bcma
blacklist brcm80211
blacklist brcmfmac
blacklist brcmsmac
blacklist ssb
```

## Update and Reboot

Regenerate the initramfs

```bash
sudo mkinitcpio -p
```

Reboot

## Reference

[Arch Wiki Broadcom wireless](https://wiki.archlinux.org/title/broadcom_wireless)