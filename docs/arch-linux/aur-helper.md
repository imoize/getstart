---
title: Install AUR Helper and Enable multilib repository
sidebar_label: "AUR Helper"
# sidebar_position: 4
slug: "install-aur-helper-and-enable-multilib"
tags:
    - arch linux
    - tutorial
    - guide
# pagination_next: tail
---

## Update System

```bash
sudo pacman -Syu
```

## Installation

Install required packages:
```bash
sudo pacman -S --needed base-devel git
```

Clone the AUR helper repo (yay):
```bash
git clone https://aur.archlinux.org/yay.git
```
```bash
cd yay
```
```bash
makepkg -si
```

## Enable multilib repository

Edit pacman.conf:
```bash
sudo nano /etc/pacman.conf
```

Uncomment the following lines by removing the # character at the beginning of the line:
```bash
[multilib]
Include = /etc/pacman.d/mirrorlist
```

Update the system package database:
```bash
yay -Syu
```