### useEffect 的工作原理

在架构篇 commit 阶段流程概览中，我们讲解了 `useEffect` 的工作流程。其中我们谈到在 `flushPassiveEffects` 方法内部会从全局变量 `rootWithPendingPassiveEffects` 获取 `effectList`。

本节我们深入 `flushPassiveEffects` 方法内部探索 `useEffect` 的工作原理。

### flushPassiveEffectsImpl

`flushPassiveEffects` 内部会设置优先级，并执行 `flushPassiveEffectsImpl`。

`flushPassiveEffectsImpl` 主要做三件事：

1. 调用该 `useEffect` 在上一次 render 时的销毁函数
2. 调用该 `useEffect` 在本次 render 时的回调函数
3. 如果存在同步任务，不需要等待下次事件循环的宏任务，提前执行它

本节我们关注前两步。

在 v16 中第一步是同步执行的，在官方博客中提到：

> 副作用清理函数（如果存在）在 React 16 中同步运行。我们发现，对于大型应用程序来说，这不是理想选择，因为同步会减缓屏幕的过渡（例如，切换标签）。

基于这个原因，在 v17.0.0 中，`useEffect` 的两个阶段会在页面渲染后（layout 阶段后）异步执行。

接下来我们详细讲解这两个步骤。

### 阶段一：销毁函数的执行

`useEffect` 的执行需要保证所有组件 `useEffect` 的销毁函数必须都执行完后才能执行任意一个组件的 `useEffect` 的回调函数。

这是因为多个组件间可能共用同一个 `ref`。如果不是按照“全部销毁”再“全部执行”的顺序，那么在某个组件 `useEffect` 的销毁函数中修改的 `ref.current` 可能影响另一个组件 `useEffect` 的回调函数中的同一个 `ref` 的 `current` 属性。

在 `useLayoutEffect` 中也有同样的问题，所以它们都遵循“全部销毁”再“全部执行”的顺序。

在阶段一，会遍历并执行所有 `useEffect` 的销毁函数。

```javascript
// pendingPassiveHookEffectsUnmount 中保存了所有需要执行销毁的 useEffect
const unmountEffects = pendingPassiveHookEffectsUnmount;
pendingPassiveHookEffectsUnmount = [];
for (let i = 0; i < unmountEffects.length; i += 2) {
  const effect = ((unmountEffects[i]: any): HookEffect);
  const fiber = ((unmountEffects[i + 1]: any): Fiber);
  const destroy = effect.destroy;
  effect.destroy = undefined;

  if (typeof destroy === 'function') {
    // 销毁函数存在则执行
    try {
      destroy();
    } catch (error) {
      captureCommitPhaseError(fiber, error);
    }
  }
}
```

其中 `pendingPassiveHookEffectsUnmount` 数组的索引 `i` 保存需要销毁的 `effect`，`i+1` 保存该 `effect` 对应的 `fiber`。

向 `pendingPassiveHookEffectsUnmount` 数组内 `push` 数据的操作发生在 layout 阶段 `commitLayoutEffectOnFiber` 方法内部的 `schedulePassiveEffects` 方法中。

```javascript
function schedulePassiveEffects(finishedWork: Fiber) {
  const updateQueue: FunctionComponentUpdateQueue | null = (finishedWork.updateQueue: any);
  const lastEffect = updateQueue !== null ? updateQueue.lastEffect : null;
  if (lastEffect !== null) {
    const firstEffect = lastEffect.next;
    let effect = firstEffect;
    do {
      const {next, tag} = effect;
      if (
        (tag & HookPassive) !== NoHookEffect &&
        (tag & HookHasEffect) !== NoHookEffect
      ) {
        // 向 `pendingPassiveHookEffectsUnmount` 数组内 `push` 要销毁的 effect
        enqueuePendingPassiveHookEffectUnmount(finishedWork, effect);
        // 向 `pendingPassiveHookEffectsMount` 数组内 `push` 要执行回调的 effect
        enqueuePendingPassiveHookEffectMount(finishedWork, effect);
      }
      effect = next;
    } while (effect !== firstEffect);
  }
}
```

### 阶段二：回调函数的执行

与阶段一类似，同样遍历数组，执行对应 `effect` 的回调函数。

其中向 `pendingPassiveHookEffectsMount` 中 `push` 数据的操作同样发生在 `schedulePassiveEffects` 中。

```javascript
// pendingPassiveHookEffectsMount 中保存了所有需要执行回调的 useEffect
const mountEffects = pendingPassiveHookEffectsMount;
pendingPassiveHookEffectsMount = [];
for (let i = 0; i < mountEffects.length; i += 2) {
  const effect = ((mountEffects[i]: any): HookEffect);
  const fiber = ((mountEffects[i + 1]: any): Fiber);
  
  try {
    const create = effect.create;
    effect.destroy = create();
  } catch (error) {
    captureCommitPhaseError(fiber, error);
  }
}
```

### useRef 的工作原理

`ref` 是 reference（引用）的缩写。在 React 中，我们习惯用 `ref` 保存 DOM。

事实上，任何需要被"引用"的数据都可以保存在 `ref` 中，`useRef` 的出现将这种思想进一步发扬光大。

在 Hooks 数据结构一节我们讲到：

对于 `useRef(1)`，`memoizedState` 保存 `{current: 1}`。

本节我们会介绍 `useRef` 的实现，以及 `ref` 的工作流程。

### useRef

与其他 Hook 一样，对于 mount 与 update，`useRef` 对应两个不同 dispatcher。

```javascript
function mountRef<T>(initialValue: T): {|current: T|} {
  // 获取当前 useRef hook
  const hook = mountWorkInProgressHook();
  // 创建 ref
  const ref = {current: initialValue};
  hook.memoizedState = ref;
  return ref;
}

function updateRef<T>(initialValue: T): {|current: T|} {
  // 获取当前 useRef hook
  const hook = updateWorkInProgressHook();
  // 返回保存的数据
  return hook.memoizedState;
}
```

可见，`useRef` 仅仅是返回一个包含 `current` 属性的对象。

为了验证这个观点，我们再看下 `React.createRef` 方法的实现：

```javascript
export function createRef(): RefObject {
  const refObject = {
    current: null,
  };
  return refObject;
}
```

### ref 的工作流程

在 React 中，HostComponent、ClassComponent、ForwardRef 可以赋值 `ref` 属性。

```javascript
// HostComponent
<div ref={domRef}></div>
// ClassComponent / ForwardRef
<App ref={cpnRef} />
```

其中，ForwardRef 只是将 `ref` 作为第二个参数传递下去，不会进入 `ref` 的工作流程。

我们知道 HostComponent 在 commit 阶段的 mutation 阶段执行 DOM 操作。所以，对应 `ref` 的更新也是发生在 mutation 阶段。

再进一步，mutation 阶段执行 DOM 操作的依据为 `effectTag`。

所以，对于 HostComponent、ClassComponent 如果包含 `ref` 操作，那么也会赋值相应的 `effectTag`。

```javascript
// ...
export const Placement = /*                    */ 0b0000000000000010;
export const Update = /*                       */ 0b0000000000000100;
export const Deletion = /*                     */ 0b0000000000001000;
export const Ref = /*                          */ 0b0000000010000000;
// ...
```

### render 阶段

在 render 阶段的 `beginWork` 与 `completeWork` 中有个同名方法 `markRef` 用于为含有 `ref` 属性的 fiber 增加 `Ref` `effectTag`。

```javascript
// beginWork 的 markRef
function markRef(current: Fiber | null, workInProgress: Fiber) {
  const ref = workInProgress.ref;
  if (
    (current === null && ref !== null) ||
    (current !== null && current.ref !== ref)
  ) {
    // Schedule a Ref effect
    workInProgress.effectTag |= Ref;
  }
}

// completeWork 的 markRef
function markRef(workInProgress: Fiber) {
  workInProgress.effectTag |= Ref;
}
```

在 `beginWork` 中，如下两处调用了 `markRef`：

- `updateClassComponent` 内的 `finishClassComponent`，对应 ClassComponent
- `updateHostComponent`，对应 HostComponent

在 `completeWork` 中，如下两处调用了 `markRef`：

- `completeWork` 中的 HostComponent 类型
- `completeWork` 中的 ScopeComponent 类型

### commit 阶段

在 commit 阶段的 mutation 阶段中，对于 `ref` 属性改变的情况，需要先移除之前的 `ref`。

```javascript
function commitMutationEffects(root: FiberRoot, renderPriorityLevel) {
  while (nextEffect !== null) {

    const effectTag = nextEffect.effectTag;
    // ...

    if (effectTag & Ref) {
      const current = nextEffect.alternate;
      if (current !== null) {
        // 移除之前的 ref
        commitDetachRef(current);
      }
    }
    // ...
  }
  // ...
}

function commitDetachRef(current: Fiber) {
  const currentRef = current.ref;
  if (currentRef !== null) {
    if (typeof currentRef === 'function') {
      // function 类型 ref，调用它，传参为 null
      currentRef(null);
    } else {
      // 对象类型 ref，current 赋值为 null
      currentRef.current = null;
    }
  }
}
```

接下来，在 mutation 阶段，对于 `Deletion` `effectTag` 的 fiber（对应需要删除的 DOM 节点），需要递归它的子树，对子孙 fiber 的 `ref` 执行类似 `commitDetachRef` 的操作。

在 mutation 阶段一节我们讲到，对于 `Deletion` `effectTag` 的 fiber，会执行 `commitDeletion`。

在 `commitDeletion`——`unmountHostComponents`——`commitUnmount`——ClassComponent | HostComponent 类型 case 中调用的 `safelyDetachRef` 方法负责执行类似 `commitDetachRef` 的操作。

```javascript
function safelyDetachRef(current: Fiber) {
  const ref = current.ref;
  if (ref !== null) {
    if (typeof ref === 'function') {
      try {
        ref(null);
      } catch (refError) {
        captureCommitPhaseError(current, refError);
      }
    } else {
      ref.current = null;
    }
  }
}
```

接下来进入 `ref` 的赋值阶段。我们在 Layout 阶段一节讲到 `commitLayoutEffect` 会执行 `commitAttachRef`（赋值 `ref`）。

```javascript
function commitAttachRef(finishedWork: Fiber) {
  const ref = finishedWork.ref;
  if (ref !== null) {
    // 获取 ref 属性对应的 Component 实例
    const instance = finishedWork.stateNode;
    let instanceToUse;
    switch (finishedWork.tag) {
      case HostComponent:
        instanceToUse = getPublicInstance(instance);
        break;
      default:
        instanceToUse = instance;
    }

    // 赋值 ref
    if (typeof ref === 'function') {
      ref(instanceToUse);
    } else {
      ref.current = instanceToUse;
    }
  }
}
```

至此，`ref` 的工作流程完毕。

### useMemo 与 useCallback 的实现

在了解其他 hook 的实现后，理解 `useMemo` 与 `useCallback` 的实现非常容易。

本节我们以 mount 与 update 两种情况分别讨论这两个 hook。

#### mount

```javascript
function mountMemo<T>(nextCreate: () => T, deps: Array<mixed> | void | null): T {
  // 创建并返回当前 hook
  const hook = mountWorkInProgressHook();
  const nextDeps = deps === undefined ? null : deps;
  // 计算 value
  const nextValue = nextCreate();
  // 将 value 与 deps 保存在 hook.memoizedState
  hook.memoizedState = [nextValue, nextDeps];
  return nextValue;
}

function mountCallback<T>(callback: T, deps: Array<mixed> | void | null): T {
  // 创建并返回当前 hook
  const hook = mountWorkInProgressHook();
  const nextDeps = deps === undefined ? null : deps;
  // 将 value 与 deps 保存在 hook.memoizedState
  hook.memoizedState = [callback, nextDeps];
  return callback;
}
```

可以看到，与 `mountCallback` 这两个唯一的区别是：

- `mountMemo` 会将回调函数（`nextCreate`）的执行结果作为 value 保存
- `mountCallback` 会将回调函数作为 value 保存

#### update

```javascript
function updateMemo<T>(nextCreate: () => T, deps: Array<mixed> | void | null): T {
  // 返回当前 hook
  const hook = updateWorkInProgressHook();
  const nextDeps = deps === undefined ? null : deps;
  const prevState = hook.memoizedState;

  if (prevState !== null) {
    if (nextDeps !== null) {
      const prevDeps: Array<mixed> | null = prevState[1];
      // 判断 update 前后 value 是否变化
      if (areHookInputsEqual(nextDeps, prevDeps)) {
        // 未变化
        return prevState[0];
      }
    }
  }
  // 变化，重新计算 value
  const nextValue = nextCreate();
  hook.memoizedState = [nextValue, nextDeps];
  return nextValue;
}

function updateCallback<T>(callback: T, deps: Array<mixed> | void | null): T {
  // 返回当前 hook
  const hook = updateWorkInProgressHook();
  const nextDeps = deps === undefined ? null : deps;
  const prevState = hook.memoizedState;

  if (prevState !== null) {
    if (nextDeps !== null) {
      const prevDeps: Array<mixed> | null = prevState[1];
      // 判断 update 前后 value 是否变化
      if (areHookInputsEqual(nextDeps, prevDeps)) {
        // 未变化
        return prevState[0];
      }
    }
  }

  // 变化，将新的 callback 作为 value
  hook.memoizedState = [callback, nextDeps];
  return callback;
}
```

可见，对于 update，这两个 hook 的唯一区别也是回调函数本身还是回调函数的执行结果作为 value。

### 总结

本节我们学习了 `useEffect`、`useRef`、`useMemo` 和 `useCallback` 的工作原理和实现。通过这些学习，我们对 Hooks 的内部机制有了更深入的理解。
