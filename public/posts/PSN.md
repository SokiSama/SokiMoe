最近一直想做一个自己的游戏时长统计工具，项目暂定名 **PlayTrace**。

这个项目的目标其实很简单：把自己 **PlayStation 和 Nintendo Switch 的游戏时长放到一个地方长期记录**。PS5 和 Switch 本身都能看游玩记录，但这些数据基本还是围绕主机和账号本身展示。如果我想知道自己最近一个月主要玩了什么、PS5 和 Switch 各玩了多少、某个游戏的时长是什么时候慢慢涨上去的，现有功能就没那么方便了。

所以现在只准备做一件事：**把 PSN 和 Switch 的游戏时长定期同步到自己的数据库里。** 不做奖杯，不做成就，不做攻略，也暂时不考虑 Steam、Xbox，第一版主要就是给自己用。目前本项目不打算绑域名，我接管到Github Page上自己用，项目开源，虽然也知道大概率没人会用（

## 数据从哪里来

PlayStation 这边目前可以参考社区维护的 [psn-api](https://github.com/achievements-app/psn-api)。它是一个 TypeScript / JavaScript 库，可以读取账号已玩游戏和 playtime 等信息，也可以区分 PS4、PS5。认证仍然是 NPSSO → access code → access token / refresh token 这一套。

不过 psn-api 本质上是社区维护的 PSN 接入方案，不是 Sony 面向第三方开发者提供并保证稳定的正式 API，所以正式开发前还是得先拿自己的账号把游戏列表、累计时长、平台、分页和最后游玩时间这些字段跑一遍。

Switch 会稍微麻烦一些。最开始很容易想到 Nintendo Switch Online 的接口，但 NSO 更适合好友状态、Presence 和一些游戏专用服务，并不适合作为完整游戏时长系统的数据源。我目前更倾向使用 **Nintendo Switch Parental Controls，也就是 Switch 家长控制的数据接口**。

社区项目 [nxapi](https://github.com/samuelthomas2774/nxapi) 已经实现了这套接口，并提供了 `nxapi/moon` 模块，可以读取已经绑定到家长控制中的 Switch 主机，以及每日、每月使用摘要等数据。实际开发前可以先通过 CLI 做验证：

```
nxapi pctl auth
nxapi pctl devices
nxapi pctl daily-summaries <device-id>
nxapi pctl monthly-summaries <device-id>
```

确认自己的 Nintendo 账号和 Switch 能正常返回所需数据以后，再把 `nxapi/moon` 直接接入 Node.js Worker。这个方案还有一个好处，就是 Parental Controls 数据本身不要求 Nintendo Switch Online 会员，但需要提前把主机加入 Nintendo Switch Parental Controls。

两边的数据链路最终大概是：

```
PlayStation → PSN → psn-api → PSN Adapter → PlayTrace
Nintendo Switch → Parental Controls / Moon → nxapi → Nintendo Adapter → PlayTrace
```

## 技术栈

整个项目准备继续以 TypeScript 为主：

|部分|技术|
|---|---|
|Web|React + TypeScript + Vite|
|Android|Capacitor|
|后端|Node.js + TypeScript + Fastify|
|数据库|PostgreSQL|
|ORM|Drizzle ORM|
|后台任务|Worker + BullMQ|
|Queue|Redis|
|PSN|psn-api|
|Switch|nxapi / Moon|
|部署|Docker Compose|

Android 不单独写原生 UI，而是直接通过 Capacitor 包装 Web 前端，这样网站和 APK 可以共用绝大多数 React 组件。尽管我

后台则分成 API 和 Worker 两部分：

```
flowchart TD
    A[Web] --> C[Fastify API]
    B[Android APK] --> C
    C --> D[(PostgreSQL)]
    E[Sync Worker] --> F[PSN Adapter]
    E --> G[Nintendo Adapter]
    F --> H[PlayStation Network]
    G --> I[Nintendo Parental Controls]
    E --> D
    J[(Redis)] --> E
```

Fastify 主要负责查询、登录、设置和手动同步请求，真正访问 Sony 和 Nintendo 的任务全部放到 Worker。这样即使某个平台请求超时、认证刷新失败或者被限流，也不会直接影响 Web API。

BullMQ + Redis 主要用来管理同步任务，例如 `sync:psn:<account_id>` 和 `sync:switch:<device_id>`。同一个账号或设备同一时间只允许执行一个同步任务，避免自动同步和手动刷新撞在一起。

## 数据结构

虽然 PSN 和 Switch 获取时长的方式不同，但进入 PlayTrace 后还是希望尽量统一成相同的业务模型。例如：

```
interface GameRecord {
  provider: 'psn' | 'switch'
  externalId: string
  name: string
  platform: 'PS4' | 'PS5' | 'SWITCH'
  imageUrl?: string
  totalPlaytimeMinutes?: number
  lastPlayedAt?: Date
}
```

业务层尽量不直接依赖 psn-api 或 nxapi 的原始返回值，而是分别通过 `PsnAdapter` 和 `NintendoAdapter` 转换成统一结构。这样以后 Sony 或 Nintendo 改字段时，主要修改对应 Adapter，不需要数据库、统计 API 和前端一起调整。

第一版数据库大概包含：

```
users
platform_accounts
games
user_games
playtime_snapshots
switch_daily_usage
sync_jobs
sync_logs
```

`platform_accounts` 保存 PSN 和 Nintendo 的账号信息及授权信息，`games` 保存游戏基础信息，`user_games` 保存某个平台账号下游戏当前的累计时长和最后游玩状态。PSN 历史主要进入 `playtime_snapshots`，Switch 每日数据则单独进入 `switch_daily_usage`。

## PSN 时长怎么记录

PSN 返回的是累计游玩时间。假设第一次同步 Death Stranding 是 126 小时，几天以后变成 130 小时，那么 PlayTrace 可以确认的是这两个同步点之间增加了 240 分钟，而不能直接认为某一天刚好玩了 4 小时。

数据库大概保存：

```
playtime_snapshots

id
user_game_id
total_minutes
recorded_at
source
```

例如：

```
2026-10-01  7560 min
2026-10-05  7800 min
```

之后统计某段时间的 PSN 游戏时长，主要通过累计值差值计算。

这里需要接受一个限制：**PSN 数据本质上是累计值快照，而不是精确的每日游戏日志。** Sony 的数据可能存在延迟更新、离线游玩后补传等情况，所以 PlayTrace 只能确定某个同步区间增加了多少时间，不能保证精确还原到某一天。

第一次绑定也一样。如果某个游戏绑定时已经有 126 小时，那这 126 小时只能作为 baseline，之后的变化才属于 PlayTrace 能够长期记录的历史。

## Switch 时长处理方式

Switch 这边的思路不太一样。使用 Parental Controls / Moon 时，读取到的是家长控制产生的每日、每月使用记录，而不是单纯一个账号累计时长。

因此 Switch 可以直接保留日级别数据：

```
switch_daily_usage

device_id
game_id
date
playtime_minutes
synced_at
```

例如某款游戏 10 月 1 日玩了 45 分钟、10 月 2 日玩了 80 分钟，那么月度、年度和每日趋势都可以直接通过这些记录聚合。

从统计角度来说，这种数据其实比 PSN 的累计快照更适合做“某一天玩了多久”。

不过它同样存在边界：**PlayTrace 只能读取 Nintendo 已经记录下来的家长控制数据。** 如果以前一直没有启用 Parental Controls，就不能指望第一次绑定以后把过去几年的每日游玩历史全部还原出来。

所以底层最终会同时存在两种模式：PSN 使用累计时长快照，Switch 使用每日使用记录。前端可以统一展示，但数据库层不会强行把两种数据模型完全做成一样。

## 为什么不直接读取 Switch 本机数据

Switch 还有另一条路线，就是直接读取主机本地的 Play Activity。例如 [NX Activity Log](https://github.com/tallbl0nde/nx-activity-log) 这类工具可以直接读取本地活动记录，能够拿到更细的总时长、启动次数、首次启动和最近启动时间。

从数据质量来看，这种方式确实很好，但问题是需要 Homebrew 环境。我不打算为了统计游戏时间去给正常使用的 Switch 折腾破解、CFW 或 Homebrew，所以第一版还是优先采用：

```
Nintendo Account + Nintendo Switch Parental Controls + nxapi/moon
```

## PSN 和 Switch 游戏怎么统一

还有一个问题是同一个游戏可能同时在 PS5 和 Switch 上玩。例如 Persona 5 Royal 可能 PS5 玩了 120 小时，Switch 又玩了 35 小时。

底层不会单纯因为名字一样就合并。每个平台版本首先都会保留自己的 `provider`、`external_id` 和 `platform`，例如：

```
psn / PS5 / XXXXX
switch / SWITCH / 0100XXXXXXXXXXXX
```

然后再额外增加一个类似 `game_concepts` 的关联层，把不同平台版本映射到同一款游戏。这样前端既可以显示“Persona 5 Royal 总计 155 小时”，也可以展开看到 PS5 120 小时、Switch 35 小时，同时底层原始数据仍然保持独立。

## 第一版页面

第一版功能不准备做得很复杂。总览主要看 PlayStation、Switch 和合计总时长，以及最近玩的游戏和最近 30 天的时长变化。

游戏库支持“全部 / PlayStation / Switch”筛选，并提供总时长、最近游玩和名称排序。游戏详情页显示平台、累计时长、最近游玩时间和时长历史。如果同一款游戏在多个平台都存在，可以在同一页面拆分显示各平台时长。

统计页面则主要提供今天、本周、本月、今年和全部几个时间范围，再看 PSN / Switch 占比、游戏时长 TOP 20、每月游戏时间和最近一年趋势。第一版做到这些对我来说已经够用了。

## 认证和凭据

PSN 这边仍然使用 NPSSO 完成认证，后端再交换 access token 和 refresh token。NPSSO 只用于首次认证，不长期明文保存，也不写入日志。

Nintendo 则通过 Nintendo Account 登录，再获取 Parental Controls / Moon 所需的 session 或 token。两个平台的认证信息都只放在后端，Web 和 Android 只持有 PlayTrace 自己的登录 Session。数据库中需要长期保存的 token 则通过服务端密钥加密。

## 同步策略

PSN 没必要同步得特别频繁，第一版可能设置为每 30～60 分钟一次，主要检查最近玩过的游戏并更新累计值。

Switch Parental Controls 更适合按日记录，所以每天同步几次就够了，同时每天凌晨补一次前一天的数据，并重新检查最近几天的记录，避免 Nintendo 后续修正某天数据时本地没有更新。

数据库写入全部采用 upsert。例如 Switch 日记录可以设置：

```
UNIQUE (
    device_id,
    game_id,
    usage_date
)
```

这样重复同步某一天的数据时只更新，不会生成重复记录。

## 数据源异常处理

无论 PSN 还是 Switch，都不会把接口缺失的数据当成 0。如果 PSN 某次没有返回 playtime，那么 `NULL` 代表未知，而不是 0 分钟；Switch 某一天同步失败，也不能因此认为那一天没有玩游戏。

所以每个平台都会记录 `last_success_at`、`last_attempt_at`、`status`、`error_code` 和 `error_message`。前端可以直接看到“PlayStation 12 分钟前同步成功”或者“Switch 今天 08:03 同步成功”，而不是接口出问题以后静默失败。

## 项目结构

目前比较倾向使用 Monorepo：

```
apps/
  web/
  api/
  worker/

packages/
  psn-adapter/
  nintendo-adapter/
  database/
  shared-types/
```

`psn-adapter` 只负责 psn-api，`nintendo-adapter` 只负责 nxapi / Moon，其他业务层只认识统一的数据类型。这样以后某个平台接口发生变化，基本可以限制在对应 Adapter 内处理。

## 开发顺序

第一步不会先写 UI，而是先做两个独立测试程序，分别验证 PSN 和 Nintendo 的实际数据。

PSN 主要验证认证、游戏列表、累计时长、分页以及 PS4 / PS5 区分；Switch 主要验证 Nintendo 登录、Parental Controls 设备列表、Daily Summary、Monthly Summary、Title ID、游戏名称和每日分钟数。

这两部分确认可用以后，再开始做 PostgreSQL、Adapter、BullMQ 和 Sync Worker。服务器连续运行一段时间，确认时长可以稳定增长、重复同步不会产生脏数据以后，再开始写 React 页面，最后通过 Capacitor 打包 Android APK。

## 最后

PlayTrace 现在的目标反而比一开始清楚很多。我并不想做一个功能很多的游戏管理平台，也不准备把奖杯、攻略、社区这些东西全部塞进去。

它只解决一个问题：**我到底把多少时间花在了这些游戏上。**

PlayStation 一边，Switch 一边，最后全部汇总到自己的数据库里。几年以后再打开，可能会看到 Persona 3 Reload 在 PS5 玩了 162 小时，Persona 5 Royal 在 PS5 玩了 118 小时、Switch 又玩了 46 小时，Death Stranding 最后停在 126 小时；再往下还能看到这一年 PlayStation 玩了多少、Switch 玩了多少、全年总共又花了多少时间。
