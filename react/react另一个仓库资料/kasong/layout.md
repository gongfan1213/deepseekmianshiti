### React Commit 阶段：Layout 阶段

该阶段之所以称为 layout，因为该阶段的代码都是在 DOM 修改完成（mutation 阶段完成）后执行的。

注意：由于 JS 的同步执行阻塞了主线程，所以此时 JS 已经可以获取到新的 DOM，但是浏览器对新的 DOM 并没有完成渲染。

该阶段触发的生命周期钩子和 hook 可以直接访问到已经改变后的 DOM，即该阶段是可以参与 DOM layout 的阶段。

### 概览

与前两个阶段类似，layout 阶段也是遍历 `effectList`，执行函数。

具体执行的函数是 `commitLayoutEffects`。

```javascript
root.current = finishedWork;

nextEffect = firstEffect;
do {
  try {
    commitLayoutEffects(root, lanes);
  } catch (error) {
    invariant(nextEffect !== null, "Should be working on an effect.");
    captureCommitPhaseError(nextEffect, error);
    nextEffect = nextEffect.nextEffect;
  }
} while (nextEffect !== null);

nextEffect = null;
```

### commitLayoutEffects

代码如下：

```javascript
function commitLayoutEffects(root: FiberRoot, committedLanes: Lanes) {
  while (nextEffect !== null) {
    const effectTag = nextEffect.effectTag;

    // 调用生命周期钩子和 hook
    if (effectTag & (Update | Callback)) {
      const current = nextEffect.alternate;
      commitLayoutEffectOnFiber(root, current, nextEffect, committedLanes);
    }

    // 赋值 ref
    if (effectTag & Ref) {
      commitAttachRef(nextEffect);
    }

    nextEffect = nextEffect.nextEffect;
  }
}
```

`commitLayoutEffects` 一共做了两件事：

1. `commitLayoutEffectOnFiber`（调用生命周期钩子和 hook 相关操作）
2. `commitAttachRef`（赋值 ref）

### commitLayoutEffectOnFiber

`commitLayoutEffectOnFiber` 方法会根据 `fiber.tag` 对不同类型的节点分别处理。

对于 ClassComponent，它会通过 `current === null` 区分是 mount 还是 update，调用 `componentDidMount` 或 `componentDidUpdate`。触发状态更新的 `this.setState` 如果赋值了第二个参数回调函数，也会在此时调用。

```javascript
this.setState({ xxx: 1 }, () => {
  console.log("i am update~");
});
```

对于 FunctionComponent 及相关类型，它会调用 `useLayoutEffect` hook 的回调函数，调度 `useEffect` 的销毁与回调函数。相关类型指特殊处理后的 FunctionComponent，比如 ForwardRef、React.memo 包裹的 FunctionComponent。

```javascript
switch (finishedWork.tag) {
  // 以下都是 FunctionComponent 及相关类型
  case FunctionComponent:
  case ForwardRef:
  case SimpleMemoComponent:
  case Block: {
    // 执行 useLayoutEffect 的回调函数
    commitHookEffectListMount(HookLayout | HookHasEffect, finishedWork);
    // 调度 useEffect 的销毁函数与回调函数
    schedulePassiveEffects(finishedWork);
    return;
  }
}
```

在上一节介绍 Update effect 时介绍过，mutation 阶段会执行 `useLayoutEffect` hook 的销毁函数。

结合这里我们可以发现，`useLayoutEffect` hook 从上一次更新的销毁函数调用到本次更新的回调函数调用是同步执行的。

而 `useEffect` 则需要先调度，在 Layout 阶段完成后再异步执行。

这就是 `useLayoutEffect` 与 `useEffect` 的区别。

对于 HostRoot，即 rootFiber，如果赋值了第三个参数回调函数，也会在此时调用。

```javascript
ReactDOM.render(<App />, document.querySelector("#root"), function() {
  console.log("i am mount~");
});
```

### commitAttachRef

`commitLayoutEffects` 会做的第二件事是 `commitAttachRef`。

```javascript
function commitAttachRef(finishedWork: Fiber) {
  const ref = finishedWork.ref;
  if (ref !== null) {
    const instance = finishedWork.stateNode;

    // 获取 DOM 实例
    let instanceToUse;
    switch (finishedWork.tag) {
      case HostComponent:
        instanceToUse = getPublicInstance(instance);
        break;
      default:
        instanceToUse = instance;
    }

    if (typeof ref === "function") {
      // 如果 ref 是函数形式，调用回调函数
      ref(instanceToUse);
    } else {
      // 如果 ref 是 ref 实例形式，赋值 ref.current
      ref.current = instanceToUse;
    }
  }
}
```

代码逻辑很简单：获取 DOM 实例，更新 ref。

### current Fiber 树切换

至此，整个 layout 阶段就结束了。

在结束本节的学习前，我们关注下这行代码：

```javascript
root.current = finishedWork;
```

在双缓存机制一节我们介绍过，workInProgress Fiber 树在 commit 阶段完成渲染后会变为 current Fiber 树。这行代码的作用就是切换 `fiberRootNode` 指向的 current Fiber 树。

那么这行代码为什么在这里呢？（在 mutation 阶段结束后，layout 阶段开始前。）

我们知道 `componentWillUnmount` 会在 mutation 阶段执行。此时 current Fiber 树还指向前一次更新的 Fiber 树，在生命周期钩子内获取的 DOM 还是更新前的。

`componentDidMount` 和 `componentDidUpdate` 会在 layout 阶段执行。此时 current Fiber 树已经指向更新后的 Fiber 树，在生命周期钩子内获取的 DOM 就是更新后的。

### 总结

从这节我们学到，layout 阶段会遍历 `effectList`，依次执行 `commitLayoutEffects`。该方法的主要工作为“根据 `effectTag` 调用不同的处理函数处理 Fiber 并更新 ref。

### 参考资料

- [useEffect vs useLayoutEffect Examples](https://reactjs.org/docs/hooks-reference.html#uselayouteffect)
- [React Hooks Reference](https://reactjs.org/docs/hooks-reference.html#uselayouteffect)
