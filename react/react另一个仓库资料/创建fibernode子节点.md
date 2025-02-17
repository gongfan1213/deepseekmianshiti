### 创建 FiberNode 子节点

在构建 FiberNode 树的过程中，`performUnitOfWork` 函数是一个关键步骤。我们首先进入 `beginWork` 函数，来看看它是如何工作的。

#### beginWork 函数

```javascript
function beginWork(
  current: Fiber | null,
  workInProgress: Fiber,
  renderExpirationTime: ExpirationTime,
): Fiber | null {
  const updateExpirationTime = workInProgress.expirationTime;

  if (current !== null) {
    const oldProps = current.memoizedProps;
    const newProps = workInProgress.pendingProps;

    if (
      oldProps !== newProps ||
      hasLegacyContextChanged()
    ) {
      didReceiveUpdate = true;
    } else if (updateExpirationTime < renderExpirationTime) {
      didReceiveUpdate = false;
    } else {
      didReceiveUpdate = false;
    }
  } else {
    didReceiveUpdate = false;
  }

  switch (workInProgress.tag) {
    case IndeterminateComponent:
      // ...
    case LazyComponent:
      // ...
    case FunctionComponent:
      // ...
    case ClassComponent:
      // ...
    case HostRoot:
      return updateHostRoot(current, workInProgress, renderExpirationTime);
    case HostComponent:
      return updateHostComponent(current, workInProgress, renderExpirationTime);
    case HostText:
      return updateHostText(current, workInProgress);
    // ...
  }
}
```

`beginWork` 函数会根据 `props` 和 `context` 是否改变（第 12~15 行）、当前节点优先级是否高于正在更新的节点优先级（第 17 行）来决定当前节点是否需要更新。然后根据节点的标签类型（`tag`），调用不同的函数进行内部状态更新。

#### updateHostRoot 函数

我们第一次进入的是 root 节点，所以进入到 `updateHostRoot` 函数内部逻辑进行处理。

```javascript
function updateHostRoot(
  current: Fiber | null,
  workInProgress: Fiber,
  renderExpirationTime: ExpirationTime,
): Fiber | null {
  pushHostRootContext(workInProgress);
  const updateQueue = workInProgress.updateQueue;

  const nextProps = workInProgress.pendingProps;
  const prevState = workInProgress.memoizedState;
  const prevChildren = prevState !== null ? prevState.element : null;
  cloneUpdateQueue(current, workInProgress);
  processUpdateQueue(workInProgress, nextProps, null, renderExpirationTime);
  const nextState = workInProgress.memoizedState;
  const nextChildren = nextState.element;

  if (nextChildren === prevChildren) {
    resetHydrationState();
    return bailoutOnAlreadyFinishedWork(current, workInProgress, renderExpirationTime);
  }

  const root: FiberRoot = workInProgress.stateNode;
  if (root.hydrate && enterHydrationState(workInProgress)) {
    let child = mountChildFibers(
      workInProgress,
      null,
      nextChildren,
      renderExpirationTime,
    );
    workInProgress.child = child;
    let node = child;
    while (node) {
      node.effectTag = (node.effectTag & ~Placement) | Hydrating;
      node = node.sibling;
    }
  } else {
    reconcileChildren(current, workInProgress, nextChildren, renderExpirationTime);
  }
  resetHydrationState();
  return workInProgress.child;
}
```

#### 解析 `updateHostRoot` 函数

1. **推入内部栈**（第 2 行）：
   - 将一系列有用的信息推入内部栈（其中包括 #app 实例、context 信息等等）。

2. **收集节点属性**（第 5~7 行）：
   - 收集节点新的 `props` 属性和旧的 `state`、`children` 属性。

3. **浅复制更新队列**（第 8 行）：
   - 浅复制更新队列，防止引用属性互相影响。

4. **执行更新队列**（第 9 行）：
   - 执行更新队列，主要任务是将 `React.Element` 添加到 Fiber 的 `memoizedState` 和 `updateQueue` 更新队列中。

5. **处理 `memoizedState`**（第 36~45 行）：
   - 对 `memoizedState` 中的 `element` 进行进一步处理，将其封装成 FiberNode 然后挂载在 `workInProgress.child` 属性上，最后将该 `child` 返回。

到这一步，FiberNode 树的第一个节点就已经构建完成并挂载。

#### 流程图

我们来画一张流程图进行梳理：

```plaintext
updateContainer（内部调度函数）
    ↓
设置内部更新任务优先级
    ↓
收集 context 值
    ↓
设置更新队列
    ↓
workLoopSync（递归构建 FiberNode 树）
    ↓
beginWork（根据不同的节点类型调用不同的函数构建 FiberNode 子节点）
    ↓
updateHostRoot（处理根节点）
    ↓
推入内部栈
    ↓
收集节点属性
    ↓
浅复制更新队列
    ↓
执行更新队列
    ↓
处理 memoizedState
    ↓
返回子节点
```

通过以上解析，我们了解了 `beginWork` 和 `updateHostRoot` 函数的工作流程，以及如何递归构建 FiberNode 子节点。接下来，我们将继续深入探讨 React 和 React-DOM 的渲染过程，揭示其内部实现细节。
