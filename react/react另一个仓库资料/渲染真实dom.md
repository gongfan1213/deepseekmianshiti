### 渲染真实 DOM

在 React-DOM 中，渲染真实 DOM 的过程是通过 `insertOrAppendPlacementNodeIntoContainer` 方法对 FiberNode 进行遍历。

#### insertOrAppendPlacementNodeIntoContainer 函数

```javascript
function insertOrAppendPlacementNodeIntoContainer(
  node: Fiber,
  before: ?Instance,
  parent: Container,
): void {
  const { tag } = node;
  const isHost = tag === HostComponent || tag === HostText;
  if (isHost) {
    const stateNode = isHost ? node.stateNode : node.stateNode.instance;
    if (before) {
      insertInContainerBefore(parent, stateNode, before);
    } else {
      appendChildToContainer(parent, stateNode);
    }
  } else if (tag === HostPortal) {
    // Handle HostPortal
  } else {
    const child = node.child;
    if (child !== null) {
      insertOrAppendPlacementNodeIntoContainer(child, before, parent);
      let sibling = child.sibling;
      while (sibling !== null) {
        insertOrAppendPlacementNodeIntoContainer(sibling, before, parent);
        sibling = sibling.sibling;
      }
    }
  }
}
```

由上图可知，该函数会对 Host 节点（带有 HTML tag 结构的节点）调用 `appendChildToContainer` 函数进行渲染，其他节点取其 `child` 值进行递归调用。

#### appendChildToContainer 函数

在 `appendChildToContainer` 函数内部，通过 `appendChild` 将 FiberNode 上的 `stateNode`（我们在上一步创建好的真实 DOM 树）添加到 `container`（#app）中，然后调用 `componentDidMount` 生命周期钩子函数。

```javascript
function appendChildToContainer(container, child) {
  if (container.nodeType === COMMENT_NODE) {
    container.parentNode.insertBefore(child, container);
  } else {
    container.appendChild(child);
  }
}
```

#### componentDidMount 方法解析

```plaintext
componentDidMount()
```

- **调用时机**: 组件挂载后（插入 DOM 树中）立即调用。依赖于 DOM 节点的初始化应放在这里。如需通过网络请求获取数据，此处是实例化请求的好地方。
- **注意事项**:
  - 这个方法是比较适合添加订阅的地方。如果添加了订阅，请不要忘记在 `componentWillUnmount` 里取消订阅。
  - 你可以在 `componentDidMount` 里直接调用 `setState()`。它将触发额外渲染，但此渲染会发生在浏览器更新屏幕之前。如确保即使在 `render()` 两次调用的情况下，用户不会看到中间状态。请谨慎使用该模式，因为它会导致性能问题。通常，你应该在 `constructor` 中初始化 state。如果你的渲染依赖于 DOM 节点的大小或位置，比如实现 modals 和 tooltips 等情况，你可以使用此方式处理。

#### 渲染流程图

```plaintext
ReactDOM.render()
    ↓
设置更新队列
    ↓
递归构建 FiberNode 树
    ↓
根据类型调用对应的更新方法
    ↓
Component 实例触发生命周期钩子函数
    ↓
遍历 Host 节点，构建真实 DOM 树
    ↓
将真实 DOM 树挂载在 container 上
    ↓
渲染到页面中
    ↓
完成
```

### 整理后的内容

#### insertOrAppendPlacementNodeIntoContainer 函数

```javascript
function insertOrAppendPlacementNodeIntoContainer(
  node: Fiber,
  before: ?Instance,
  parent: Container,
): void {
  const { tag } = node;
  const isHost = tag === HostComponent || tag === HostText;
  if (isHost) {
    const stateNode = isHost ? node.stateNode : node.stateNode.instance;
    if (before) {
      insertInContainerBefore(parent, stateNode, before);
    } else {
      appendChildToContainer(parent, stateNode);
    }
  } else if (tag === HostPortal) {
    // Handle HostPortal
  } else {
    const child = node.child;
    if (child !== null) {
      insertOrAppendPlacementNodeIntoContainer(child, before, parent);
      let sibling = child.sibling;
      while (sibling !== null) {
        insertOrAppendPlacementNodeIntoContainer(sibling, before, parent);
        sibling = sibling.sibling;
      }
    }
  }
}
```

#### appendChildToContainer 函数

```javascript
function appendChildToContainer(container, child) {
  if (container.nodeType === COMMENT_NODE) {
    container.parentNode.insertBefore(child, container);
  } else {
    container.appendChild(child);
  }
}
```

#### componentDidMount 方法解析

```plaintext
componentDidMount()
```

- **调用时机**: 组件挂载后（插入 DOM 树中）立即调用。依赖于 DOM 节点的初始化应放在这里。如需通过网络请求获取数据，此处是实例化请求的好地方。
- **注意事项**:
  - 这个方法是比较适合添加订阅的地方。如果添加了订阅，请不要忘记在 `componentWillUnmount` 里取消订阅。
  - 你可以在 `componentDidMount` 里直接调用 `setState()`。它将触发额外渲染，但此渲染会发生在浏览器更新屏幕之前。如确保即使在 `render()` 两次调用的情况下，用户不会看到中间状态。请谨慎使用该模式，因为它会导致性能问题。通常，你应该在 `constructor` 中初始化 state。如果你的渲染依赖于 DOM 节点的大小或位置，比如实现 modals 和 tooltips 等情况，你可以使用此方式处理。

#### 渲染流程图

```plaintext
ReactDOM.render()
    ↓
设置更新队列
    ↓
递归构建 FiberNode 树
    ↓
根据类型调用对应的更新方法
    ↓
Component 实例触发生命周期钩子函数
    ↓
遍历 Host 节点，构建真实 DOM 树
    ↓
将真实 DOM 树挂载在 container 上
    ↓
渲染到页面中
    ↓
完成
```

通过以上解析，我们了解了 `insertOrAppendPlacementNodeIntoContainer`、`appendChildToContainer` 和 `componentDidMount` 函数的工作流程，以及如何将真实 DOM 树渲染到页面中。至此，我们的渲染流程解析宣告完成。
