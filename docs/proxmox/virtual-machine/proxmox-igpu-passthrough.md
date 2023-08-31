---
title: "Proxmox Windows 11 with iGPU Passtrhough"
sidebar_label: "Windows 11 iGPU Passthrough"
slug: windows11-igpu-passthrough
tags:
  - ubuntu
  - proxmox
  - windows-11
---

<!-- Before start you need to enable iommu please follow [this guide](https://pve.proxmox.com/wiki/PCI_Passthrough). -->

I'm using intel 4th gen cpu with intel HD4600.

1. Add this line to /etc/kernel/cmdline next to `boot:zfs`

```conf
quiet intel_iommu=on iommu=pt irqpool video=vesafb:off video=efifb:off initcall_blacklist=sysfb_init
```

:::info note

If you not using zfs then edit file in `/etc/default/grub`

Look for this line:

GRUB_CMDLINE_LINUX_DEFAULT="quiet"

And add after quiet line.

:::

Update proxmox boot tool:

```bash
proxmox-boot-tool refresh
```

2. Edit `/etc/modules` and add VFIO module

```conf
vfio
vfio_iommu_type1
vfio_pci
vfio_virqfd
```

3. IOMMU interrupt remaping

```bash
echo "options vfio_iommu_type1 allow_unsafe_interrupts=1" > /etc/modprobe.d/iommu_unsafe_interrupts.conf
echo "options kvm ignore_msrs=1" > /etc/modprobe.d/kvm.conf
```

4. Blacklisting driver

```bash
echo "blacklist i915" >> /etc/modprobe.d/blacklist.conf
```

5. Adding GPU to VFIO

```bash
lspci -v
```

:::info
You will see output like this

00:02.0 VGA compatible controller: Intel Corporation 4th Gen Core Processor Integrated Graphics Controller (rev 06) (prog-if 00 [VGA controller])

Make note of the first set of numbers (e.g. 00:02.0). We'll need them for the next step.
:::

Run the command below. Replace 01:00 with whatever number was next to your GPU when you ran the previous command:

```bash
lspci -n -s 00:02
```

:::info

Doing this should output your GPU card's Vendor IDs. It'll look a little something like this:

00:02.0 0300: 8086:0416 (rev 06)

What we want to keep, are these vendor id codes: 8086:0416.

:::

Now we add the GPU's vendor id's to the VFIO (remember to replace the id's with your own!):

```bash
echo "options vfio-pci ids=8086:0416 disable_vga=1"> /etc/modprobe.d/vfio.conf
```

Finally, we run this command:

```bash
update-initramfs -u
```

And reboot:

```bash
reboot
```

Now your Proxmox host should be ready to passthrough GPUs!

### Edit VM configuration

```bash
micro /etc/pve/qemu-server/100.conf
```

![](/img/windows11-igpu/figure1.png)

![](/img/windows11-igpu/figure2.png)