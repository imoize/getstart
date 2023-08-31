---
title: Set Fan Offset on Dell Power Edge
sidebar_label: "Dell PE Fan Offset"
tags:
    - server
    - tutorial
    - guide
# pagination_next: tail
---

The BMC/iDRAC in is programmed to set fan speed min/max and adjust values based on factors like ambient temperature and system configuration. Depending on configuration the system may run the fans at higher RPMs regardless of any detected temperature.

If you set Maximum Performance in BIOS (Power Management),  there is no way to adjust fan speed because when server start, IDrac set Fan Speed Offset to Max.

I used this on PowerEdge R620 but this adjustment can also be used on other Dell servers.

## Using Racadm

Set FanSpeed Offset value in IDrac via racadm.

### Ssh to idrac

```bash
ssh root@idrac-ip-address
```

### Get SpeedOffset value

```bash
racadm get system.thermalsettings.FanSpeedOffset
```

### Set SpeedOffset value

The X values are:

* 0 - Low Fan Speed
* 1 - High Fan Speed

```bash
racadm set system.thermalsettings.FanSpeedOffset X
```

## Using IPMI Tool

### Install IPMI Tool

```bash
sudo apt install ipmitool
```

### Manual Fan Control

* Enable Manual Fan Control
```bash 
ipmitool -I lanplus -H idrac-ip-address -U username -P password raw 0x30 0x30 0x01 0x00
```

* Disable Manual Fan Control
```bash 
ipmitool -I lanplus -H idrac-ip-address -U username -P password raw 0x30 0x30 0x01 0x01
``` 

### 3rd Party PCIe Response State

* 3rd Party PCIe Response State (Fast  fan speed when no therm sensors on PCIe card)
```bash
ipmitool -I lanplus -H idrac-ip-address -U username -P password raw 0x30 0xce 0x01 0x16 0x05 0x00 0x00 0x00 
```
`Result1= ... 00 00 00 (Enabled)`

`Result2= ... 01 00 00 (Disabled)`

* Enable 3rd Party PCIe Response
```bash
ipmitool -I lanplus -H idrac-ip-address -U username -P password raw 0x30 0xce 0x00 0x16 0x05 0x00 0x00 0x00 0x05 0x00 0x00 0x00 0x00  
```  

* Disable 3rd Party PCIe Response
```bash
ipmitool -I lanplus -H idrac-ip-address -U username -P password raw 0x30 0xce 0x00 0x16 0x05 0x00 0x00 0x00 0x05 0x00 0x01 0x00 0x00
```   

### Set All Fan Speed

* Set All Fans (0xff) to % (??) Speed (in Hexadecimal) -- See [Table](#percentages-to-hexadecimal--fan-speed-table) Below for Hex Value
```bash
ipmitool -I lanplus -H idrac-ip-address -U username -P password raw 0x30 0x30 0x02 0xff 0x??
```   

* Set All Fans (0xff) to 50% (0x32)
```bash
ipmitool -I lanplus -H idrac-ip-address -U username -P password raw 0x30 0x30 0x02 0xff 0x32
```

### Set Individual Fan Speed

* Set Fan1 (0x00) to 30%  (0x1E)   
```bash
ipmitool -I lanplus -H idrac-ip-address -U username -P password raw 0x30 0x30 0x02 0x00 0x1E
```              

* Set Fan2 (0x01) to 30% (0x1E)
```bash
ipmitool -I lanplus -H idrac-ip-address -U username -P password raw 0x30 0x30 0x02 0x01 0x1E
```

* Set Fan3 (0x02) to 30% (0x1E)
```bash
ipmitool -I lanplus -H idrac-ip-address -U username -P password raw 0x30 0x30 0x02 0x02 0x1E
```
:::tip NOTE
System fan #'s vary per chassis. Fan1 starts on the left side behind the Dell logo and can go up to 7 fans to the right side behind the Intel badge. The IPMI fan numbers are NOT the same as the Fan# labels on the chassis. Fan1=0x00, Fan2=0x01, Fan3=0x02, Fan4=0x03, Fan5=0x04, etc.
:::
### Percentages to Hexadecimal & Fan Speed Table

| Percentage % | Hexadecimal |   RPM   |
| :----------- |  :------:   |  :----: |
|     10%      |     0xA     |
|     11%      |     0xB     |
|     12%      |     0xC     |
|     13%      |     0xD     |
|     14%      |     0xE     |
|     15%      |     0xF     |
|     16%      |     0x10    | 3,300 RPM |
|     17%      |     0x11    |
|     18%      |     0x12    |
|     19%      |     0x13    |
|     20%      |     0x14    | 3,900 RPM |
|     21%      |     0x15    | 4,000 RPM |
|     22%      |     0x16    | 4,200 RPM |
|     23%      |     0x17    | 4,300 RPM |
|     24%      |     0x18    | 4,400 RPM |
|     25%      |     0x19    | 4,500 RPM |
|     26%      |     0x1A    | 4,700 RPM |
|     27%      |     0x1B    | 4,800 RPM |
|     28%      |     0x1C    | 5,000 RPM |
|     29%      |     0x1D    | 5,100 RPM | 
|     30%      |     0x1E    | 5,200 RPM |
|     31%      |     0x1F    | 5,400 RPM |
|     32%      |     0x20    | 5,500 RPM |
|     33%      |     0x21    | 5,700 RPM |
|     34%      |     0x22    | 5,800 RPM | 
|     35%      |     0x23    | 6,000 RPM |
|     36%      |     0x24    | 6,100 RPM |
|     37%      |     0x25    | 6,200 RPM |
|     38%      |     0x26    | 6,300 RPM |
|     39%      |     0x27    | 6,500 RPM |
|     40%      |     0x28    | 6,600 RPM |
|     41%      |     0x29    | 
|     42%      |     0x2A    | 
|     43%      |     0x2B    | 
|     44%      |     0x2C    | 
|     45%      |     0x2D    | 7,300 RPM |
|     46%      |     0x2E    | 
|     47%      |     0x2F    | 
|     48%      |     0x30    | 
|     49%      |     0x31    | 
|     50%      |     0x32    | 8,000 RPM |
|     51%      |     0x33    | 
|     52%      |     0x34    | 
|     53%      |     0x35    | 
|     54%      |     0x36    | 
|     55%      |     0x37    | 
|     56%      |     0x38    | 
|     57%      |     0x39    | 
|     58%      |     0x3A    | 
|     59%      |     0x3B    | 
|     60%      |     0x3C    | 9,400 RPM |
|     61%      |     0x3D    | 
|     62%      |     0x3E    | 
|     63%      |     0x3F    | 
|     64%      |     0x40    | 
|     65%      |     0x41    | 
|     66%      |     0x42    | 
|     67%      |     0x43    | 
|     68%      |     0x44    | 
|     69%      |     0x45    | 
|     70%      |     0x46    | 10,800 RPM |
|     71%      |     0x47    | 
|     72%      |     0x48    | 
|     73%      |     0x49    | 
|     74%      |     0x4A    | 
|     75%      |     0x4B    | 
|     76%      |     0x4C    | 
|     77%      |     0x4D    | 
|     78%      |     0x4E    | 
|     79%      |     0x4F    | 
|     80%      |     0x50    | 12,100 RPM |
|     81%      |     0x51    | 
|     82%      |     0x52    | 
|     83%      |     0x53    | 
|     84%      |     0x54    | 
|     85%      |     0x55    | 
|     86%      |     0x56    | 
|     87%      |     0x57    | 
|     88%      |     0x58    | 
|     89%      |     0x59    | 
|     90%      |     0x5A    | 13,300 RPM |
|     91%      |     0x5B    | 
|     92%      |     0x5C    | 
|     93%      |     0x5D    | 
|     94%      |     0x5E    | 
|     95%      |     0x5F    | 
|     96%      |     0x60    | 
|     97%      |     0x61    | 
|     98%      |     0x62    | 
|     99%      |     0x63    | 
|     100%     |     0x64    | 15,000 RPM |