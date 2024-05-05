---
title: Gaming
sidebar_label: "Gaming"
# sidebar_position: 4
slug: "gaming"
tags:
    - arch linux
    - tutorial
    - guide
# pagination_next: tail
---

:::tip NOTE
Enable multilib repo first. [See here](./pkg-helper-repo.md)
:::

## Prerequisite

Upgrade system:
```bash
sudo pacman -Syu
```

Install required packages execute the following command:
```bash
sudo pacman -S --needed wine-staging wine-mono giflib lib32-giflib libpng lib32-libpng libldap lib32-libldap gnutls lib32-gnutls \
mpg123 lib32-mpg123 openal lib32-openal v4l-utils lib32-v4l-utils libpulse lib32-libpulse libgpg-error \
lib32-libgpg-error alsa-plugins lib32-alsa-plugins alsa-lib lib32-alsa-lib libjpeg-turbo lib32-libjpeg-turbo \
sqlite lib32-sqlite libxcomposite lib32-libxcomposite libxinerama lib32-libgcrypt libgcrypt lib32-libxinerama \
ncurses lib32-ncurses ocl-icd lib32-ocl-icd libxslt lib32-libxslt libva lib32-libva gtk3 \
lib32-gtk3 gst-plugins-base-libs lib32-gst-plugins-base-libs vulkan-icd-loader lib32-vulkan-icd-loader
```

Disclaimer: this may seem like a lot of libraries to install, but in order for games to install and work correctly, you will need them.

## Steam

```bash
sudo pacman -S steam lib32-systemd
```

## Launcher

### Heroic

```bash
paru -S heroic-games-launcher-bin
```

### Lutris

```bash
sudo pacman -S lutris
```

## Tools

### ProtonUp-Qt
Install and manage GE-Proton, Luxtorpeda & more for Steam and Wine-GE & more for Lutris with this graphical user interface. 

```bash
paru -S protonup-qt
```

## Reference
[Arch Wiki Steam](https://wiki.archlinux.org/title/steam)