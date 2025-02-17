### Fiber 节点的创建与 Fiber 树的构建

本章我们会讲解 Fiber 节点是如何被创建并构建 Fiber 树的。

### render 阶段

render 阶段开始于 `performSyncWorkOnRoot` 或 `performConcurrentWorkOnRoot` 方法的调用。这取决于本次更新是同步更新还是异步更新。

我们现在还不需要学习这两个方法，只需要知道在这两个方法中会调用如下两个方法：

```javascript
// performSyncWorkOnRoot 会调用该方法
function workLoopSync() {
  while (workInProgress !== null) {
    performUnitOfWork(workInProgress);
  }
}

// performConcurrentWorkOnRoot 会调用该方法
function workLoopConcurrent() {
  while (workInProgress !== null && !shouldYield()) {
    performUnitOfWork(workInProgress);
  }
}
```

可以看到，它们唯一的区别是是否调用 `shouldYield`。如果当前浏览器帧没有剩余时间，`shouldYield` 会中止循环，直到浏览器有空闲时间后再继续遍历。

`workInProgress` 代表当前已创建的 workInProgress fiber。

`performUnitOfWork` 方法会创建下一个 Fiber 节点并赋值给 `workInProgress`，并将 `workInProgress` 与已创建的 Fiber 节点连接起来构成 Fiber 树。

### Fiber Reconciler 的工作流程

我们知道 Fiber Reconciler 是从 Stack Reconciler 重构而来，通过遍历的方式实现可中断的递归，所以 `performUnitOfWork` 的工作可以分为两部分：“递”和“归”。

#### “递”阶段

首先从 `rootFiber` 开始向下深度优先遍历。为遍历到的每个 Fiber 节点调用 `beginWork` 方法。

该方法会根据传入的 Fiber 节点创建子 Fiber 节点，并将这两个 Fiber 节点连接起来。

当遍历到叶子节点（即没有子组件的组件）时就会进入“归”阶段。

#### “归”阶段

在“归”阶段会调用 `completeWork` 处理 Fiber 节点。

当某个 Fiber 节点执行完 `completeWork`，如果其存在兄弟 Fiber 节点（即 `fiber.sibling !== null`），会进入其兄弟 Fiber 的“递”阶段。

如果不存在兄弟 Fiber，会进入父级 Fiber 的“归”阶段。

“递”和“归”阶段会交错执行直到“归”到 `rootFiber`。至此，render 阶段的工作就结束了。

### 例子

以上一节的例子举例：

```javascript
function App() {
  return (
    <div>
      i am
      <span>KaSong</span>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
```
<img width="467" alt="image" src="https://github.com/user-attachments/assets/3518c345-45df-48df-9e4e-4ae7f95c87e4" />

对应的 Fiber 树结构：

render 阶段会依次执行：

1. rootFiber `beginWork`
2. App Fiber `beginWork`
3. div Fiber `beginWork`
4. "i am" Fiber `beginWork`
5. "i am" Fiber `completeWork`
6. span Fiber `beginWork`
7. span Fiber `completeWork`
8. div Fiber `completeWork`
9. App Fiber `completeWork`
10. rootFiber `completeWork`

注意：之所以没有 “KaSong” Fiber 的 `beginWork`/`completeWork`，是因为作为一种性能优化手段，针对只有单一文本子节点的 Fiber，React 会特殊处理。

### performUnitOfWork 的递归版本

如果将 `performUnitOfWork` 转化为递归版本，大体代码如下：

```javascript
function performUnitOfWork(fiber) {
  // 执行 beginWork

  if (fiber.child) {
    performUnitOfWork(fiber.child);
  }

  // 执行 completeWork

  if (fiber.sibling) {
    performUnitOfWork(fiber.sibling);
  }
}
```

### 总结

本节我们介绍了 render 阶段会调用的方法。在接下来两节中，我们会讲解 `beginWork` 和 `completeWork` 做的具体工作。

### 参考资料

- [The how and why on React’s usage of linked list in Fiber to walk the component’s tree](https://medium.com/react-in-depth/the-how-and-why-on-reacts-usage-of-linked-list-in-fiber-to-walk-the-components-tree-3358d65c6f7e)
- [Inside Fiber: in-depth overview of the new reconciliation algorithm in React](https://medium.com/react-in-depth/inside-fiber-in-depth-overview-of-the-new-reconciliation-algorithm-in-react-333c7d9a6f85)
