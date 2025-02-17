### App Component (FiberNode) 更新流程 - finishClassComponent

在实例创建完成并且调用了上面两个生命周期钩子后，进入到最后一个关键函数 `finishClassComponent`。

#### finishClassComponent 函数

```javascript
function finishClassComponent(
  current: Fiber | null,
  workInProgress: Fiber,
  Component: any,
  shouldUpdate: boolean,
  hasContext: boolean,
  renderExpirationTime: ExpirationTime,
) {
  markRef(current, workInProgress);

  const didCaptureError = (workInProgress.effectTag & DidCapture) !== NoEffect;

  if (!shouldUpdate && !didCaptureError) {
    // Bail out
    return bailoutOnAlreadyFinishedWork(current, workInProgress, renderExpirationTime);
  }

  const instance = workInProgress.stateNode;

  // Rerender
  ReactCurrentOwner.current = workInProgress;
  let nextChildren;
  if (didCaptureError && typeof Component.getDerivedStateFromError === 'function') {
    // Error handling
  } else {
    nextChildren = instance.render();
  }

  workInProgress.effectTag |= PerformedWork;
  if (current !== null && didCaptureError) {
    // Error handling
  } else {
    reconcileChildren(current, workInProgress, nextChildren, renderExpirationTime);
  }

  workInProgress.memoizedState = instance.state;
  if (hasContext) {
    invalidateContextProvider(workInProgress, Component, true);
  }

  return workInProgress.child;
}
```

在 `finishClassComponent` 中，`render` 函数执行返回的就是 `React.Element`（虚拟 DOM 树），最后将其包装成 `FiberNode` 后返回，进入 `workLoopSync` 流程。

#### React Element (FiberNode) 更新流程 - updateHostComponent

在 `beginWork` 函数中，进入 `updateHostComponent` 进行 React Element (FiberNode) 组件更新阶段。

```javascript
function updateHostComponent(
  current: Fiber | null,
  workInProgress: Fiber,
  renderExpirationTime: ExpirationTime,
) {
  pushHostContext(workInProgress);

  if (current === null) {
    tryToClaimNextHydratableInstance(workInProgress);
  }

  const type = workInProgress.type;
  const nextProps = workInProgress.pendingProps;
  const prevProps = current !== null ? current.memoizedProps : null;
  let nextChildren = nextProps.children;

  const isDirectTextChild = shouldSetTextContent(type, nextProps);
  if (isDirectTextChild) {
    nextChildren = null;
  } else if (prevProps !== null && shouldSetTextContent(type, prevProps)) {
    workInProgress.effectTag |= ContentReset;
  }

  markRef(current, workInProgress);

  reconcileChildren(current, workInProgress, nextChildren, renderExpirationTime);
  return workInProgress.child;
}
```

在第 13 行会对组件的 `children` 类型进行判断，判断是否为纯文本内容。在此处，`section` 标签内的 `Hello World` 文本是纯文本，随后 `nextChildren` 就将被置空。

到这里，`nextChildren` 已经为空，完整的 FiberNode 树就已经构建完成。`beginWork` 结束，接下来进入到新的流程。

#### 创建真实 DOM 树

在结束了 `beginWork` 流程后，将调用 `createInstance` 函数创建真实 DOM 树。

```javascript
function createInstance(
  type: string,
  props: Props,
  rootContainerInstance: Container,
  hostContext: HostContext,
  internalInstanceHandle: Object,
): Instance {
  const domElement: Instance = createElement(type, props, rootContainerInstance, hostContext);
  precacheFiberNode(internalInstanceHandle, domElement);
  updateFiberProps(domElement, props);
  return domElement;
}
```

### 整理后的内容

#### finishClassComponent 函数

在实例创建完成并且调用了上面两个生命周期钩子后，进入到最后一个关键函数 `finishClassComponent`。

```javascript
function finishClassComponent(
  current: Fiber | null,
  workInProgress: Fiber,
  Component: any,
  shouldUpdate: boolean,
  hasContext: boolean,
  renderExpirationTime: ExpirationTime,
) {
  markRef(current, workInProgress);

  const didCaptureError = (workInProgress.effectTag & DidCapture) !== NoEffect;

  if (!shouldUpdate && !didCaptureError) {
    // Bail out
    return bailoutOnAlreadyFinishedWork(current, workInProgress, renderExpirationTime);
  }

  const instance = workInProgress.stateNode;

  // Rerender
  ReactCurrentOwner.current = workInProgress;
  let nextChildren;
  if (didCaptureError && typeof Component.getDerivedStateFromError === 'function') {
    // Error handling
  } else {
    nextChildren = instance.render();
  }

  workInProgress.effectTag |= PerformedWork;
  if (current !== null && didCaptureError) {
    // Error handling
  } else {
    reconcileChildren(current, workInProgress, nextChildren, renderExpirationTime);
  }

  workInProgress.memoizedState = instance.state;
  if (hasContext) {
    invalidateContextProvider(workInProgress, Component, true);
  }

  return workInProgress.child;
}
```

在 `finishClassComponent` 中，`render` 函数执行返回的就是 `React.Element`（虚拟 DOM 树），最后将其包装成 `FiberNode` 后返回，进入 `workLoopSync` 流程。

#### React Element (FiberNode) 更新流程 - updateHostComponent

在 `beginWork` 函数中，进入 `updateHostComponent` 进行 React Element (FiberNode) 组件更新阶段。

```javascript
function updateHostComponent(
  current: Fiber | null,
  workInProgress: Fiber,
  renderExpirationTime: ExpirationTime,
) {
  pushHostContext(workInProgress);

  if (current === null) {
    tryToClaimNextHydratableInstance(workInProgress);
  }

  const type = workInProgress.type;
  const nextProps = workInProgress.pendingProps;
  const prevProps = current !== null ? current.memoizedProps : null;
  let nextChildren = nextProps.children;

  const isDirectTextChild = shouldSetTextContent(type, nextProps);
  if (isDirectTextChild) {
    nextChildren = null;
  } else if (prevProps !== null && shouldSetTextContent(type, prevProps)) {
    workInProgress.effectTag |= ContentReset;
  }

  markRef(current, workInProgress);

  reconcileChildren(current, workInProgress, nextChildren, renderExpirationTime);
  return workInProgress.child;
}
```

在第 13 行会对组件的 `children` 类型进行判断，判断是否为纯文本内容。在此处，`section` 标签内的 `Hello World` 文本是纯文本，随后 `nextChildren` 就将被置空。

到这里，`nextChildren` 已经为空，完整的 FiberNode 树就已经构建完成。`beginWork` 结束，接下来进入到新的流程。

#### 创建真实 DOM 树

在结束了 `beginWork` 流程后，将调用 `createInstance` 函数创建真实 DOM 树。

```javascript
function createInstance(
  type: string,
  props: Props,
  rootContainerInstance: Container,
  hostContext: HostContext,
  internalInstanceHandle: Object,
): Instance {
  const domElement: Instance = createElement(type, props, rootContainerInstance, hostContext);
  precacheFiberNode(internalInstanceHandle, domElement);
  updateFiberProps(domElement, props);
  return domElement;
}
```

### 流程图

```plaintext
finishClassComponent（完成类组件的更新）
    ↓
render 函数（返回 React.Element）
    ↓
包装成 FiberNode
    ↓
workLoopSync（继续构建 FiberNode 树）
    ↓
beginWork（根据不同的节点类型调用不同的函数构建 FiberNode 子节点）
    ↓
updateHostComponent（处理宿主组件节点）
    ↓
判断 children 类型（纯文本内容）
    ↓
nextChildren 置空
    ↓
FiberNode 树构建完成
    ↓
createInstance（创建真实 DOM 树）
```

通过以上解析，我们了解了 `finishClassComponent`、`updateHostComponent` 和 `createInstance` 函数的工作流程，以及如何更新和挂载类组件实例，最终创建真实的 DOM 树。接下来，我们将继续深入探讨 React 和 React-DOM 的渲染过程，揭示其内部实现细节。
