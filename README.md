# 灵魂图鉴 MVP

Next.js + TypeScript + Tailwind CSS 的移动端 H5 项目。

## 本地运行

```bash
npm install
npm run dev -- --hostname 127.0.0.1 --port 3001
```

访问：

- `http://127.0.0.1:3001/`
- `http://127.0.0.1:3001/intro`
- `http://127.0.0.1:3001/quiz`
- `http://127.0.0.1:3001/generating`
- `http://127.0.0.1:3001/result?result_id=结果ID`

## 环境变量

创建 `.env.local`：

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

注意：

- `SUPABASE_SERVICE_ROLE_KEY` 只能用于 Next.js 服务端 Route Handler 和脚本。
- 不要把 service role key 放到 `NEXT_PUBLIC_` 变量里。
- 前端页面只通过 `/api/redeem`、`/api/submit`、`/api/result`、`/api/events` 访问服务端。

## Supabase 建表 SQL

在 Supabase Dashboard 的 SQL Editor 中执行：

```sql
create extension if not exists "pgcrypto";

create table if not exists public.redeem_codes (
  code text primary key,
  type text not null default 'sale' check (type in ('internal_test', 'sale')),
  status text not null default 'unused' check (status in ('unused', 'used')),
  used_at timestamptz,
  result_id uuid unique,
  created_at timestamptz not null default now()
);

alter table public.redeem_codes
  add column if not exists type text not null default 'sale';

create table if not exists public.test_results (
  id uuid primary key default gen_random_uuid(),
  code text not null unique references public.redeem_codes(code),
  answers jsonb not null,
  result_payload jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  event_name text not null,
  code text,
  payload jsonb,
  created_at timestamptz default now()
);

create index if not exists test_results_code_idx
  on public.test_results(code);

create index if not exists events_event_name_created_at_idx
  on public.events(event_name, created_at desc);

create index if not exists events_code_created_at_idx
  on public.events(code, created_at desc);

alter table public.redeem_codes enable row level security;
alter table public.test_results enable row level security;
alter table public.events enable row level security;
```

项目内同样保留了完整 SQL 文件：`supabase/schema.sql`。

## 生成兑换码

默认生成 120 个兑换码：

- 20 个 `type=internal_test`
- 100 个 `type=sale`
- 格式：`LH-XXXX-XXXX`

兑换码使用 8 位随机段，避免出现年份、批次或顺序感过强的规律。

运行：

```bash
npm run generate:codes
```

脚本位置：`scripts/generate-codes.ts`。

脚本会写入 `redeem_codes` 表，并通过 `code` 冲突忽略机制防重复。

## 埋点事件

事件写入 `events` 表：

- `code_verified`
- `quiz_started`
- `question_answered`
- `quiz_completed`
- `result_generating`
- `result_viewed`
- `share_card_saved`
- `code_invalid`
- `code_used`

客户端只调用 `/api/events`，最终写库由服务端使用 `SUPABASE_SERVICE_ROLE_KEY` 完成。

## Vercel 部署

1. 将项目推送到 Git 仓库。
2. 在 Vercel 导入项目。
3. Framework Preset 选择 `Next.js`。
4. Build Command 使用默认 `npm run build`。
5. 在 Vercel Project Settings -> Environment Variables 添加：
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
6. 重新部署。

## 视觉约束

全局主题集中在 `app/globals.css`、`tailwind.config.ts` 与 `components/ui/`。四个章节只允许轻微氛围变化，不创建完全不同的页面风格。
