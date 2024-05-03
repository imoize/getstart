---
title: Plymouth Boot Screen
sidebar_label: "Plymouth"
# sidebar_position: 4
slug: "plymouth"
tags:
    - arch linux
    - tutorial
    - guide
# pagination_next: tail
---

## Installation

Install required packages:
```bash
sudo pacman -S plymouth
```

## Configuration

### Add hooks to mkinitcpio

Add plymouth to the HOOKS array in mkinitcpio.conf:

```bash
sudo nano /etc/mkinitcpio.conf
```

Put plymouth after udev hook:
```bash
HOOKS=(base udev plymouth autodetect keyboard keymap modconf block filesystems fsck)
```
If you are using the systemd hook, plymouth must be after systemd.

### Setting Kernel Parameter

#### Systemd Boot

Find appropriate .conf file for your Arch Linux boot entry:

```bash
sudo bootctl list --no-pager
```

Choose (selected) one:
```bash title="Output"
type: Boot Loader Specification Type #1 (.conf)
title: Arch Linux (linux) (default) (selected)
id: 2024-04-17_03-56-59_linux.conf
source: /boot//loader/entries/2024-04-17_03-56-59_linux.conf
linux: /boot//vmlinuz-linux
initrd: /boot//intel-ucode.img
/boot//initramfs-linux.img
options: root=PARTUUID=59502541-5885-4214-bad2-5b79f7f47ca0 zswap.enabled=0 rootflags=subvol=@ rw rootfstype=btrfs
```

Navigate to the bootloader entries directory:
```bash
cd /boot/loader/entries/
```

Edit the appropriate .conf file for your Arch Linux boot entry:
```bash
sudo nano 2024-04-17_03-56-59_linux.conf
```

Append this parameter to the end of `options` line:
```bash
quiet splash loglevel=3 rd.udev.log_priority=3 vt.global_cursor_default=0
```

## Set Plymouth Theme

List available theme:
```bash
sudo plymouth-set-default-theme -l
```

Apply preferred theme:
```bash
sudo plymouth-set-default-theme -R "THEME"
```

## Customization

Theme folder is located at /usr/share/plymouth/themes/

### Preview themes
Themes can be previewed without rebuilding initrd, press Ctrl+Alt+F6 to switch to a text terminal, log in as root and type:

```bash
plymouthd
```
```bash
plymouth --show-splash
```
To quit the preview, press Ctrl+Alt+F6 again and type:
```bash
plymouth --quit
```
You can run these commands as root in a running X.Org session too, but the Plymouth window may cover your terminal window and lock itself on top. Have virtual desktops handy.

## Update and Reboot

Regenerate the initramfs:
```bash
sudo mkinitcpio -P
```

You can now safely reboot.