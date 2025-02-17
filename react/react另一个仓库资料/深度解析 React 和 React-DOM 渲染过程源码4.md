### 递归构建 FiberNode 树

在构建完了根 FiberNode 实例后，`legacyRenderSubtreeIntoContainer` 函数的第 40 行调用了 `updateContainer` 函数，开始构建整棵 FiberNode 树并完成 DOM 渲染。

#### updateContainer 函数解析

我们来解析一下 `updateContainer` 函数做了什么：

```javascript
export function updateContainer(
  element: ReactNodeList,
  container: OpaqueRoot,
  parentComponent: ?React$Component<any, any>,
  callback: ?Function,
): ExpirationTime {
  const current = container.current;
  const currentTime = requestCurrentTimeForUpdate();
  const suspenseConfig = requestCurrentSuspenseConfig();
  const expirationTime = computeExpirationForFiber(
    currentTime,
    current,
    suspenseConfig,
  );

  const context = getContextForSubtree(parentComponent);
  if (container.context === null) {
    container.context = context;
  } else {
    container.pendingContext = context;
  }

  const update = createUpdate(expirationTime, suspenseConfig);
  update.payload = { element };

  callback = callback === undefined ? null : callback;
  if (callback !== null) {
    update.callback = callback;
  }

  enqueueUpdate(current, update);
  scheduleUpdateOnFiber(current, expirationTime);

  return expirationTime;
}
```

#### 解析 `updateContainer` 函数

1. **优先级设置**（第 8~14 行）：
   - React 内部的更新任务设置了优先级，优先级较高的更新任务将会中断优先级较低的更新任务。
   - React 设置了 `ExpirationTime` 任务过期时间，如果时间到期后任务仍未执行（一直被打断），则会强制执行该更新任务。
   - React 内部也会将过期时间相近的更新任务合并成一个（批量）更新任务，从而达到批量更新减少消耗的效果。

2. **收集 context 属性**（第 16~21 行）：
   - 从父组件中收集 `context` 属性（由于这里是 root 组件，所以父组件为空）。

3. **构建更新队列**（第 23~31 行）：
   - 第 24 行将 Element 实例挂载在 `update` 对象上。
   - 第 31 行将更新队列（`updateQueue`）挂载在 FiberNode 实例上。

4. **递归调度**（第 32 行）：
   - 内部开始递归调度，创建 FiberNode 树。
   - 创建一个工作节点快照 `workInProgress`（初始值是根 FiberNode），围绕着 `workInProgress` 对 `updateQueue` 展开构建工作。

#### 递归构建 FiberNode 树

`workLoopSync` 函数负责递归构建 FiberNode 树：

```javascript
function workLoopSync() {
  while (workInProgress !== null) {
    workInProgress = performUnitOfWork(workInProgress);
  }
}
```

`performUnitOfWork` 函数将返回 `workInProgress.child`，直到所有节点遍历完成。

#### 关键步骤图解

1. **legacyRenderSubtreeIntoContainer** 调用 `updateContainer`：
   - `updateContainer` 函数开始构建 FiberNode 树。

2. **updateContainer** 函数内部：
   - 设置优先级和过期时间。
   - 收集 `context` 属性。
   - 构建更新队列。
   - 递归调度，创建 FiberNode 树。

3. **递归构建 FiberNode 树**：
   - `workLoopSync` 函数递归调用 `performUnitOfWork`，构建 FiberNode 树。

#### 总结

通过以上解析，我们了解了 `updateContainer` 函数的工作流程以及递归构建 FiberNode 树的过程。接下来，我们将继续深入探讨 React 和 React-DOM 的渲染过程，揭示其内部实现细节。
