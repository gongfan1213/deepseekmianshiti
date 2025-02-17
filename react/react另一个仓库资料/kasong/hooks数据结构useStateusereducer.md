### Hooks 的数据结构

在上一节我们实现了一个极简的 `useState`，了解了 Hooks 的运行原理。本节我们讲解 Hooks 的数据结构，为后面介绍具体的 hook 打下基础。

### Dispatcher

在上一节的极简 `useState` 实现中，使用 `isMount` 变量区分 mount 与 update。在真实的 Hooks 中，组件 mount 时的 hook 与 update 时的 hook 来源于不同的对象，这类对象在源码中被称为 dispatcher。

```javascript
// mount 时的 Dispatcher
const HooksDispatcherOnMount: Dispatcher = {
  useCallback: mountCallback,
  useContext: readContext,
  useEffect: mountEffect,
  useImperativeHandle: mountImperativeHandle,
  useLayoutEffect: mountLayoutEffect,
  useMemo: mountMemo,
  useReducer: mountReducer,
  useRef: mountRef,
  useState: mountState,
  // ...省略
};

// update 时的 Dispatcher
const HooksDispatcherOnUpdate: Dispatcher = {
  useCallback: updateCallback,
  useContext: readContext,
  useEffect: updateEffect,
  useImperativeHandle: updateImperativeHandle,
  useLayoutEffect: updateLayoutEffect,
  useMemo: updateMemo,
  useReducer: updateReducer,
  useRef: updateRef,
  useState: updateState,
  // ...省略
};
```

可见，mount 时调用的 hook 和 update 时调用的 hook 其实是两个不同的函数。

在 FunctionComponent render 前，会根据 FunctionComponent 对应 fiber 的以下条件区分 mount 与 update。

```javascript
current === null || current.memoizedState === null
```

并将不同情况对应的 dispatcher 赋值给全局变量 `ReactCurrentDispatcher` 的 `current` 属性。

```javascript
ReactCurrentDispatcher.current =
  current === null || current.memoizedState === null
    ? HooksDispatcherOnMount
    : HooksDispatcherOnUpdate;
```

在 FunctionComponent render 时，会从 `ReactCurrentDispatcher.current`（即当前 dispatcher）中寻找需要的 hook。

### Hook 的数据结构

接下来我们学习 hook 的数据结构。

```javascript
const hook: Hook = {
  memoizedState: null,
  baseState: null,
  baseQueue: null,
  queue: null,
  next: null,
};
```

其中除 `memoizedState` 以外字段的意义与上一章介绍的 `updateQueue` 类似。

#### memoizedState

注意区分 `hook` 与 FunctionComponent `fiber` 都存在 `memoizedState` 属性，不要混淆它们的概念。

- **fiber.memoizedState**：FunctionComponent 对应 fiber 保存的 Hooks 链表。
- **hook.memoizedState**：Hooks 链表中保存的单一 hook 对应的数据。

不同类型 hook 的 `memoizedState` 保存不同类型数据，具体如下：

- **useState**：对于 `const [state, updateState] = useState(initialState)`，`memoizedState` 保存 state 的值。
- **useReducer**：对于 `const [state, dispatch] = useReducer(reducer, {})`，`memoizedState` 保存 state 的值。
- **useEffect**：`memoizedState` 保存包含 `useEffect` 回调函数、依赖项等的链表数据结构 `effect`，effect 链表同时会保存在 `fiber.updateQueue` 中。
- **useRef**：对于 `useRef(1)`，`memoizedState` 保存 `{current: 1}`。
- **useMemo**：对于 `useMemo(callback, [depA])`，`memoizedState` 保存 `[callback(), depA]`。
- **useCallback**：对于 `useCallback(callback, [depA])`，`memoizedState` 保存 `[callback, depA]`。与 `useMemo` 的区别是，`useCallback` 保存的是 callback 函数本身，而 `useMemo` 保存的是 callback 函数的执行结果。

有些 hook 是没有 `memoizedState` 的，比如 `useContext`。

### useState 与 useReducer 的实现

本节我们来学习 `useState` 与 `useReducer` 的实现。

#### 流程概览

我们将这两个 Hook 的工作流程分为声明阶段和调用阶段，对于：

```javascript
function App() {
  const [state, dispatch] = useReducer(reducer, { a: 1 });
  const [num, updateNum] = useState(0);

  return (
    <div>
      <button onClick={() => dispatch({ type: "a" })}>{state.a}</button>
      <button onClick={() => updateNum((num) => num + 1)}>{num}</button>
    </div>
  );
}
```

- **声明阶段**：即 App 调用时，会依次执行 `useReducer` 与 `useState` 方法。
- **调用阶段**：即点击按钮后，dispatch 或 updateNum 被调用时。

#### 声明阶段

当 FunctionComponent 进入 render 阶段的 `beginWork` 时，会调用 `renderWithHooks` 方法。该方法内部会执行 FunctionComponent 对应函数（即 `fiber.type`）。

对于这两个 Hook，它们的源码如下：

```javascript
function useState(initialState) {
  var dispatcher = resolveDispatcher();
  return dispatcher.useState(initialState);
}

function useReducer(reducer, initialArg, init) {
  var dispatcher = resolveDispatcher();
  return dispatcher.useReducer(reducer, initialArg, init);
}
```

在不同场景下，同一个 Hook 会调用不同处理函数。我们分别讲解 mount 与 update 两个场景。

##### mount 时

mount 时，`useReducer` 会调用 `mountReducer`，`useState` 会调用 `mountState`。

```javascript
function mountState<S>(initialState: (() => S) | S): [S, Dispatch<BasicStateAction<S>>] {
  // 创建并返回当前的 hook
  const hook = mountWorkInProgressHook();

  // ...赋值初始 state

  // 创建 queue
  const queue = (hook.queue = {
    pending: null,
    dispatch: null,
    lastRenderedReducer: basicStateReducer,
    lastRenderedState: (initialState: any),
  });

  // ...创建 dispatch
  return [hook.memoizedState, dispatch];
}

function mountReducer<S, I, A>(reducer: (S, A) => S, initialArg: I, init?: (I) => S): [S, Dispatch<A>] {
  // 创建并返回当前的 hook
  const hook = mountWorkInProgressHook();

  // ...赋值初始 state

  // 创建 queue
  const queue = (hook.queue = {
    pending: null,
    dispatch: null,
    lastRenderedReducer: reducer,
    lastRenderedState: (initialState: any),
  });

  // ...创建 dispatch
  return [hook.memoizedState, dispatch];
}
```

其中 `mountWorkInProgressHook` 方法会创建并返回对应 hook，对应极简 Hooks 实现中 `useState` 方法的 `isMount` 逻辑部分。

可以看到，mount 时这两个 Hook 的唯一区别为 queue 参数的 `lastRenderedReducer` 字段。

queue 的数据结构如下：

```javascript
const queue = (hook.queue = {
  // 与极简实现中的同名字段意义相同，保存 update 对象
  pending: null,
  // 保存 dispatchAction.bind() 的值
  dispatch: null,
  // 上一次 render 时使用的 reducer
  lastRenderedReducer: reducer,
  // 上一次 render 时的 state
  lastRenderedState: (initialState: any),
});
```

其中，`useReducer` 的 `lastRenderedReducer` 为传入的 reducer 参数。`useState` 的 `lastRenderedReducer` 为 `basicStateReducer`。

`basicStateReducer` 方法如下：

```javascript
function basicStateReducer<S>(state: S, action: BasicStateAction<S>): S {
  return typeof action === "function" ? action(state) : action;
}
```

可见，`useState` 即 reducer 参数为 `basicStateReducer` 的 `useReducer`。

mount 时的整体运行逻辑与极简实现的 `isMount` 逻辑类似。

##### update 时

update 时，`useReducer` 与 `useState` 调用的是同一个函数 `updateReducer`。

```javascript
function updateReducer<S, I, A>(reducer: (S, A) => S, initialArg: I, init?: (I) => S): [S, Dispatch<A>] {
  // 获取当前 hook
  const hook = updateWorkInProgressHook();
  const queue = hook.queue;

  queue.lastRenderedReducer = reducer;

  // ...同 update 与 updateQueue 类似的更新逻辑

  const dispatch: Dispatch<A> = (queue.dispatch: any);
  return [hook.memoizedState, dispatch];
}
```

整个流程可以概括为一句话：找到对应的 hook，根据 update 计算该 hook 的新 state 并返回。

mount 时获取当前 hook 使用的是 `mountWorkInProgressHook`，而 update 时使用的是 `updateWorkInProgressHook`。

### 调用阶段

调用阶段会执行 `dispatchAction`，此时该 FunctionComponent 对应的 fiber 以及 hook.queue 已经通过调用 bind 方法预先作为参数传入。

```javascript
function dispatchAction(fiber, queue, action) {
  // ...创建 update
  var update = {
    eventTime: eventTime,
    lane: lane,
    suspenseConfig: suspenseConfig,
    action: action,
    eagerReducer: null,
    eagerState: null,
    next: null,
  };

  // ...将 update 加入 queue.pending

  var alternate = fiber.alternate;

  if (
    fiber === currentlyRenderingFiber$1 ||
    (alternate !== null && alternate === currentlyRenderingFiber$1)
  ) {
    // render 阶段触发的更新
    didScheduleRenderPhaseUpdateDuringThisPass =
      didScheduleRenderPhaseUpdate = true;
  } else {
    if (
      fiber.lanes === NoLanes &&
      (alternate === null || alternate.lanes === NoLanes)
    ) {
      // ...fiber 的 updateQueue 为空，优化路径
    }

    scheduleUpdateOnFiber(fiber, lane, eventTime);
  }
}
```

整个过程可以概括为：创建 update，将 update 加入 queue.pending 中，并开启调度。

### 小 Tip

我们通常认为，`useReducer(reducer, initialState)` 的传参为初始化参数，在以后的调用中都不可变。

但是在 `updateReducer` 方法中，可以看到 `lastRenderedReducer` 在每次调用时都会重新赋值。

```javascript
function updateReducer(reducer, initialArg, init) {
  // ...

  queue.lastRenderedReducer = reducer;

  // ...
}
```

也就是说，reducer 参数是随时可变的。

### 总结

通过本节的学习，我们了解了 Hooks 的数据结构和 `useState`、`useReducer` 的实现原理。接下来我们会继续深入学习其他 Hooks 的实现。
