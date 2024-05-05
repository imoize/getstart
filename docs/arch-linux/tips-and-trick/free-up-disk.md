---
title: Free up Disk Space
sidebar_label: "Free up Disk Space"
# sidebar_position: 4
slug: "free-up-disk-space"
tags:
    - arch linux
    - tutorial
    - guide
# pagination_next: tail
---

## Remove Unused Packages

To check for such unused dependencies run:
```bash
sudo pacman -Qtdq
```

To remove the above packages run:
```bash
sudo pacman -Rns $(pacman -Qtdq)
```

## Clean the package cache

Pacman stores its downloaded packages in /var/cache/pacman/pkg/ and does not remove old or uninstalled versions automatically. You can either remove old packages manually or use a script.

### Manually Remove

Check the packages that exist in the pacman cache:
```bash
ls /var/cache/pacman/pkg/ | less 
```
or
```bash
ls /var/cache/pacman/pkg/
```

Remove all cached packages except from those that are installed:
```bash
sudo pacman -Sc 
```

If you want to remove all cached packages:
```bash
sudo pacman -Scc
```

### Using paccache

An alternative to the manual removal of packages is paccache; a script that deletes all cached versions of installed and uninstalled packages, except for the most recent three, by default.

First install paccache:
```bash
sudo pacman -S pacman-contrib
```

Check which packages can be removed:
```bash
paccache -d
```

Delete the packages:
```bash
paccache -r
```

Remove the cache of all uninstalled packages:
```bash
paccache -ruk0
```

#### Run paccache automatically

You can also enable and start the paccache.timer service to automatically remove unused packages weekly:

```bash
sudo systemctl enable paccache.timer
```
```bash
sudo systemctl start paccache.timer
```

If paccache.timer is not available then create manually.

Create systemd timer file:
```bash
sudo nano /etc/systemd/system/paccache.timer
```

Add this following contents:
```bash
[Unit]
Description=Clean-up old pacman pkg cache

[Timer]
OnCalendar=monthly
Persistent=true

[Install]
WantedBy=multi-user.target
```

And enable paccache.timer service.

## Clean home directory cache

Your applications will use the .cache directory in your home directory to store cached data. Usually it's safe to remove files from here as applications will recreate any needed data. Proceed with caution though.

You can use the following command to check which directories are taking up most of the space
```bash
du --max-depth=1 ~/.cache | sort -hr
```

Alternatively you can use the [ndcu](https://dev.yorhel.nl/ncdu) tool, a disk analyzer with an ncurses interface.

## Find and remove duplicate files

rmlint is a handy tool that scans your filesystem to find duplicate files and directories.

    rmlint will also detect empty directories and broken symbolic links. While they don't take any meaningful disk space, they still clutter your system.

Install rmlint using:
```bash
sudo pacman -S rmlint
```
and run it:
```bash
rmlint -g [directory]
```

After it completes, rmlint will create a rmlint.sh script in the directory where it was executed. You can inspect the script to check what is going to be deleted, manually remove any files you want to keep, and finally execute the script.

## Config Files

Config file is located in
```bash
~/.config
```

## Reference

[Arch Wiki Pacman](https://wiki.archlinux.org/title/Pacman#Removing_packages)