---
title: 构建你的博客 PSN 奖杯数据流
date: '2026-01-17'
tags: ["教程"]
description: 调用官方 API，实现奖杯数据的动态抓取
published: true
cover: /images/trophy.jpg
---

# 1.前提配置 
这是开源的项目

 [psn-api](https://github.com/achievements-app/psn-api)


在你的项目下，安装依赖

`npm install psn-api`

1. 在你的浏览器中，跳转至 https://www.playstation.com/, 点击登陆按钮, 登陆你的 PSN 账号
2. 登陆成功后，在同一个浏览器中，打开  https://ca.account.sony.com/api/v1/ssocookie. ，你可以看到如下的 JSON 代码，这里举个例子

`{ "npsso": "<64 character token>" }`

仅复制 `64 character token`  

这里以我把项目放在了  acg 标签下

UI 位于 /acg 页面的 Game 这个 Tab 里：

- 页面组件： `src/app/acg/page.tsx`
- 最外层 Tab 面板的卡片：

```
<div
  id="acg-panel"
  role="tabpanel"
  className="mt-5 flex items-center
  justify-center min-h-[320px] sm:min-h-
  [380px] card px-4 py-7 sm:px-10
  sm:py-12 transition-smooth"
>
  <div className="w-full min-w-0
  transition-opacity ...">
    <Panel />  // 当 activeTab === 'game'
    时就是 <Game />
  </div>
</div>

```

当选中 Game 标签时， Panel 就是 Game 组件。你看到的那块「PSN 奖杯概览 + 最后同步奖杯的游戏列表」就是 Game() 返回的这棵 DOM 树。

# 2. 「原理」前端构造出框架

Game 组件如何获取并管理 PSN 数据

文件位置同上  `src/app/acg/page.tsx`

## 2.1 状态定义

```
function Game() {
  const [summary, setSummary] =
  useState<PsnTrophySummary | null>(null);
  const [loading, setLoading] = useState
  (true);
  const [error, setError] =
  useState<string | null>(null);

  type PsnRecentTitle = { ... }; // 最近游
  玩的游戏信息
  const [recentTitles, setRecentTitles] =
  useState<PsnRecentTitle[] | null>(null);
  const [recentLoading, setRecentLoading]
  = useState(true);
  const [recentError, setRecentError] =
  useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [isRefreshing, setIsRefreshing] =
  useState(false);

```

- summary ：PSN 奖杯总览（等级、各类奖杯数量、头像等）。
- recentTitles ：最近同步奖杯的游戏列表。
- loading / error ：总览的加载状态与错误信息。
- recentLoading / recentError ：游戏列表的加载状态与错误。
- page ：当前列表分页页码。
- isRefreshing ：是否在静默刷新（用来给按钮加「变淡」效果）。

## 2.2 从前端调用后端 API

### 2.2.1 获取总览

`/api/psn/trophies?mode=summary`

```tsx
const fetchSummary = useCallback(async (opts?: { silent?: boolean }) => {
  const silent = opts?.silent ?? false;
  if (!silent) setLoading(true);
  setIsRefreshing(silent);
  setError(null);

  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 2_800);

  try {
    const res = await fetch('/api/psn/trophies?mode=summary', {
      cache: 'no-store',
      signal: controller.signal,
    });

    const json = (await res.json()) as
      | { success: true; data: PsnTrophySummary }
      | { success: false; error?: string };

    if (!res.ok || !('success' in json) || !json.success) {
      const message = 'error' in json && json.error ? json.error : `请求失败(${res.status})`;
      throw new Error(message);
    }

    setSummary(json.data);

    // 写入 sessionStorage 做前端缓存
    sessionStorage.setItem(
      PSN_TROPHY_SUMMARY_CACHE_KEY,
      JSON.stringify({ savedAt: Date.now(), data: json.data })
    );
  } catch (e) {
    setError(e instanceof Error ? e.message : String(e));
    setSummary(null);
  } finally {
    window.clearTimeout(timeout);
    setLoading(false);
    setIsRefreshing(false);
  }
}, []);
```

要点：

- 使用 AbortController + setTimeout ，2.8s 超时自动 abort() 。
- 接口返回 { success: true, data } 或 { success: false, error } ，前端做统一判断。
- 请求成功后把数据写入 sessionStorage ，方便刷新/切 Tab 时快速展示。

2）获取最近游戏 `/api/psn/trophies?mode=titles&limit=200&offset=0`

```tsx
const fetchRecentTitles = useCallback(async (opts?: { silent?: boolean }) => {
  const silent = opts?.silent ?? false;
  if (!silent) setRecentLoading(true);
  setIsRefreshing(silent);
  setRecentError(null);

  // 一堆工具函数：toNumber / clampPercent / sumTrophies / getProgress
  // 用来从返回的原始字段算出百分比、奖杯数量等

  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 2_800);

  try {
    const res = await fetch('/api/psn/trophies?mode=titles&limit=200&offset=0', {
      cache: 'no-store',
      signal: controller.signal,
    });

    const json = (await res.json()) as
      | { success: true; data: { trophyTitles: Array<Record<string, unknown>> } }
      | { success: false; error?: string };

    if (!res.ok || !('success' in json) || !json.success) {
      const message = 'error' in json && json.error ? json.error : `请求失败(${res.status})`;
      throw new Error(message);
    }

    const list = (json.data.trophyTitles || [])
      .filter((t) => !!t?.npCommunicationId && !!t?.lastUpdatedDateTime)
      .map((t) => ({
        npServiceName: (t.npServiceName as 'trophy' | 'trophy2') ?? 'trophy2',
        npCommunicationId: String(t.npCommunicationId ?? ''),
        trophyTitleName: String(t.trophyTitleName ?? ''),
        trophyTitleIconUrl: String(t.trophyTitleIconUrl ?? ''),
        lastUpdatedDateTime: String(t.lastUpdatedDateTime ?? ''),
        progress: getProgress(t),
        earnedTrophies: getEarnedTrophies(t),
      }))
      .sort((a, b) => new Date(b.lastUpdatedDateTime).getTime() - new Date(a.lastUpdatedDateTime).getTime());

    setRecentTitles(list);
    sessionStorage.setItem(
      PSN_RECENT_TITLES_CACHE_KEY,
      JSON.stringify({ savedAt: Date.now(), data: list })
    );
  } catch (e) {
    setRecentError(e instanceof Error ? e.message : String(e));
    setRecentTitles([]);
  } finally {
    window.clearTimeout(timeout);
    setRecentLoading(false);
    setIsRefreshing(false);
  }
}, []);
```

后端返回的是比较原始的字段，前端这段代码负责：

- 过滤掉没有 npCommunicationId 或时间为空的条目。
- 计算 progress （不给则用已获得奖杯数 / 总奖杯数算百分比）。
- 提取并规整成 PsnRecentTitle 类型，方便 UI 渲染。

### 2.2.2 前端缓存 + 定时刷新

初始化和轮询在同一个 `useEffect` 里完成：

```tsx
useEffect(() => {
  // 1. 先尝试从 sessionStorage 读 summary 缓存，没过期就直接用
  // 2. 同理读 recentTitles 缓存

  void fetchSummary();
  void fetchRecentTitles();

  // 3. 每 60s 自动静默刷新（页面可见时）
  const interval = window.setInterval(() => {
    if (document.visibilityState === 'visible') {
      void fetchSummary({ silent: true });
      void fetchRecentTitles({ silent: true });
    }
  }, 60_000);

  return () => window.clearInterval(interval);
}, [fetchRecentTitles, fetchSummary]);
```

- 这样切到 Game Tab 时基本能秒出数据（有缓存时），后台再刷新一次。
- silent: true 时不切换 loading skeleton，只在顶部文案和按钮状态上有 subtle 变化。

### 2.2.3 分页和统计

```tsx
const counts = summary?.earnedTrophies;
const totalEarned = useMemo(() => {
  if (!counts) return 0;
  return counts.platinum + counts.gold + counts.silver + counts.bronze;
}, [counts]);

const totalPages = useMemo(() => {
  const total = recentTitles?.length ?? 0;
  return Math.max(1, Math.ceil(total / pageSize));
}, [recentTitles?.length]);

const pagedTitles = useMemo(() => {
  const list = recentTitles || [];
  const start = (page - 1) * pageSize;
  return list.slice(start, start + pageSize);
}, [page, recentTitles]);
```

- totalEarned 可以用于展示总奖杯数（如果你想扩展 UI）。
- pagedTitles 用来只渲染当前页的 8 条游戏。

## 2.3 获取 PSN 头像，奖杯完成等级状态

### 2.3.1 顶部头像 + 状态 + 刷新按钮

```tsx
return (
  <div className="w-full max-w-5xl">
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div className="flex items-center gap-3 min-w-0">
        {summary?.profile?.onlineId ? (
          <div className="h-10 w-10 rounded-full overflow-hidden bg-neutral-200 dark:bg-neutral-800 shrink-0">
            {summary.profile.avatarUrl ? (
              <Image ... />
            ) : null}
          </div>
        ) : null}
        <div className="min-w-0">
          {summary?.profile?.onlineId ? (
            <div className="text-sm font-medium ... truncate">
              {summary.profile.onlineId}
            </div>
          ) : null}
          <div className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
            {loading
              ? '加载中…'
              : error
                ? error
                : summary
                  ? `奖杯等级 ${summary.trophyLevel} · 进度 ${summary.progress}%`
                  : '未同步'}
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button type="button" onClick={() => { void fetchSummary(); void fetchRecentTitles(); }} ...>
          刷新
        </button>
      </div>
    </div>
```

### 2.3.2 中间「PSN 奖杯概览」卡片

- 使用 summary.earnedTrophies 显示白金/金/银/铜四个块，每种颜色不同。
- 底下两行显示 Tier 和更新时间：

```tsx
{loading ? skeleton : summary ? (
  <>
    <div className="mt-5 card px-5 py-5">
      <div className="text-sm font-medium ...">PSN 奖杯概览</div>

      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
        {[...四种奖杯...].map((t) => (
          <div key={t.key} className="rounded border px-3 py-2 ...">
            ...
            <div className="text-lg font-semibold tabular-nums ...">
              {t.count}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div className="flex justify-between items-center gap-2">
          <span>Tier</span>
          <span>{summary.tier}</span>
        </div>
        <div className="flex ...">
          <span>更新时间</span>
          <span>{new Date(summary.updatedAt).toLocaleString()}</span>
        </div>
      </div>
    </div>
```

### 2.3.3 下面「最后同步奖杯的游戏」卡片

- 顶部有上一页 / 下一页按钮和当前 page / totalPages 。
- 内容部分根据 recentLoading / recentError / pagedTitles.length 分三种情况：
    - skeleton loading 列表
    - 错误提示
    - 正常列表，每条是一个 button.card ，点击会 new tab 打开 /psn/titles/[npCommunicationId]?npServiceName=... 的详情页面。
    这一整块就是你看到的「整个 div」。

# 3. 「原理」后端获取数据

后端实现文件：

- `src/app/api/psn/trophies/route.ts`
- 使用的辅助函数 / 类型：
    - `src/lib/psn.ts`

## 3.1 使用 psn-api 获取 Access Token

```tsx
import {
  exchangeAccessCodeForAuthTokens,
  exchangeNpssoForAccessCode,
  exchangeRefreshTokenForAuthTokens,
  getProfileFromAccountId,
  getUserTitles,
  getUserTrophyProfileSummary,
  getTitleTrophyGroups,
  getUserTrophyGroupEarningsForTitle,
} from 'psn-api';
```

核心是 `getAuthTokens()` ：

```tsx
async function getAuthTokens() {
  const now = Date.now();
  const cached = getGlobalCache().__psnAuthCache;
  if (cached && cached.accessTokenExpiresAt > now) return cached;

  // access token 过期但 refresh token 还在，用 refresh token 换新 token
  if (cached && cached.refreshTokenExpiresAt > now) {
    const refreshed = await exchangeRefreshTokenForAuthTokens(cached.refreshToken);
    saveAuth(refreshed);
    return getGlobalCache().__psnAuthCache as AuthCache;
  }

  // 两个都没有/过期：用 NPSSO 重新换
  const npsso = process.env.PSN_NPSSO || process.env.PSN_TOKEN;
  if (!npsso) throw new Error('PSN_TOKEN_MISSING');

  const accessCode = await exchangeNpssoForAccessCode(npsso);
  const tokens = await exchangeAccessCodeForAuthTokens(accessCode);
  saveAuth(tokens);
  return getGlobalCache().__psnAuthCache as AuthCache;
}
```

- PSN_NPSSO （或 PSN_TOKEN ）存放在 .env.local ，不会进仓库。
- 通过 psn-api 把 NPSSO 换成 access token / refresh token。
- 使用 globalThis 上的 cache 保存 token 和过期时间，避免每次请求都去登录。

## 3.2 Summary 模式

### 3.2.1 调用 PSN 官方接口拿 summary

```tsx
const raw = await getUserTrophyProfileSummary({ accessToken: auth.accessToken }, 'me');
const mapped = mapUserTrophyProfileSummary(raw);
```

`mapUserTrophyProfileSummary` 在 `lib/psn.ts` ：

```tsx
export function mapUserTrophyProfileSummary(
  input: UserTrophyProfileSummaryResponse,
  now: Date = new Date()
): PsnTrophySummary {
  return {
    accountId: input.accountId,
    trophyLevel: input.trophyLevel,
    progress: input.progress,
    tier: input.tier,
    earnedTrophies: {
      bronze: input.earnedTrophies.bronze,
      silver: input.earnedTrophies.silver,
      gold: input.earnedTrophies.gold,
      platinum: Number(input.earnedTrophies.platinum),
    },
    updatedAt: now.toISOString(),
  };
}
```

### 3.2.2 获取头像和 ID

```tsx
const profile = await getProfileFromAccountId({ accessToken: auth.accessToken }, raw.accountId);
const avatarUrl =
  (profile?.avatars || []).find((a) => a.size === '40x40')?.url ??
  (profile?.avatars || [])[0]?.url ??
  null;

const data: PsnTrophySummary = {
  ...mapped,
  profile: profile?.onlineId
    ? { onlineId: profile.onlineId, avatarUrl }
    : undefined,
};
```

### 3.2.3 结果缓存 60 秒，返回给前端

```tsx
getGlobalCache().__psnSummaryCache = { data, expiresAt: now + 60_000 };
return NextResponse.json({ success: true, data });
```

## 3.3 Titles 模式

- 使用 getUserTitles 从 PSN 取到用户所有有奖杯记录的游戏（trophy titles）。
- 这里的数据格式比较原始，所以前端负责进一步加工（进度百分比、奖杯数等）。
- 后端把 PSN 的原生结构原样塞进 data.trophyTitles 返回。

## 3.4 Title 详情模式

当你点击某一条游戏时，前端跳转到 `/psn/titles/[npCommunicationId]` ，详情页会调用：

- `/api/psn/trophies?mode=title&npCommunicationId=xxx&npServiceName=trophy2`
后端在 route.ts 中：
- 用 `getTitleTrophyGroups` 拿到游戏本身和 trophy group 信息。
- 用 `getUserTrophyGroupEarningsForTitle` 拿到每个 group 的完成度与时间。
- 合并后返回一个包含每个 group 数据的结构，前端用来画详情页卡片。

# 4.「省流」如何自己实现一套类似的 【PSN 卡片 】

## 4.1 准备 PSN NPSSO

见获取token，这里不再赘述

## 4.2  后端：写一个 Next.js Route Handler

- 使用 psn-api 提供的 `exchangeNpssoForAccessCode` 、 `exchangeAccessCodeForAuthTokens` 获取 token。
- 把 token + 过期时间缓存到内存里（ `globalThis` 变量）。
- 暴露 /`api/psn/trophies` ：
- `mode=summary` ：调用 `getUserTrophyProfileSummary` + `getProfileFromAccountId` 返回一个整洁的 PsnTrophySummary 对象。
- `mode=titles` ：调用 `getUserTitles` ，返回 trophyTitles 数组。
- `mode=title` ：调用 `getTitleTrophyGroups` + `getUserTrophyGroupEarningsForTitle` 合并出详情。

## 4.3 前端：写 Game 组件

- 维护 `summary / recentTitles / loading / error / page` 这些状态。
- 在 useEffect 中：
- 先尝试从 `sessionStorage` 直接读缓存，没过期就用。
- 再发起真实请求。
- 用 `setInterval` 每 60 秒静默刷新（注意只在 visible 时刷）。
- 把数据拆成几个视觉块：
- 顶部「头像 + 等级 + 刷新按钮」。
- 中间「PSN 奖杯概览」卡片（4 种奖杯 + Tier + 更新时间）。
- 底部「最后同步奖杯的游戏」卡片（分页 + 列表 + 点击查看详情）。

## 4.4 UI：使用 Tailwind 组合样式

- 外层容器： `w-full max-w-5xl` 保证在卡片居中。
- 各子卡片统一用 `card px-5 py-5` 。
- 列表项用 `card w-full px-3 py-3` ，配合 `hover:bg-neutral-50 dark:hover:bg-neutral-800` 做 `hover` 效果。
- 文本对齐、颜色、响应式栅格全部用 Tailwind 工具类完成。

# 5. 最后的配置

因为是本地跑的，但是如果涉及到部署到正式环境。你的 Token 无法获取到，这里需要在你的服务器上进行设置，这里以 Vercrl 为例

## 5.1 在 Vercel 中进行配置

1. 打开你的 [Vercel Dashboard](https://vercel.com/dashboard)。
2. 点击进入你那个 `soki.moe` 或者 `matsusatou.top` 的项目。
3. 点击顶部的 **Settings (设置)** 菜单。
4. 在左侧栏选择 **Environment Variables (环境变量)**。
5. 添加一个新的变量：
    - **Key:** `PSN_NPSSO`
    - **Value:** 粘贴你刚才复制的那串 64 位字符。
6. 点击 **Save** 保存。

---

## 5.2 **重新部署 (Redeploy)**

 Vercel 的环境变量在添加后，需要**重新构建**一次项目才会生效：

1. 点击项目顶部的 **Deployments** 选项卡。
2. 找到最近的一次部署，点击右边的三个点 `...`。
3. 选择 **Redeploy**。

# 番外

- **Token 会失效：** NPSSO Token 不是永久的（通常有效期在 2 个月左右）。如果发现PSN 数据不更新了，就需要按照第一步重新抓取一次。
- **安全：** 千万不要把这串代码直接写在代码文件里传到 GitHub 上，一定要用 Vercel 的环境变量，这样别人就看不到了。
