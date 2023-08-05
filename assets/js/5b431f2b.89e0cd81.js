"use strict";(self.webpackChunkgetstart=self.webpackChunkgetstart||[]).push([[344],{3905:(e,t,n)=>{n.d(t,{Zo:()=>u,kt:()=>g});var o=n(7294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);t&&(o=o.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,o)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,o,r=function(e,t){if(null==e)return{};var n,o,r={},a=Object.keys(e);for(o=0;o<a.length;o++)n=a[o],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(o=0;o<a.length;o++)n=a[o],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var s=o.createContext({}),p=function(e){var t=o.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},u=function(e){var t=p(e.components);return o.createElement(s.Provider,{value:t},e.children)},m="mdxType",c={inlineCode:"code",wrapper:function(e){var t=e.children;return o.createElement(o.Fragment,{},t)}},d=o.forwardRef((function(e,t){var n=e.components,r=e.mdxType,a=e.originalType,s=e.parentName,u=l(e,["components","mdxType","originalType","parentName"]),m=p(n),d=r,g=m["".concat(s,".").concat(d)]||m[d]||c[d]||a;return n?o.createElement(g,i(i({ref:t},u),{},{components:n})):o.createElement(g,i({ref:t},u))}));function g(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var a=n.length,i=new Array(a);i[0]=d;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l[m]="string"==typeof e?e:r,i[1]=l;for(var p=2;p<a;p++)i[p]=n[p];return o.createElement.apply(null,i)}return o.createElement.apply(null,n)}d.displayName="MDXCreateElement"},8217:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>s,contentTitle:()=>i,default:()=>c,frontMatter:()=>a,metadata:()=>l,toc:()=>p});var o=n(7462),r=(n(7294),n(3905));const a={title:"Proxmox Windows 11 with iGPU Passtrhough",sidebar_label:"Windows 11 iGPU Passthrough",sidebar_position:1,tags:["ubuntu","proxmox","windows-11"]},i=void 0,l={unversionedId:"proxmox/virtual-machine/proxmox-igpu-passthrough",id:"proxmox/virtual-machine/proxmox-igpu-passthrough",title:"Proxmox Windows 11 with iGPU Passtrhough",description:"I'm using intel 4th gen cpu with intel HD4600.",source:"@site/docs/proxmox/virtual-machine/proxmox-igpu-passthrough.md",sourceDirName:"proxmox/virtual-machine",slug:"/proxmox/virtual-machine/proxmox-igpu-passthrough",permalink:"/getstart/proxmox/virtual-machine/proxmox-igpu-passthrough",draft:!1,tags:[{label:"ubuntu",permalink:"/getstart/tags/ubuntu"},{label:"proxmox",permalink:"/getstart/tags/proxmox"},{label:"windows-11",permalink:"/getstart/tags/windows-11"}],version:"current",lastUpdatedBy:"imoize",lastUpdatedAt:1691211684,formattedLastUpdatedAt:"Aug 5, 2023",sidebarPosition:1,frontMatter:{title:"Proxmox Windows 11 with iGPU Passtrhough",sidebar_label:"Windows 11 iGPU Passthrough",sidebar_position:1,tags:["ubuntu","proxmox","windows-11"]},sidebar:"tutorialSidebar",previous:{title:"Install K3s on Lxc",permalink:"/getstart/proxmox/lxc/install-k3s-on-lxc"},next:{title:"Install Ubuntu 23.10 on Proxmox VM",permalink:"/getstart/proxmox/virtual-machine/ubuntu-server"}},s={},p=[{value:"Edit VM configuration",id:"edit-vm-configuration",level:3}],u={toc:p},m="wrapper";function c(e){let{components:t,...a}=e;return(0,r.kt)(m,(0,o.Z)({},u,a,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("p",null,"I'm using intel 4th gen cpu with intel HD4600."),(0,r.kt)("ol",null,(0,r.kt)("li",{parentName:"ol"},"Add this line to /etc/kernel/cmdline next to ",(0,r.kt)("inlineCode",{parentName:"li"},"boot:zfs"))),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-conf"},"quiet intel_iommu=on iommu=pt irqpool video=vesafb:off video=efifb:off initcall_blacklist=sysfb_init\n")),(0,r.kt)("admonition",{title:"note",type:"info"},(0,r.kt)("p",{parentName:"admonition"},"If you not using zfs then edit file in ",(0,r.kt)("inlineCode",{parentName:"p"},"/etc/default/grub")),(0,r.kt)("p",{parentName:"admonition"},"Look for this line:"),(0,r.kt)("p",{parentName:"admonition"},'GRUB_CMDLINE_LINUX_DEFAULT="quiet"'),(0,r.kt)("p",{parentName:"admonition"},"And add after quiet line.")),(0,r.kt)("p",null,"Update proxmox boot tool:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"proxmox-boot-tool refresh\n")),(0,r.kt)("ol",{start:2},(0,r.kt)("li",{parentName:"ol"},"Edit ",(0,r.kt)("inlineCode",{parentName:"li"},"/etc/modules")," and add VFIO module")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-conf"},"vfio\nvfio_iommu_type1\nvfio_pci\nvfio_virqfd\n")),(0,r.kt)("ol",{start:3},(0,r.kt)("li",{parentName:"ol"},"IOMMU interrupt remaping")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},'echo "options vfio_iommu_type1 allow_unsafe_interrupts=1" > /etc/modprobe.d/iommu_unsafe_interrupts.conf\necho "options kvm ignore_msrs=1" > /etc/modprobe.d/kvm.conf\n')),(0,r.kt)("ol",{start:4},(0,r.kt)("li",{parentName:"ol"},"Blacklisting driver")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},'echo "blacklist i915" >> /etc/modprobe.d/blacklist.conf\n')),(0,r.kt)("ol",{start:5},(0,r.kt)("li",{parentName:"ol"},"Adding GPU to VFIO")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"lspci -v\n")),(0,r.kt)("admonition",{type:"info"},(0,r.kt)("p",{parentName:"admonition"},"You will see output like this"),(0,r.kt)("p",{parentName:"admonition"},"00:02.0 VGA compatible controller: Intel Corporation 4th Gen Core Processor Integrated Graphics Controller (rev 06) (prog-if 00 ","[VGA controller]",")"),(0,r.kt)("p",{parentName:"admonition"},"Make note of the first set of numbers (e.g. 00:02.0). We'll need them for the next step.")),(0,r.kt)("p",null,"Run the command below. Replace 01:00 with whatever number was next to your GPU when you ran the previous command:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"lspci -n -s 00:02\n")),(0,r.kt)("admonition",{type:"info"},(0,r.kt)("p",{parentName:"admonition"},"Doing this should output your GPU card's Vendor IDs. It'll look a little something like this:"),(0,r.kt)("p",{parentName:"admonition"},"00:02.0 0300: 8086:0416 (rev 06)"),(0,r.kt)("p",{parentName:"admonition"},"What we want to keep, are these vendor id codes: 8086:0416.")),(0,r.kt)("p",null,"Now we add the GPU's vendor id's to the VFIO (remember to replace the id's with your own!):"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},'echo "options vfio-pci ids=8086:0416 disable_vga=1"> /etc/modprobe.d/vfio.conf\n')),(0,r.kt)("p",null,"Finally, we run this command:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"update-initramfs -u\n")),(0,r.kt)("p",null,"And reboot:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"reboot\n")),(0,r.kt)("p",null,"Now your Proxmox host should be ready to passthrough GPUs!"),(0,r.kt)("h3",{id:"edit-vm-configuration"},"Edit VM configuration"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"micro /etc/pve/qemu-server/100.conf\n")),(0,r.kt)("p",null,(0,r.kt)("img",{src:n(2799).Z,width:"1324",height:"839"})),(0,r.kt)("p",null,(0,r.kt)("img",{src:n(2329).Z,width:"1920",height:"1080"})))}c.isMDXComponent=!0},2799:(e,t,n)=>{n.d(t,{Z:()=>o});const o=n.p+"assets/images/figure1-88c48e4d39961705f181b144d325d56a.png"},2329:(e,t,n)=>{n.d(t,{Z:()=>o});const o=n.p+"assets/images/figure2-2a09849e98cd0b4c3cb3c749ee90cbeb.png"}}]);