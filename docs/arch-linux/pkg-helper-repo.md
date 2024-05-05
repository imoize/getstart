---
title: Install Package Manager, AUR Helper and Enable multilib repository
sidebar_label: "Package Manager, Helper and Repo"
sidebar_position: 2
slug: "install-pkg-manager-aur-helper-and-enable-multilib"
tags:
    - arch linux
    - tutorial
    - guide
# pagination_next: tail
---

## Prerequisite

Update System
```bash
sudo pacman -Syu
```

Install required packages:
```bash
sudo pacman -S --needed base-devel git
```
## Pacman/AUR front end

### Octopi

```bash
sudo pacman -S octopi
```

## AUR Helper

### Paru

```bash
git clone https://aur.archlinux.org/paru.git
```

```bash
cd paru
```

```bash
makepkg -si
```

### Yay

```bash
git clone https://aur.archlinux.org/yay.git
```
```bash
cd yay
```
```bash
makepkg -si
```

## Enable chaotic-aur

Follow this [link.](https://aur.chaotic.cx/)

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
sudo pacman -Syy
```

## Reference

[Paru](https://github.com/Morganamilo/paru)

[Yay](https://github.com/Jguer/yay)

[Chaotic AUR](https://aur.chaotic.cx/)