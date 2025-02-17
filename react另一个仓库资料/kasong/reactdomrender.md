### ReactDOM.render 完整流程解析

经过前几章的学习，我们终于回到了 React 应用的起点。这一节我们将完整地走通 `ReactDOM.render` 完成页面渲染的整个流程。

### 创建 Fiber

从双缓存机制一节我们知道，首次执行 `ReactDOM.render` 会创建 `fiberRootNode` 和 `rootFiber`。其中 `fiberRootNode` 是整个应用的根节点，`rootFiber` 是要渲染组件所在组件树的根节点。

这一步发生在调用 `ReactDOM.render` 后进入的 `legacyRenderSubtreeIntoContainer` 方法中。

```javascript
// container 指 ReactDOM.render 的第二个参数（即应用挂载的 DOM 节点）
root = container._reactRootContainer = legacyCreateRootFromDOMContainer(
  container,
  forceHydrate,
);
fiberRoot = root._internalRoot;
```

`legacyCreateRootFromDOMContainer` 方法内部会调用 `createFiberRoot` 方法完成 `fiberRootNode` 和 `rootFiber` 的创建以及关联，并初始化 `updateQueue`。

```javascript
export function createFiberRoot(
  containerInfo: any,
  tag: RootTag,
  hydrate: boolean,
  hydrationCallbacks: null | SuspenseHydrationCallbacks,
): FiberRoot {
  // 创建 fiberRootNode
  const root: FiberRoot = (new FiberRootNode(containerInfo, tag, hydrate): any);
  
  // 创建 rootFiber
  const uninitializedFiber = createHostRootFiber(tag);

  // 连接 rootFiber 与 fiberRootNode
  root.current = uninitializedFiber;
  uninitializedFiber.stateNode = root;

  // 初始化 updateQueue
  initializeUpdateQueue(uninitializedFiber);

  return root;
}
```
<img width="546" alt="image" src="https://github.com/user-attachments/assets/57390104-bad4-4966-9f7e-6437ebcb8527" />

### 创建 Update

组件的初始化工作完成后，接下来就等待创建 Update 来开启一次更新。这一步发生在 `updateContainer` 方法中。

```javascript
export function updateContainer(
  element: ReactNodeList,
  container: OpaqueRoot,
  parentComponent: ?React$Component<any, any>,
  callback: ?Function,
): Lane {
  // 创建 update
  const update = createUpdate(eventTime, lane, suspenseConfig);
  
  // update.payload 为需要挂载在根节点的组件
  update.payload = {element};

  // callback 为 ReactDOM.render 的第三个参数 —— 回调函数
  callback = callback === undefined ? null : callback;
  if (callback !== null) {
    update.callback = callback;
  }

  // 将生成的 update 加入 updateQueue
  enqueueUpdate(current, update);
  // 调度更新
  scheduleUpdateOnFiber(current, lane, eventTime);

  return lane;
}
```

值得注意的是其中 `update.payload = {element}`。这就是我们在 Update 一节介绍的，对于 HostRoot，payload 为 `ReactDOM.render` 的第一个传参。

### 流程概览

至此，`ReactDOM.render` 的流程就和我们已知的流程连接上了。整个流程如下：

1. **创建 fiberRootNode、rootFiber、updateQueue**（`legacyCreateRootFromDOMContainer`）
2. **创建 Update 对象**（`updateContainer`）
3. **从 fiber 到 root**（`markUpdateLaneFromFiberToRoot`）
4. **调度更新**（`ensureRootIsScheduled`）
5. **render 阶段**（`performSyncWorkOnRoot` 或 `performConcurrentWorkOnRoot`）
6. **commit 阶段**（`commitRoot`）

### React 的其他入口函数

当前 React 共有三种模式：

1. **legacy**：这是当前 React 使用的方式。当前没有计划删除本模式，但是这个模式可能不支持一些新功能。
2. **blocking**：开启部分 concurrent 模式特性的中间模式。目前正在实验中。作为迁移到 concurrent 模式的第一个步骤。
3. **concurrent**：面向未来的开发模式。我们之前讲的任务中断/任务优先级都是针对 concurrent 模式。

你可以从下表看出各种模式对特性的支持：

| 特性 | legacy 模式 | blocking 模式 | concurrent 模式 |
| --- | --- | --- | --- |
| String Refs | ✅ | 🚫** | 🚫** |
| Legacy Context | ✅ | 🚫** | 🚫** |
| findDOMNode | ✅ | 🚫** | 🚫** |
| Suspense | ✅ | ✅ | ✅ |
| SuspenseList | 🚫 | ✅ | ✅ |
| Suspense SSR + Hydration | 🚫 | ✅ | ✅ |
| Progressive Hydration | 🚫 | ✅ | ✅ |
| Selective Hydration | 🚫 | 🚫 | ✅ |
| Cooperative Multitasking | 🚫 | 🚫 | ✅ |
| Automatic batching of multiple setStates | 🚫* | ✅ | ✅ |
| Priority-based Rendering | 🚫 | 🚫 | ✅ |
| Interruptible Prerendering | 🚫 | 🚫 | ✅ |
| useTransition | 🚫 | 🚫 | ✅ |
| useDeferredValue | 🚫 | 🚫 | ✅ |
| Suspense Reveal "Train" | 🚫 | 🚫 | ✅ |

*：legacy 模式在合成事件中有自动批处理的功能，但仅限于一个浏览器任务。非 React 事件想使用这个功能必须使用 `unstable_batchedUpdates`。在 blocking 模式和 concurrent 模式下，所有的 `setState` 在默认情况下都是批处理的。

**：会在开发中发出警告。

模式的变化影响整个应用的工作方式，所以无法只针对某个组件开启不同模式。

基于此原因，可以通过不同的入口函数开启不同模式：

- **legacy**：`ReactDOM.render(<App />, rootNode)`
- **blocking**：`ReactDOM.createBlockingRoot(rootNode).render(<App />)`
- **concurrent**：`ReactDOM.createRoot(rootNode).render(<App />)`

虽然不同模式的入口函数不同，但是它们仅对 `fiber.mode` 变量产生影响，对我们在流程概览中描述的流程并无影响。

### 参考资料

- [React 团队解释为什么会有这么多模式](https://reactjs.org/docs/concurrent-mode-intro.html)

通过以上内容，我们完整地走通了 `ReactDOM.render` 完成页面渲染的整个流程，并了解了 React 的不同模式及其入口函数。
