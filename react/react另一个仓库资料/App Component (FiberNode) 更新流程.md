### App Component (FiberNode) 更新流程 - updateClassComponent

在构建完根 FiberNode 后，接下来就是对子节点的依次更新流程，也就是 App Component 对应的 FiberNode。我们依然从 `beginWork` 函数开始，在第 232~246 行调用了 App Component 节点的更新流程。

#### updateClassComponent 函数

```javascript
function updateClassComponent(
  current: Fiber | null,
  workInProgress: Fiber,
  Component: any,
  nextProps: any,
  renderExpirationTime: ExpirationTime,
) {
  const instance = workInProgress.stateNode;
  let shouldUpdate;

  if (instance === null) {
    // 创建新的类组件实例
    constructClassInstance(workInProgress, Component, nextProps);
    mountClassInstance(workInProgress, Component, nextProps, renderExpirationTime);
    shouldUpdate = true;
  } else if (current === null) {
    // 更新现有的类组件实例
    shouldUpdate = resumeMountClassInstance(
      workInProgress,
      Component,
      nextProps,
      renderExpirationTime,
    );
  } else {
    shouldUpdate = updateClassInstance(
      current,
      workInProgress,
      Component,
      nextProps,
      renderExpirationTime,
    );
  }

  return finishClassComponent(
    current,
    workInProgress,
    Component,
    shouldUpdate,
    hasContext,
    renderExpirationTime,
  );
}
```

#### constructClassInstance 函数

在 `updateClassComponent` 函数中，有三个关键函数，第一个是 `constructClassInstance`。

```javascript
function constructClassInstance(
  workInProgress: Fiber,
  ctor: any,
  props: any,
) {
  const unmaskedContext = emptyContextObject;
  const context = emptyContextObject;
  const instance = new ctor(props, context);
  workInProgress.stateNode = instance;
  instance.updater = classComponentUpdater;
  instance.props = props;
  instance.context = context;
  instance.refs = emptyRefsObject;
  instance.state = workInProgress.memoizedState;
  return instance;
}
```

- **第 96 行**: 创建 App Component 实例。
- **第 101 行**: 将实例挂载在 `workInProgress` 的 `stateNode` 属性中。
- **第 107 行**: 最后返回该实例。

#### mountClassInstance 函数

在 `constructClassInstance` 执行完成后，接下来执行第二个关键函数 `mountClassInstance`。

```javascript
function mountClassInstance(
  workInProgress: Fiber,
  ctor: any,
  newProps: any,
  renderExpirationTime: ExpirationTime,
) {
  const instance = workInProgress.stateNode;
  instance.props = newProps;
  instance.state = workInProgress.memoizedState;
  instance.refs = emptyRefsObject;

  initializeUpdateQueue(workInProgress);

  const contextType = ctor.contextType;
  if (typeof contextType === 'object' && contextType !== null) {
    instance.context = readContext(contextType);
  } else {
    instance.context = emptyContextObject;
  }

  processUpdateQueue(workInProgress, newProps, instance, renderExpirationTime);
  instance.state = workInProgress.memoizedState;

  const getDerivedStateFromProps = ctor.getDerivedStateFromProps;
  if (typeof getDerivedStateFromProps === 'function') {
    applyDerivedStateFromProps(workInProgress, ctor, getDerivedStateFromProps, newProps);
    instance.state = workInProgress.memoizedState;
  }

  if (typeof instance.componentWillMount === 'function') {
    instance.componentWillMount();
  }
  if (typeof instance.UNSAFE_componentWillMount === 'function') {
    instance.UNSAFE_componentWillMount();
  }
}
```

- **第 136~145 行**: 执行 Component 的第一个生命周期钩子 `getDerivedStateFromProps`，它使用返回的对象来更新 state。
- **第 153 行**: 触发第二个生命周期钩子 `componentWillMount`，主要用于在挂载前执行一些操作。

#### UNSAFE_componentWillMount 方法解析

- **旧称**: `componentWillMount`
- **React 17 版本后的变化**: 更名为 `UNSAFE_componentWillMount`，但仍可继续使用旧名称至 React 17。建议使用 `rename-unsafe-lifecycles codemod` 自动更新组件。
- **调用时机**: 组件挂载之前，且在 `render()` 之前调用。
- **注意事项**:
  - 由于在 `render()` 之前调用，所以在该方法中同步调用 `setState()` 不会触发额外渲染。
  - 通常建议在 `constructor()` 中初始化 state。
  - 避免在 `UNSAFE_componentWillMount` 中引入任何副作用或订阅，如果需要，请改用 `componentDidMount()`。
- **特殊情况**: 这是服务端渲染唯一会调用的生命周期函数。

#### 流程图

我们来画一张流程图进行梳理：

```plaintext
beginWork（根据不同的节点类型调用不同的函数构建 FiberNode 子节点）
    ↓
updateClassComponent（处理类组件节点）
    ↓
constructClassInstance（创建类组件实例）
    ↓
mountClassInstance（挂载类组件实例）
    ↓
getDerivedStateFromProps（触发第一个生命周期钩子）
    ↓
componentWillMount（触发第二个生命周期钩子）
```

通过以上解析，我们了解了 `updateClassComponent`、`constructClassInstance` 和 `mountClassInstance` 函数的工作流程，以及如何更新和挂载类组件实例。接下来，我们将继续深入探讨 React 和 React-DOM 的渲染过程，揭示其内部实现细节。
