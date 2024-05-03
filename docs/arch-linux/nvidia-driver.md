---
title: NVIDIA
sidebar_label: "NVIDIA"
# sidebar_position: 4
slug: "nvidia"
tags:
    - arch linux
    - tutorial
    - guide
# pagination_next: tail
---

# NVIDIA

:::warning
Enable multilib repo first.

Avoid installing the NVIDIA driver through the package provided from the NVIDIA website. Installation through pacman allows upgrading the driver together with the rest of the system.
:::

If you do not know what graphics card you have, find out by issuing:

```bash
$ lspci -k | grep -A 2 -E "(VGA|3D)"
```
## Install Drivers

Update the system:
```bash
sudo pacman -Syu
```

Install required packages
```bash
sudo pacman -S base-devel linux-headers --needed
```

Install Nvidia driver
```bash
sudo pacman -S nvidia nvidia-utils nvidia-settings nvidia-prime lib32-nvidia-utils opencl-nvidia
```

## Enabling DRM kernel mode setting

:::warning
In this step please complete all the parts: Setting the Kernel Module Parameter, Add Early Loading of NVIDIA Modules, and Adding the Pacman Hook.
:::

Since NVIDIA does not support automatic KMS late loading, enabling DRM (Direct Rendering Manager) kernel mode setting is required to make Wayland compositors function properly, or to allow for Xorg Rootless Xorg.

Additionally, with the driver version 545 and above, you can also set the experimental nvidia_drm.fbdev=1 parameter, which is required to tell the NVIDIA driver to provide its own framebuffer device instead of relying on efifb or vesafb, which do not work under simpledrm.

### Setting the Kernel Module Parameter

Setting the kernel module parameter in /etc/modprobe.d

```bash
sudo nano /etc/modprobe.d/nvidia-drm.conf
```

Paste

```bash
options nvidia-drm modeset=1 fbdev=1
```
* `nvidia_drm` also can be used.

### Optional, Setting the Kernel Parameter

:::tip NOTE
Optionally if you use -dkms driver version then use Kernel Parameter.

If not using -dkms then skip to [Early Loading of NVIDIA Modules](#early-loading-of-nvidia-modules) section.
:::

Setting the kernel parameter depends on what bootloader you are using. 

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
nvidia-drm.modeset=1 nvidia-drm.fbdev=1
```

### Early Loading of NVIDIA Modules

:::warning

To prevent race condition between intel and nvidia, put i915 driver to MODULES array.
:::

Edit the mkinitcpio configuration file:
```bash
sudo nano /etc/mkinitcpio.conf
```

Find the line that says MODULES=() update the line to:
```bash
MODULES=(i915 nvidia nvidia_modeset nvidia_uvm nvidia_drm)
```

Find the line that says HOOKS=() and find the word `kms` and remove it

### Adding the Pacman Hook

:::tip NOTE
*-dkms packages do not need it as their upgrades will automatically trigger a mkinitcpio run.
:::

To avoid the possibility of forgetting to update initramfs after an NVIDIA driver upgrade, you may want to use a pacman hook:
```bash
sudo nano /etc/pacman.d/hooks/nvidia.hook
```

Paste this hook:
```bash
[Trigger]
Operation=Install
Operation=Upgrade
Operation=Remove
Type=Package
# Uncomment the installed NVIDIA package
Target=nvidia
#Target=nvidia-open
#Target=nvidia-lts
Target=linux
# Change the linux part above if a different kernel is used

[Action]
Description=Update NVIDIA module in initcpio
Depends=mkinitcpio
When=PostTransaction
NeedsTargets
Exec=/bin/sh -c 'while read -r trg; do case $trg in linux*) exit 0; esac; done; /usr/bin/mkinitcpio -P'
```

## PRIME render offload

To run a program on the NVIDIA card you can use the prime-run script provided by [nvidia-prime](https://archlinux.org/packages/extra/any/nvidia-prime/):

```bash
prime-run glxinfo | grep "OpenGL renderer"
prime-run vulkaninfo
```
### Configure applications to render using GPU

To run an application offloaded to the NVIDIA GPU with Dynamic Power Management enabled, add the following environment variables:

```bash
__NV_PRIME_RENDER_OFFLOAD=1 __GLX_VENDOR_LIBRARY_NAME=nvidia command
```

When using on a Steam game, the launcher command line can be set to:
```bash
__NV_PRIME_RENDER_OFFLOAD=1 __GLX_VENDOR_LIBRARY_NAME=nvidia %command%
```

:::tip NOTE
 The value of __NV_PRIME_RENDER_OFFLOAD may need to be set to 0 depending on the system. It is recommended to check which GPU is 0 and which is 1 since this variable specifies which GPU will be used.
 :::

## Update and Reboot

Regenerate the initramfs:
```bash
sudo mkinitcpio -P
```

Optional update systemd-boot:

* mkinitcpio -P alone will update systemd-boot, but anyway
```bash
sudo bootctl update
```

You can now safely reboot and enjoy the proprietary NVIDIA drivers.

To verify nvidia_drm.modeset=1 was correctly applied after a reboot, execute the following:

```bash
sudo cat /sys/module/nvidia_drm/parameters/modeset
```
Which should now return Y, and not N anymore.

If you have any problems check the Arch Linux Wiki or the forums for common pitfalls and questions.

## Reference

[Arch Wiki NVIDIA](https://wiki.archlinux.org/title/NVIDIA)

[Arch Wiki PRIME](https://wiki.archlinux.org/title/PRIME)

[Nvidia Prime script](https://archlinux.org/packages/extra/any/nvidia-prime/)

[Arch Wiki Kernel Parameters](https://wiki.archlinux.org/title/Kernel_parameters#systemd-boot)

[Arch Wiki Setting Module Options](https://wiki.archlinux.org/title/Kernel_module#Setting_module_options)