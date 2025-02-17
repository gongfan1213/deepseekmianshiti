### Update 的结构与工作流程

在本章第一节学习中，我们知道状态更新流程开始后首先会创建 Update 对象。本节我们学习 Update 的结构与工作流程。

你可以将 Update 类比心智模型中的一次 commit。

### Update 的分类

我们先来了解 Update 的结构。

首先，我们将可以触发更新的方法所隶属的组件分类：

- `ReactDOM.render` —— HostRoot
- `this.setState` —— ClassComponent
- `this.forceUpdate` —— ClassComponent
- `useState` —— FunctionComponent
- `useReducer` —— FunctionComponent

可以看到，一共三种组件（HostRoot | ClassComponent | FunctionComponent）可以触发更新。

由于不同类型组件工作方式不同，所以存在两种不同结构的 Update，其中 ClassComponent 与 HostRoot 共用一套 Update 结构，FunctionComponent 单独使用一种 Update 结构。

虽然它们的结构不同，但是它们工作机制与工作流程大体相同。在本节我们介绍前一种 Update，FunctionComponent 对应的 Update 在 Hooks 章节介绍。

### Update 的结构

ClassComponent 与 HostRoot（即 rootFiber.tag 对应类型）共用同一种 Update 结构。对应的结构如下：

```javascript
const update: Update<*> = {
  eventTime,
  lane,
  suspenseConfig,
  tag: UpdateState,
  payload: null,
  callback: null,
  next: null,
};
```

Update 由 `createUpdate` 方法返回，字段意义如下：

- **eventTime**：任务时间，通过 `performance.now()` 获取的毫秒数。由于该字段在未来会重构，当前我们不需要理解它。
- **lane**：优先级相关字段。当前还不需要掌握它，只需要知道不同 Update 优先级可能是不同的。
- **suspenseConfig**：Suspense 相关，暂不关注。
- **tag**：更新的类型，包括 `UpdateState`、`ReplaceState`、`ForceUpdate`、`CaptureUpdate`。
- **payload**：更新挂载的数据，不同类型组件挂载的数据不同。对于 ClassComponent，payload 为 `this.setState` 的第一个传参。对于 HostRoot，payload 为 `ReactDOM.render` 的第一个传参。
- **callback**：更新的回调函数，即在 commit 阶段的 layout 子阶段一节中提到的回调函数。
- **next**：与其他 Update 连接形成链表。

### Update 与 Fiber 的联系

Update 存在一个连接其他 Update 形成链表的字段 `next`。联系 React 中另一种以链表形式组成的结构 Fiber，它们之间有什么关联呢？

答案是肯定的。

从双缓存机制一节我们知道，Fiber 节点组成 Fiber 树，页面中最多同时存在两棵 Fiber 树：

- 代表当前页面状态的 current Fiber 树
- 代表正在 render 阶段的 workInProgress Fiber 树

类似 Fiber 节点组成 Fiber 树，Fiber 节点上的多个 Update 会组成链表并被包含在 `fiber.updateQueue` 中。

### updateQueue

updateQueue 有三种类型，其中针对 HostComponent 的类型我们在 completeWork 一节介绍过。

剩下两种类型和 Update 的两种类型对应。

ClassComponent 与 HostRoot 使用的 UpdateQueue 结构如下：

```javascript
const queue: UpdateQueue<State> = {
  baseState: fiber.memoizedState,
  firstBaseUpdate: null,
  lastBaseUpdate: null,
  shared: {
    pending: null,
  },
  effects: null,
};
```

UpdateQueue 由 `initializeUpdateQueue` 方法返回，字段说明如下：

- **baseState**：本次更新前该 Fiber 节点的 state，Update 基于该 state 计算更新后的 state。
- **firstBaseUpdate** 与 **lastBaseUpdate**：本次更新前该 Fiber 节点已保存的 Update。以链表形式存在，链表头为 `firstBaseUpdate`，链表尾为 `lastBaseUpdate`。
- **shared.pending**：触发更新时，产生的 Update 会保存在 `shared.pending` 中形成单向环状链表。当由 Update 计算 state 时这个环会被剪开并连接在 `lastBaseUpdate` 后面。
- **effects**：数组。保存 `update.callback !== null` 的 Update。

### 例子

假设有一个 Fiber 刚经历 commit 阶段完成渲染。

该 Fiber 上有两个由于优先级过低所以在上次的 render 阶段并没有处理的 Update。它们会成为下次更新的 baseUpdate。

我们称其为 u1 和 u2，其中 `u1.next === u2`。

```plaintext
fiber.updateQueue.baseUpdate: u1 --> u2
```

现在我们在 Fiber 上触发两次状态更新，这会先后产生两个新的 Update，我们称为 u3 和 u4。

每个 update 都会通过 `enqueueUpdate` 方法插入到 `updateQueue` 队列上。

当插入 u3 后：

```plaintext
fiber.updateQueue.shared.pending:   u3 ─────┐ 
                                     ^      |                                    
                                     └──────┘
```

接着插入 u4 之后：

```plaintext
fiber.updateQueue.shared.pending:   u4 ──> u3
                                     ^      |                                    
                                     └──────┘
```

更新调度完成后进入 render 阶段。

此时 `shared.pending` 的环被剪开并连接在 `updateQueue.lastBaseUpdate` 后面：

```plaintext
fiber.updateQueue.baseUpdate: u1 --> u2 --> u3 --> u4
```

接下来遍历 `updateQueue.baseUpdate` 链表，以 `fiber.updateQueue.baseState` 为初始 state，依次与遍历到的每个 Update 计算并产生新的 state。

在遍历时如果有优先级低的 Update 会被跳过。

当遍历完成后获得的 state，就是该 Fiber 节点在本次更新的 state（源码中叫做 `memoizedState`）。

render 阶段的 Update 操作由 `processUpdateQueue` 完成。

state 的变化在 render 阶段产生与上次更新不同的 JSX 对象，通过 Diff 算法产生 `effectTag`，在 commit 阶段渲染在页面上。

渲染完成后 workInProgress Fiber 树变为 current Fiber 树，整个更新流程结束。
