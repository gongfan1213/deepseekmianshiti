### React Render 阶段：beginWork 方法

在上一节我们了解到 render 阶段的工作可以分为“递”阶段和“归”阶段。其中“递”阶段会执行 `beginWork`，而“归”阶段会执行 `completeWork`。这一节我们看看“递”阶段的 `beginWork` 方法究竟做了什么。

### 方法概览

可以从源码 [这里](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberBeginWork.new.js) 看到 `beginWork` 的定义。整个方法大概有 500 行代码。

从上一节我们已经知道，`beginWork` 的工作是传入当前 Fiber 节点，创建子 Fiber 节点，我们从传参来看看具体是如何做的。

### 从传参看方法执行

```javascript
function beginWork(
  current: Fiber | null,
  workInProgress: Fiber,
  renderLanes: Lanes
): Fiber | null {
  // ...省略函数体
}
```

其中传参：

- **current**：当前组件对应的 Fiber 节点在上一次更新时的 Fiber 节点，即 `workInProgress.alternate`
- **workInProgress**：当前组件对应的 Fiber 节点
- **renderLanes**：优先级相关，在讲解 Scheduler 时再讲解

从双缓存机制一节我们知道，除 `rootFiber` 以外，组件 mount 时，由于是首次渲染，是不存在当前组件对应的 Fiber 节点在上一次更新时的 Fiber 节点，即 mount 时 `current === null`。

组件 update 时，由于之前已经 mount 过，所以 `current !== null`。

所以我们可以通过 `current === null` 来区分组件是处于 mount 还是 update。

基于此原因，`beginWork` 的工作可以分为两部分：

1. **update 时**：如果 `current` 存在，在满足一定条件时可以复用 `current` 节点，这样就能克隆 `current.child` 作为 `workInProgress.child`，而不需要新建 `workInProgress.child`。
2. **mount 时**：除 `fiberRootNode` 以外，`current === null`。会根据 `fiber.tag` 不同，创建不同类型的子 Fiber 节点。

```javascript
function beginWork(
  current: Fiber | null,
  workInProgress: Fiber,
  renderLanes: Lanes
): Fiber | null {
  // update 时：如果 current 存在可能存在优化路径，可以复用 current（即上一次更新的 Fiber 节点）
  if (current !== null) {
    // ...省略

    // 复用 current
    return bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes);
  } else {
    didReceiveUpdate = false;
  }

  // mount 时：根据 tag 不同，创建不同的子 Fiber 节点
  switch (workInProgress.tag) {
    case IndeterminateComponent:
    // ...省略
    case LazyComponent:
    // ...省略
    case FunctionComponent:
    // ...省略
    case ClassComponent:
    // ...省略
    case HostRoot:
    // ...省略
    case HostComponent:
    // ...省略
    case HostText:
    // ...省略
    // ...省略其他类型
  }
}
```

### update 时

我们可以看到，满足如下情况时 `didReceiveUpdate === false`（即可以直接复用前一次更新的子 Fiber，不需要新建子 Fiber）：

- `oldProps === newProps && workInProgress.type === current.type`，即 props 与 fiber.type 不变
- `!includesSomeLane(renderLanes, updateLanes)`，即当前 Fiber 节点优先级不够，会在讲解 Scheduler 时介绍

```javascript
if (current !== null) {
  const oldProps = current.memoizedProps;
  const newProps = workInProgress.pendingProps;

  if (
    oldProps !== newProps ||
    hasLegacyContextChanged() ||
    (__DEV__ ? workInProgress.type !== current.type : false)
  ) {
    didReceiveUpdate = true;
  } else if (!includesSomeLane(renderLanes, updateLanes)) {
    didReceiveUpdate = false;
    switch (workInProgress.tag) {
      // 省略处理
    }
    return bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes);
  } else {
    didReceiveUpdate = false;
  }
} else {
  didReceiveUpdate = false;
}
```

### mount 时

当不满足优化路径时，我们就进入第二部分，新建子 Fiber。

我们可以看到，根据 `fiber.tag` 不同，进入不同类型 Fiber 的创建逻辑。

```javascript
// mount 时：根据 tag 不同，创建不同的 Fiber 节点
switch (workInProgress.tag) {
  case IndeterminateComponent:
  // ...省略
  case LazyComponent:
  // ...省略
  case FunctionComponent:
  // ...省略
  case ClassComponent:
  // ...省略
  case HostRoot:
  // ...省略
  case HostComponent:
  // ...省略
  case HostText:
  // ...省略
  // ...省略其他类型
}
```

对于我们常见的组件类型，如（FunctionComponent/ClassComponent/HostComponent），最终会进入 `reconcileChildren` 方法。

### reconcileChildren

从该函数名就能看出这是 Reconciler 模块的核心部分。那么它究竟做了什么呢？

- 对于 mount 的组件，它会创建新的子 Fiber 节点
- 对于 update 的组件，它会将当前组件与该组件在上次更新时对应的 Fiber 节点比较（也就是俗称的 Diff 算法），将比较的结果生成新 Fiber 节点

```javascript
export function reconcileChildren(
  current: Fiber | null,
  workInProgress: Fiber,
  nextChildren: any,
  renderLanes: Lanes
) {
  if (current === null) {
    // 对于 mount 的组件
    workInProgress.child = mountChildFibers(
      workInProgress,
      null,
      nextChildren,
      renderLanes
    );
  } else {
    // 对于 update 的组件
    workInProgress.child = reconcileChildFibers(
      workInProgress,
      current.child,
      nextChildren,
      renderLanes
    );
  }
}
```

从代码可以看出，和 `beginWork` 一样，它也是通过 `current === null` 区分 mount 与 update。

不论走哪个逻辑，最终它会生成新的子 Fiber 节点并赋值给 `workInProgress.child`，作为本次 `beginWork` 返回值，并作为下次 `performUnitOfWork` 执行时 `workInProgress` 的传参。

### 注意

值得一提的是，`mountChildFibers` 与 `reconcileChildFibers` 这两个方法的逻辑基本一致。唯一的区别是：`reconcileChildFibers` 会为生成的 Fiber 节点带上 `effectTag` 属性，而 `mountChildFibers` 不会。

### effectTag

我们知道，render 阶段的工作是在内存中进行，当工作结束后会通知 Renderer 需要执行的 DOM 操作。要执行 DOM 操作的具体类型就保存在 `fiber.effectTag` 中。

比如：

```javascript
// DOM 需要插入到页面中
export const Placement = /*                */ 0b00000000000010;
// DOM 需要更新
export const Update = /*                   */ 0b00000000000100;
// DOM 需要插入到页面中并更新
export const PlacementAndUpdate = /*       */ 0b00000000000110;
// DOM 需要删除
export const Deletion = /*                 */ 0b00000000001000;
```

通过二进制表示 `effectTag`，可以方便地使用位操作为 `fiber.effectTag` 赋值多个 effect。

那么，如果要通知 Renderer 将 Fiber 节点对应的 DOM 节点插入页面中，需要满足两个条件：

1. `fiber.stateNode` 存在，即 Fiber 节点中保存了对应的 DOM 节点
2. `(fiber.effectTag & Placement) !== 0`，即 Fiber 节点存在 Placement effectTag

我们知道，mount 时，`fiber.stateNode === null`，且在 `reconcileChildren` 中调用的 `mountChildFibers` 不会为 Fiber 节点赋值 `effectTag`。那么首屏渲染如何完成呢？

针对第一个问题，`fiber.stateNode` 会在 `completeWork` 中创建，我们会在下一节介绍。

第二个问题的答案十分巧妙：假设 `mountChildFibers` 也会赋值 `effectTag`，那么可以预见 mount 时整棵 Fiber 树所有节点都会有 Placement effectTag。那么 commit 阶段在执行 DOM 操作时每个节点都会执行一次插入操作，这样大量的 DOM 操作是极低效的。

为了解决这个问题，在 mount 时只有 `rootFiber` 会赋值 Placement effectTag，在 commit 阶段只会执行一次插入操作。

### 根 Fiber 节点 Demo

```javascript
function App() {
  return (
    <div>
      <p>Hello, world!</p>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
```


![image](https://github.com/user-attachments/assets/2369c784-c42d-4122-9ef9-e91a22c17d67)

### 参考资料

- [beginWork 流程图](https://react.iamkasong.com/process/beginWork.html)

### 总结

从这节我们学到，`beginWork` 方法会根据 `current` 是否存在区分组件是处于 mount 还是 update，并分别处理。对于 mount 的组件，会创建新的子 Fiber 节点；对于 update 的组件，会将当前组件与该组件在上次更新时对应的 Fiber 节点比较，将比较的结果生成新 Fiber 节点。通过这些学习，我们对 React 的 render 阶段有了更深入的理解。
