---
title: 怎么从零搭建一个网站并绑定域名
date: '2026-01-14'
tags: ["教程"]
description: 面向不知道谁的一个搭站教程。
published: true
cover: /images/123.png
---

> 本文章为砂糖小站备份过来，部分页面与现今版本不同，须知

> 1. 本教程假设你有一个 GitHub 账户。
> 2. 本教程会引导你拥有一个域名。

有群友（淘宝）想问我，我手上这两个网站是怎么运行起来的，正好借助着之前的教程，我把它完善一下，从零开始搭建一个网站。

## 第一步：事前准备

在搭建网站之前，确保自己做好了必要的准备，避免不必要的麻烦

- **基础外语阅读+代码能力**：你用 Gitee + 阿里云 这种就不需要了，本文将以 GitHub Page + Porkbun 为例；代码能力至少知道我说的ide那些是什么。
- **GitHub 账户**：存放代码和实现自动化部署的基仓。
- **支付方式（任选其一）**：
    - **国内支付**：支付宝/微信（部分国内云服务或域名商支持）。
    - **国外支付**：支持外币的信用卡（Visa/Mastercard）或 PayPal（用于购买国际域名）。

## 第二步：大致流程

### 1. 域名：你的数字门牌号

如果只是拿来玩玩，GitHub的域名就够用了。但凡你想涉及一些友链的互换，估计对方看到 .github.io、.vercel.app、netlify.app 也会敬而远之。购买一个域名，至少第一印象感觉，你是想正儿八经维护的。

### 2. 托管：服务器选在哪里？

静态托管（免费/低门槛）：Vercel / GitHub Pages / Netlify。

这里说 Vercel，后面两个我也用过，Netlify 主要是之前高强度改 bug ，本地没有运行，就直接 push 了，导致免费的额度没了，遂转 Vercel ，免费额度足够你用了。

友情提醒，传代码之前，先本地部署下没问题了再提交（妈的怎么跟我单位一样，项目上线全是bug）

### 3. 工具：选一个趁手的工具

- **Cursor** ：模型比较多，唯一缺点就是贵
- **Trae （国际版）**：新用户 💲3 的 Pro 会员，模型被砍了一刀，新出的 solo 模式挺适合去看看大纲的，日用 GPT 5.2  和 Gemini 3.0 写写前端也够了其实

### 4. 选择你的英雄

- 框架（Hexo / Astro）：砂糖小站是 Astro，星铁小站是 Hexo，都是纯前端无后端
- 主题：[Mizuki](https://github.com/matsuzaka-yuki/mizuki) （基于 Fuwai 改的）偏二次元一些（？）& [icarus](https://github.com/imaegoo/hexo-theme-icarus) 这个简洁一些

## 第三步：开始搭建

### 1.博客构建选择

先从主流的框架选一个吧，教程比较完善的包括不限于 Hexo / Astro，去 GitHub 就能找到它们的最初版，你的博客就是从它们开始。

hexo主题框架构建，可以看我这篇文章 [构建一个hexo](https://www.matsusatou.top/posts/hexo/macoshexo/)

### 2.Astro+Mizuki 构造年轻人的第一个”二次元“博客

Astro了话，在你的 code ide 里输入

```html
 npm create astro@latest
```

或者想获得 mizuki 同款，在终端把 mizuki clone到本地

```html
git clone https://github.com/matsuzaka-yuki/mizuki.git
cd Mizuki
```

在你的 cursor & trae & vscode 编辑器里，启动服务器

```html
pnpm dev
```

启动成功后，您可以在浏览器中访问 `http://localhost:4321` 查看您的博客。

不出意外你的博客就是这样，我找的demo，你不改配置文件基本上也就是这样，可能随着人家版本更新有所变动，但大体都差不多

![mizuki.png](https://p.ipic.vip/4c16h5.png)

> 可见主题作者还是很喜欢碧蓝档案呢（笑）
> 

具体怎么改功能，改页面，加功能就参考人家完整的 [官方文档](https://docs.mizuki.mysqil.com/guide/intro/) 吧，毕竟人家写的比我肯定写得好。

基本上有点代码基础，甚至你只需要看懂这个项目的大体框架，就可以对已有的功能小修小补了。

如果想加文档里没有新功能，可以丢给 AI 帮你写。

### 3.使用 Hexo+ icarus 构建轻量化博客

先在code ide里，把hexo项目拉到本地

`npm install -g hexo-cli`

在code ide里 ，终端输入，把 icarus 主题给下载下来


`git submodule add https://github.com/ppoffice/hexo-theme-icarus.git themes/icarus`

cd 到 clone 的项目下面，打开 `_config.yml`，修改主题

`theme: icarus`

启动项目
`hexo server`

不出意外你的项目预览出来就是这样，这个页面好多年没改了（笑死）

![image.png](https://p.ipic.vip/qsz3ml.png)

想获得星铁小站同款主题了话，直接把人家魔改好的主题 clone 下来启动就行

```html
npm i -g hexo
mkdir blog
cd blog
hexo init --no-clone
git clone https://github.com/imaegoo/hexo-theme-icarus.git themes/icarus
hexo config theme icarus
```

然后就是根据需要改页面，改链接，加功能了

完整的 [官方文档](https://ppoffice.github.io/hexo-theme-icarus/) ，想加小功能利用 ai 生成代码，或者水平高的自己加

## 第四步：部署网站

### 1.在 GitHub 上创建仓库

登录 GitHub，点击右上角的 **[+]** -> **New repository**。

1. 命名：
    - 希望域名是 `用户名.github.io`，仓库名就填：**`你的用户名.github.io`**。
    - 如果你只是想起个别的名字（比如 `my-blog`），域名就会是 `用户名.github.io/my-blog/`。
2. 仓库的可见性：选 **Public**。
3. README看你自己要不要写，然后点击 **Create repository**。

### 2.将本地项目推送到 GitHub

在你的项目下启动终端，按顺序输入以下命令：

1. 初始化 Git

`git init`

2. 将所有文件加入暂存区

`git add .`

3. 加个提交的备注

`git commit -m "部署到GitHub Page”`

4. 关联远程仓库

`git remote add origin [https://github.com/你的用户名/你的仓库名.git]`

5. 推代码

`git branch -M main
git push -u origin main`

### 3.修改 GitHub 仓库设置

1. 在 GitHub 仓库页面，点击顶部的 **Settings**。
2. 在左侧栏找到 **Pages**。
3. 在 **Build and deployment > Source** 下拉菜单中，选择 **`GitHub Actions`**。

> 选完之后不需要点保存，它会自动生效。
> 

![image.png](https://p.ipic.vip/0a5h24.png)

如图所示，这样你的网站就可以通过 GitHub 给你的域名访问了

我是绑定了二级域名，在 **Custom domain ，**之后买了域名你也可以这么弄

## 第五步：在 Vercel 托管你的域名

    

> 相比 GitHub Pages，Vercel 的全球加速更强，部署预览更直观，而且对于 Astro 这类框架有原生优化，是“懒人博主”的终极选择
> 

### **1.登录与关联**

打开 [Vercel 官网](https://vercel.com/)，点击 **Continue with GitHub** 直接用你的 GitHub 账号登录并授权

### **2.导入仓库**

- 进入 Dashboard 后，点击 **Add New- Project。**
- 在仓库列表（**Import Git Repository**）里找到你的博客仓库，点击 **Import**。

### 3.配置项目

**项目配置**：

- Vercel 会自动识别出这是一个 **Astro** 项目
- **Framework Preset** 选择 `Astro`。
- **Root Directory** 保持默认即可。
- 点击 **Deploy**。

### 4.完成配置

     几秒钟后，你会看到满屏的彩色纸屑，代表你的网站已经拥有了一个 Vercel 提供的临时域名，你要是乐意也可以拿来当正式域名用。

（默认是 `xxx.vercel.app`）

如图，这是砂糖小站的 Dashboard，你在 GitHub 做的同步，这里也会跟着一起同步

![image.png](https://p.ipic.vip/b0px2w.png)

## 第六步：Porkbun 域名购买与 Vercel 绑定

### 1.域名的选择与购买

- **搜索域名**：打开 [porkbun.com](https://porkbun.com/)。登录&注册账户（这里省略）选择 PRODUCTS-Domains，输入你想要的网址的前缀，点击搜索

![image.png](https://p.ipic.vip/qi18wn.png)

- **选择域名**：看到心仪的后缀（建议 `.com`, `.net` 或 `.io`，或者便宜的 `.me`），点击旁边的 **[+]** 图标。然后点击checkout，选择的域名丰俭由人。
- **确认价格**：选择需要购买域名的年份，没什么问题就点击 continue billing，选择支付方式，支持信用卡，PayPal，支付宝等，购买域名
- 回到 **Domain Management，**即可看到你购买的域名

### 2.在 Vercel 绑定 Porkbun 域名

- Vercel 端配置

在项目的 Dashboard，点击 Settings，点击 Domains，点击 Add Domains

输入你购买的域名，点击 Save

Vercel 会提示你域名解析缺失（Invalid Configuration），并给你一组 **DNS 记录值**

- Porkbun 端配置

来到 **Domain Management** 页面，在你的域名的 **NAME 下，**点击 **DNS** 按钮

Type 选择 A，Host 一般都是 www ，Value 就写 DNS地址，其他不变，点击 Add

![image.png](https://p.ipic.vip/yyx0n5.png)

     解析成功你会在下面“Current Records”，看到你解析成功的记录，你也可以对已经解析成功的记录，进行删除或修改

![image.png](https://p.ipic.vip/017b7h.png)

### 3.验证是否生效

**等待解析**：回到 Vercel 的 Domains 页面，点击 Refresh。

**自动 SSL**：一旦解析成功，Vercel 会自动帮你申请新的 SSL 证书（那个安全的小锁头）。

之后，你就可以通过你的域名访问网站了