### React Commit 阶段的工作流程

在 ReactDOM.render 一节中，我们介绍了 React 当前的三种入口函数。日常开发主要使用的是 Legacy Mode（通过 ReactDOM.render 创建）。

在上一章最后一节我们介绍了，`commitRoot` 方法是 commit 阶段工作的起点。`fiberRootNode` 会作为传参。

```javascript
commitRoot(root);
```

在 `rootFiber.firstEffect` 上保存了一条需要执行副作用的 Fiber 节点的单向链表 `effectList`，这些 Fiber 节点的 `updateQueue` 中保存了变化的 props。

这些副作用对应的 DOM 操作在 commit 阶段执行。

除此之外，一些生命周期钩子（比如 `componentDidXXX`）、hook（比如 `useEffect`）需要在 commit 阶段执行。

### Commit 阶段的主要工作

commit 阶段的主要工作（即 Renderer 的工作流程）分为三部分：

1. **before mutation 阶段**（执行 DOM 操作前）
2. **mutation 阶段**（执行 DOM 操作）
3. **layout 阶段**（执行 DOM 操作后）

在 before mutation 阶段之前和 layout 阶段之后还有一些额外工作，涉及到比如 `useEffect` 的触发、优先级相关的重置、ref 的绑定/解绑。

这些对我们当前属于超纲内容，为了内容完整性，在这节简单介绍。

### before mutation 之前

`commitRootImpl` 方法中直到第一句 `if (firstEffect !== null)` 之前属于 before mutation 之前。

我们大体看下它做的工作，现在你还不需要理解它们：

```javascript
do {
  // 触发 useEffect 回调与其他同步任务。由于这些任务可能触发新的渲染，所以这里要一直遍历执行直到没有任务
  flushPassiveEffects();
} while (rootWithPendingPassiveEffects !== null);

// root 指 fiberRootNode
// root.finishedWork 指当前应用的 rootFiber
const finishedWork = root.finishedWork;

// 凡是变量名带 lane 的都是优先级相关
const lanes = root.finishedLanes;
if (finishedWork === null) {
  return null;
}
root.finishedWork = null;
root.finishedLanes = NoLanes;

// 重置 Scheduler 绑定的回调函数
root.callbackNode = null;
root.callbackId = NoLanes;

let remainingLanes = mergeLanes(finishedWork.lanes, finishedWork.childLanes);
// 重置优先级相关变量
markRootFinished(root, remainingLanes);

// 清除已完成的 discrete updates，例如：用户鼠标点击触发的更新。
if (rootsWithPendingDiscreteUpdates !== null) {
  if (
    !hasDiscreteLanes(remainingLanes) &&
    rootsWithPendingDiscreteUpdates.has(root)
  ) {
    rootsWithPendingDiscreteUpdates.delete(root);
  }
}

// 重置全局变量
if (root === workInProgressRoot) {
  workInProgressRoot = null;
  workInProgress = null;
  workInProgressRootRenderLanes = NoLanes;
} else {
}

// 将 effectList 赋值给 firstEffect
// 由于每个 fiber 的 effectList 只包含它的子孙节点
// 所以根节点如果有 effectTag 则不会被包含进来
// 所以这里将有 effectTag 的根节点插入到 effectList 尾部
// 这样才能保证有 effect 的 fiber 都在 effectList 中
let firstEffect;
if (finishedWork.effectTag > PerformedWork) {
  if (finishedWork.lastEffect !== null) {
    finishedWork.lastEffect.nextEffect = finishedWork;
    firstEffect = finishedWork.firstEffect;
  } else {
    firstEffect = finishedWork;
  }
} else {
  // 根节点没有 effectTag
  firstEffect = finishedWork.firstEffect;
}
```

可以看到，before mutation 之前主要做一些变量赋值，状态重置的工作。

这一长串代码我们只需要关注最后赋值的 `firstEffect`，在 commit 的三个子阶段都会用到它。

### layout 之后

接下来让我们简单看下 layout 阶段执行完后的代码，现在你还不需要理解它们：

```javascript
const rootDidHavePassiveEffects = rootDoesHavePassiveEffects;

// useEffect 相关
if (rootDoesHavePassiveEffects) {
  rootDoesHavePassiveEffects = false;
  rootWithPendingPassiveEffects = root;
  pendingPassiveEffectsLanes = lanes;
  pendingPassiveEffectsRenderPriority = renderPriorityLevel;
} else {
}

// 性能优化相关
if (remainingLanes !== NoLanes) {
  if (enableSchedulerTracing) {
    // ...
  }
} else {
  // ...
}

// 性能优化相关
if (enableSchedulerTracing) {
  if (!rootDidHavePassiveEffects) {
    // ...
  }
}

// 检测无限循环的同步任务
if (remainingLanes === SyncLane) {
  // ...
}

// 在离开 commitRoot 函数前调用，触发一次新的调度，确保任何附加的任务被调度
ensureRootIsScheduled(root, now());

// 处理未捕获错误及老版本遗留的边界问题

// 执行同步任务，这样同步任务不需要等到下次事件循环再执行
// 比如在 componentDidMount 中执行 setState 创建的更新会在这里被同步执行
// 或 useLayoutEffect
flushSyncCallbackQueue();

return null;
```

主要包括三点内容：

1. **useEffect 相关的处理**：我们会在讲解 layout 阶段时讲解。
2. **性能追踪相关**：源码里有很多和 interaction 相关的变量。它们都和追踪 React 渲染时间、性能相关，在 Profiler API 和 DevTools 中使用。
3. **生命周期钩子和 hook 的处理**：在 commit 阶段会触发一些生命周期钩子（如 `componentDidXXX`）和 hook（如 `useLayoutEffect`、`useEffect`）。在这些回调方法中可能触发新的更新，新的更新会开启新的 render-commit 流程。

### useLayoutEffect Demo

```javascript
function App() {
  const [count, setCount] = useState(0);

  useLayoutEffect(() => {
    console.log('useLayoutEffect');
    setCount(count + 1);
  }, [count]);

  useEffect(() => {
    console.log('useEffect');
  }, [count]);

  return <div>{count}</div>;
}

ReactDOM.render(<App />, document.getElementById('root'));
```

在这个例子中，`useLayoutEffect` 会在 DOM 更新后立即执行，而 `useEffect` 会在 DOM 更新后异步执行。

### 总结

本节我们学习了 commit 阶段的工作流程，包括 before mutation 阶段、mutation 阶段和 layout 阶段。我们还简单介绍了 before mutation 之前和 layout 之后的一些额外工作。通过这些学习，我们对 React 的 commit 阶段有了更深入的理解。
