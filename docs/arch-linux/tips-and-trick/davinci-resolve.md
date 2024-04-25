---
title: DaVinci Resolve
sidebar_label: "DaVinci Resolve"
# sidebar_position: 4
slug: "davinci-resolve"
tags:
    - arch linux
    - tutorial
    - guide
# pagination_next: tail
---



## Error when launch application

Error output like this:

/opt/resolve/bin/resolve: symbol lookup error: /usr/lib/libgdk_pixbuf-2.0.so.0: undefined symbol: g_task_set_static_name

This is because resolve was indeed shipping an outdated version of libgio.

### Workaround

```bash
cd /opt/resolve/libs
```
```bash
sudo mkdir disabled-libraries
```
```bash
sudo mv libglib* disabled-libraries
sudo mv libgio* disabled-libraries
sudo mv libgmodule* disabled-libraries
```

## Application window misses title bar

Go to System Settings > Window Management > Window Rules and Add New

![](/img/arch-linux/Screenshot_20240423_034602.png)

## Reference

[Arch Wiki DaVinci Resolve](https://wiki.archlinux.org/title/DaVinci_Resolve)

[Github Tutorial](https://github.com/H3rz3n/Davinci-Resolve-Fedora-39-Fix)

[Reddit Forum](https://www.reddit.com/r/voidlinux/comments/12g71x0/davinci_resolve_18_symbol_lookup_error_libgdk/)