---
title: Visual Studio Code
sidebar_label: "VS Code"
# sidebar_position: 4
slug: "vs-code"
tags:
    - arch linux
    - tutorial
    - guide
# pagination_next: tail
---

### Running natively under Wayland

Visual Studio Code uses Electron, see [Wayland#Electron](https://wiki.archlinux.org/title/Wayland#Electron) for more information on how to run it natively under Wayland.

```bash
--enable-features=WebRTCPipeWireCapturer --ozone-platform-hint=auto
```

### Native file dialog

If using Plasma, by default VS Code opens GTK file dialogs. To fix that, ensure that KDE desktop portal (xdg-desktop-portal-kde) is installed and set the GTK_USE_PORTAL=1 environment variable. also (xdg-desktop-portal-gtk) maybe needed.

Create ~/.config/xdg-desktop-portal directory
```bash
mkdir ~/.config/xdg-desktop-portal
```
Create kde-portals.conf file
```bash
nano ~/.config/xdg-desktop-portal/kde-portals.conf
```
Paste
```bash
[preferred]
default=kde;gtk
org.freedesktop.impl.portal.FileChooser=kde
```

Set GTK_USE_PORTAL=1 environment variable in /etc/environment, or to prevent break other things set env per application instead.

## Reference

[Arch Wiki Visual Studio Code](https://wiki.archlinux.org/title/Visual_Studio_Code)

[Arch Wiki XDG Desktop Portal](https://wiki.archlinux.org/title/XDG_Desktop_Portal)
