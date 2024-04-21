---
title: Cleanup Unused Packages
sidebar_label: "Cleanup Packages"
# sidebar_position: 4
slug: "cleanup"
tags:
    - arch linux
    - tutorial
    - guide
# pagination_next: tail
---

## Clean Pkg Cache

### Manually Remove

List packages
```bash
ls /var/cache/pacman/pkg/ | less 
```

Remove all pkg except those installed
```bash
sudo pacman -Sc 
```

Remove all files
```bash
sudo pacman -Scc
```

### Automatically Remove

Install required packages
```bash
sudo pacman -S pacman-contrib
```

Remove
```bash
paccache -r
```

Systemd timer create file in /etc/systemd/system/paccache.timer with the following contents
```bash
[Unit]
Description=Clean-up old pacman pkg cache

[Timer]
OnCalendar=monthly
Persistent=true

[Install]
WantedBy=multi-user.target
```

Enable by sudo systemctl start paccache.timer

Pacman post-transaction hook

## Remove Unused Packages

List unused
```bash
sudo pacman -Qtdq
```

Remove unused
```bash
sudo pacman -Rcns $(pacman -Qtdq)
```

Remove the cache of all uninstalled packages
```bash
paccache -ruk0
```

## Clean home cache

cache is located in ~/.cache

## Config Files

stored in ~/.config/

## Find and remove

install rmlint package sudo pacman -S rm lint.

## Reference

[Arch Wiki Pacman](https://wiki.archlinux.org/title/Pacman#Removing_packages)

[Cleanup Arch Linux](https://gist.github.com/rumansaleem/083187292632f5a7cbb4beee82fa5031)