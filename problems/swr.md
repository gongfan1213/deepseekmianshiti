### **SWR 是什么？**

`SWR` 是由 [Vercel](https://vercel.com/) 团队开发的一个用于数据获取的 React Hook 库。`SWR` 的全称是 **Stale-While-Revalidate**，它是一种 HTTP 缓存失效策略，允许客户端在使用缓存数据的同时向服务器发送请求以获取最新数据。

`SWR` 的核心目标是提供一种简单、高效、灵活的数据获取方式，特别适合在 React 应用中处理远程数据的获取、缓存和更新。

---

### **SWR 的核心理念**

SWR 的名字来源于 HTTP 缓存策略 **Stale-While-Revalidate**，其核心思想是：

1. **Stale（过期数据）**:
   - 在数据过期之前，先使用缓存中的数据（即使它可能已经过期）。
   - 这样可以立即返回数据，提升用户体验。

2. **Revalidate（重新验证）**:
   - 在返回缓存数据的同时，向服务器发送请求以获取最新数据。
   - 当新数据返回时，自动更新缓存并触发 UI 的重新渲染。

这种策略可以在保证数据实时性的同时，减少网络请求的频率，提高应用的性能。

---

### **SWR 的主要特性**

1. **自动缓存**:
   - 数据会自动缓存到内存中，避免重复请求。
   - 缓存的数据可以跨组件共享。

2. **自动重新验证**:
   - 当组件重新挂载时，SWR 会自动重新验证数据的有效性。
   - 支持多种触发重新验证的方式（如窗口聚焦、网络恢复等）。

3. **实时更新**:
   - 支持实时数据更新（如轮询、订阅等）。

4. **错误处理**:
   - 提供了内置的错误处理机制，支持自定义错误回调。

5. **灵活性**:
   - 支持与任何数据获取库（如 `fetch`、`axios`）集成。
   - 提供了丰富的配置选项和扩展机制。

6. **轻量级**:
   - SWR 的核心库非常小，只有几 KB，但功能强大。

---

### **SWR 的安装**

在 React 项目中使用 SWR，需要先安装它：

```bash
npm install swr
# 或者
yarn add swr
```

---

### **SWR 的基本用法**

#### **1. 基本示例**

以下是一个使用 SWR 获取数据的简单示例：

```tsx
import useSWR from 'swr';

// 定义数据获取函数
const fetcher = (url: string) => fetch(url).then((res) => res.json());

function App() {
  // 使用 SWR 获取数据
  const { data, error, isLoading } = useSWR('/api/user', fetcher);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>User Info</h1>
      <p>Name: {data.name}</p>
      <p>Email: {data.email}</p>
    </div>
  );
}

export default App;
```

- **`useSWR`**:
  - 是 SWR 提供的核心 Hook，用于数据获取。
  - 第一个参数是数据的 key（通常是请求的 URL）。
  - 第二个参数是数据获取函数（`fetcher`）。
- **返回值**:
  - `data`: 获取到的数据。
  - `error`: 错误信息（如果请求失败）。
  - `isLoading`: 是否正在加载数据。

---

#### **2. 自动重新验证**

SWR 会在以下情况下自动重新验证数据：

- **组件重新挂载**:
  - 当组件重新挂载时，SWR 会重新发送请求以获取最新数据。

- **窗口聚焦**:
  - 当用户切换回浏览器窗口时，SWR 会重新验证数据。
  - 例如：用户切换到其他标签页后再切换回来。

- **网络恢复**:
  - 当网络从离线状态恢复时，SWR 会重新验证数据。

这些行为可以通过配置选项进行控制。

---

#### **3. 配置选项**

SWR 提供了丰富的配置选项，可以通过 `useSWR` 的第三个参数传入：

```tsx
const { data, error } = useSWR('/api/user', fetcher, {
  revalidateOnFocus: true, // 窗口聚焦时重新验证
  revalidateOnReconnect: true, // 网络恢复时重新验证
  refreshInterval: 5000, // 每 5 秒轮询一次
});
```

- **常用配置**:
  - `revalidateOnFocus`: 是否在窗口聚焦时重新验证（默认 `true`）。
  - `revalidateOnReconnect`: 是否在网络恢复时重新验证（默认 `true`）。
  - `refreshInterval`: 设置轮询间隔（单位：毫秒）。
  - `dedupingInterval`: 设置去重间隔（单位：毫秒），在此间隔内的重复请求会被去重。

---

#### **4. 数据缓存**

SWR 会自动缓存数据，并在内存中共享。以下是一个示例：

```tsx
function Profile() {
  const { data } = useSWR('/api/user', fetcher);
  return <div>{data?.name}</div>;
}

function Dashboard() {
  const { data } = useSWR('/api/user', fetcher);
  return <div>{data?.email}</div>;
}
```

- **缓存共享**:
  - 即使 `Profile` 和 `Dashboard` 是两个独立的组件，它们都会共享 `/api/user` 的数据。
  - 这样可以避免重复请求，提高性能。

---

#### **5. 错误处理**

SWR 提供了多种方式处理错误：

```tsx
const { data, error } = useSWR('/api/user', fetcher);

if (error) {
  console.error('Error fetching data:', error);
  return <div>Error: {error.message}</div>;
}
```

- **全局错误处理**:
  - 可以通过 `SWRConfig` 设置全局的错误处理逻辑：

```tsx
import { SWRConfig } from 'swr';

function App() {
  return (
    <SWRConfig
      value={{
        onError: (error) => {
          console.error('Global Error:', error);
        },
      }}
    >
      <Profile />
    </SWRConfig>
  );
}
```

---

#### **6. 数据依赖**

SWR 支持基于其他数据的动态请求：

```tsx
const { data: user } = useSWR('/api/user', fetcher);
const { data: projects } = useSWR(user ? `/api/projects?userId=${user.id}` : null, fetcher);
```

- **逻辑**:
  - 如果 `user` 数据尚未加载，则不会发送 `/api/projects` 的请求。
  - 当 `user` 数据加载完成后，`projects` 的请求会自动触发。

---

#### **7. 乐观更新**

SWR 支持乐观更新（Optimistic UI），即在数据更新之前，先更新 UI：

```tsx
const { data, mutate } = useSWR('/api/user', fetcher);

async function updateUser(newData) {
  // 乐观更新
  mutate({ ...data, ...newData }, false);

  // 发送请求更新数据
  await fetch('/api/user', {
    method: 'POST',
    body: JSON.stringify(newData),
  });

  // 重新验证数据
  mutate();
}
```

- **逻辑**:
  - 调用 `mutate` 更新本地数据。
  - 发送请求更新服务器数据。
  - 请求完成后，重新验证数据。

---

### **SWR 的优缺点**

#### **优点**
1. **简单易用**:
   - 提供了直观的 API，适合快速开发。
2. **高性能**:
   - 自动缓存和去重，减少了重复请求。
3. **实时性**:
   - 支持自动重新验证和轮询，确保数据的实时性。
4. **灵活性**:
   - 可以与任何数据获取库（如 `fetch`、`axios`）集成。
5. **社区支持**:
   - 由 Vercel 开发，社区活跃，文档完善。

#### **缺点**
1. **依赖 React**:
   - 只能在 React 项目中使用。
2. **学习成本**:
   - 对于初学者来说，理解缓存、重新验证等概念可能需要一些时间。
3. **复杂场景**:
   - 在处理复杂的依赖关系或数据更新逻辑时，可能需要额外的代码。

---

### **SWR 的适用场景**

1. **前端数据获取**:
   - 适合需要频繁获取远程数据的场景（如用户信息、列表数据等）。

2. **实时数据更新**:
   - 适合需要实时更新的场景（如股票行情、聊天消息等）。

3. **缓存共享**:
   - 适合多个组件需要共享同一份数据的场景。

4. **乐观更新**:
   - 适合需要在用户操作后立即更新 UI 的场景（如表单提交、点赞等）。

---

### **总结**

SWR 是一个功能强大、设计优雅的数据获取库，特别适合在 React 项目中使用。它通过缓存、自动重新验证和实时更新等特性，简化了数据获取的逻辑，同时提升了应用的性能和用户体验。如果你的项目需要频繁与后端交互，或者需要处理复杂的数据获取逻辑，SWR 是一个非常值得尝试的工具。
