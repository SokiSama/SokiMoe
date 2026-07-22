---
title: 2026 小米解锁 & root 后优化指北
date: '2026-03-12'
tags: ["小米", "解锁", "root", "优化", "教程"]
description: 已不知有多久未解锁小米的 bootloader 了
published: true
cover: /images/unlock.jpg
---
一些众所周知的原因，我把手上的某旗舰小米手机解锁了。鉴于上次自己解bootloader还得追溯到一加13时候的事情，所以这次折腾也没有走太多弯路。这里仅提供思路和见解。

# 解锁

从网上下载解锁工具，手机打开开发者模式，开启USB调试，打开OEM解锁，找一根 AtoC 的数据线连接电脑，运行脚本，等待解锁 bootloader （会强制清空数据，需做好备份）。因为我是备用机，所以直接存到小米云了。

![alt text](https://p.ipic.vip/65re7z.png)

# Root与优化

我用的 KSU，现在还有个 Sukisu，也是基于 KSU 改的，但是图标过于雌小鬼所以..嗯

因为我很懒，所以也是找的一键刷入的脚本，压缩包里有apk，复制到手机里安装即可。

![23E20CFB-2B52-4D4F-A72D-A11A452A888C_1_102_o.jpeg](https://p.ipic.vip/bv1o3s.png)

因为 Android 16 的特性，现在 LSP 比较吃版本，去下载 Zygisk Next 以正常挂载 LSP，LSP 版本这里推荐选 IT，不推荐 JM 是因为 JM 兼容性很差，很难成功加载模块。如果装完没找到图标，直接解压 LSP 压缩包，然后安装 manger.apk.

拒绝养蛊，少就是好，现在 KSU 自带救砖了，所以理论上只装下面两个就够了。第一个是调度，我不打手游感知不强，在使用 App 时候的功耗负载倒是低了一些。

![image.png](https://p.ipic.vip/maqpbj.png)

模块我就装了这几个，基本上都是优化和美化用的，HyperOS 3 都能用

![image.png](https://p.ipic.vip/a6nyda.png)

至于隐藏 root 什么的我倒不是很在意，因为我银行类软件都是放在 iOS 里的，而且 KSU 现在能基本上绕过绝大多数的需要检测 root 的，美团这几天的使用体验下来也没有黑号。（无法正常团购）

最后分享几个我比较喜欢的优化，我本质上还是遵循原生的 UI ，所以花里胡哨的修改我也没动

去云控，这个懂得都懂

![image.png](https://p.ipic.vip/so2es7.png)

解锁全面屏优化，让第三方输入法也能用全面屏优化（我这里用的 Gboard）

![image.png](https://p.ipic.vip/cudso9.png)

![image.png](https://p.ipic.vip/nr8h2f.png)

shizuku ，老朋友了，给 GKD 授权的，无障碍经常被杀

![image.png](https://p.ipic.vip/8bk8za.png)

![image.png](https://p.ipic.vip/fcdj6t.png)

应用包管理组件，这里建议能关就关，毕竟输密码以及安全检测什么的很违背一位 Android 用户的体验

![image.png](https://p.ipic.vip/sf8awp.png)

# 结语

我从小米3就开始解锁刷机了，一直用到小米12X开始不能自由解锁，加上那时候已经毕业开始上班了就投奔 iOS 了，后面也买过一加 root 后因为 tee 炸了不爽，小米解锁 root 就不会炸。加上还是比较习惯小米的系统，以及系统级别的米家联动。所以这次解锁root后，我相信这部手机可以作为钉子户使用了。
