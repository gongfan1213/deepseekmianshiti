### React Commit 阶段：Mutation 阶段

终于到了执行 DOM 操作的 mutation 阶段。

### 概览

类似 before mutation 阶段，mutation 阶段也是遍历 `effectList`，执行函数。这里执行的是 `commitMutationEffects`。

```javascript
nextEffect = firstEffect;
do {
  try {
    commitMutationEffects(root, renderPriorityLevel);
  } catch (error) {
    invariant(nextEffect !== null, 'Should be working on an effect.');
    captureCommitPhaseError(nextEffect, error);
    nextEffect = nextEffect.nextEffect;
  }
} while (nextEffect !== null);
```

### commitMutationEffects

代码如下：

```javascript
function commitMutationEffects(root: FiberRoot, renderPriorityLevel) {
  // 遍历 effectList
  while (nextEffect !== null) {

    const effectTag = nextEffect.effectTag;

    // 根据 ContentReset effectTag 重置文字节点
    if (effectTag & ContentReset) {
      commitResetTextContent(nextEffect);
    }

    // 更新 ref
    if (effectTag & Ref) {
      const current = nextEffect.alternate;
      if (current !== null) {
        commitDetachRef(current);
      }
    }

    // 根据 effectTag 分别处理
    const primaryEffectTag =
      effectTag & (Placement | Update | Deletion | Hydrating);
    switch (primaryEffectTag) {
      // 插入 DOM
      case Placement: {
        commitPlacement(nextEffect);
        nextEffect.effectTag &= ~Placement;
        break;
      }
      // 插入 DOM 并 更新 DOM
      case PlacementAndUpdate: {
        // 插入
        commitPlacement(nextEffect);

        nextEffect.effectTag &= ~Placement;

        // 更新
        const current = nextEffect.alternate;
        commitWork(current, nextEffect);
        break;
      }
      // SSR
      case Hydrating: {
        nextEffect.effectTag &= ~Hydrating;
        break;
      }
      // SSR
      case HydratingAndUpdate: {
        nextEffect.effectTag &= ~Hydrating;

        const current = nextEffect.alternate;
        commitWork(current, nextEffect);
        break;
      }
      // 更新 DOM
      case Update: {
        const current = nextEffect.alternate;
        commitWork(current, nextEffect);
        break;
      }
      // 删除 DOM
      case Deletion: {
        commitDeletion(root, nextEffect, renderPriorityLevel);
        break;
      }
    }

    nextEffect = nextEffect.nextEffect;
  }
}
```

`commitMutationEffects` 会遍历 `effectList`，对每个 Fiber 节点执行如下三个操作：

1. 根据 `ContentReset` effectTag 重置文字节点
2. 更新 ref
3. 根据 `effectTag` 分别处理，其中 `effectTag` 包括 (Placement | Update | Deletion | Hydrating)

我们关注步骤三中的 Placement | Update | Deletion。Hydrating 作为服务端渲染相关，我们先不关注。

### Placement effect

当 Fiber 节点含有 Placement effectTag，意味着该 Fiber 节点对应的 DOM 节点需要插入到页面中。

调用的方法为 `commitPlacement`。

该方法所做的工作分为三步：

1. 获取父级 DOM 节点。其中 `finishedWork` 为传入的 Fiber 节点。

```javascript
const parentFiber = getHostParentFiber(finishedWork);
// 父级 DOM 节点
const parentStateNode = parentFiber.stateNode;
```

2. 获取 Fiber 节点的 DOM 兄弟节点

```javascript
const before = getHostSibling(finishedWork);
```

3. 根据 DOM 兄弟节点是否存在决定调用 `parentNode.insertBefore` 或 `parentNode.appendChild` 执行 DOM 插入操作。

```javascript
// parentStateNode 是否是 rootFiber
if (isContainer) {
  insertOrAppendPlacementNodeIntoContainer(finishedWork, before, parent);
} else {
  insertOrAppendPlacementNode(finishedWork, before, parent);
}
```

值得注意的是，`getHostSibling`（获取兄弟 DOM 节点）的执行很耗时，当在同一个父 Fiber 节点下依次执行多个插入操作，`getHostSibling` 算法的复杂度为指数级。

这是由于 Fiber 节点不只包括 HostComponent，所以 Fiber 树和渲染的 DOM 树节点并不是一一对应的。要从 Fiber 节点找到 DOM 节点很可能跨层级遍历。

考虑如下例子：

```javascript
function Item() {
  return <li></li>;
}

function App() {
  return (
    <div>
      <Item />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
```

对应的 Fiber 树和 DOM 树结构为：

```plaintext
// Fiber 树
          child      child      child       child
rootFiber -----> App -----> div -----> Item -----> li

// DOM 树
#root ---> div ---> li
```

当在 `div` 的子节点 `Item` 前插入一个新节点 `p`，即 `App` 变为：

```javascript
function App() {
  return (
    <div>
      <p></p>
      <Item />
    </div>
  );
}
```

对应的 Fiber 树和 DOM 树结构为：

```plaintext
// Fiber 树
          child      child      child
rootFiber -----> App -----> div -----> p 
                                       | sibling       child
                                       | -------> Item -----> li 
// DOM 树
#root ---> div ---> p
             |
               ---> li
```

此时 DOM 节点 `p` 的兄弟节点为 `li`，而 Fiber 节点 `p` 对应的兄弟 DOM 节点为：

```plaintext
fiberP.sibling.child
```

即 fiber `p` 的兄弟 fiber `Item` 的子 fiber `li`。

### Update effect

当 Fiber 节点含有 Update effectTag，意味着该 Fiber 节点需要更新。调用的方法为 `commitWork`，它会根据 Fiber.tag 分别处理。

这里我们主要关注 FunctionComponent 和 HostComponent。

#### FunctionComponent mutation

当 fiber.tag 为 FunctionComponent，会调用 `commitHookEffectListUnmount`。该方法会遍历 `effectList`，执行所有 `useLayoutEffect` hook 的销毁函数。

所谓“销毁函数”，见如下例子：

```javascript
useLayoutEffect(() => {
  // ...一些副作用逻辑

  return () => {
    // ...这就是销毁函数
  };
});
```

你不需要很了解 `useLayoutEffect`，我们会在下一节详细介绍。你只需要知道在 mutation 阶段会执行 `useLayoutEffect` 的销毁函数。

#### HostComponent mutation

当 fiber.tag 为 HostComponent，会调用 `commitUpdate`。

最终会在 `updateDOMProperties` 中将 render 阶段 `completeWork` 中为 Fiber 节点赋值的 `updateQueue` 对应的内容渲染在页面上。

```javascript
for (let i = 0; i < updatePayload.length; i += 2) {
  const propKey = updatePayload[i];
  const propValue = updatePayload[i + 1];

  // 处理 style
  if (propKey === STYLE) {
    setValueForStyles(domElement, propValue);
  // 处理 DANGEROUSLY_SET_INNER_HTML
  } else if (propKey === DANGEROUSLY_SET_INNER_HTML) {
    setInnerHTML(domElement, propValue);
  // 处理 children
  } else if (propKey === CHILDREN) {
    setTextContent(domElement, propValue);
  } else {
  // 处理剩余 props
    setValueForProperty(domElement, propKey, propValue, isCustomComponentTag);
  }
}
```

### Deletion effect

当 Fiber 节点含有 Deletion effectTag，意味着该 Fiber 节点对应的 DOM 节点需要从页面中删除。调用的方法为 `commitDeletion`。

该方法会执行如下操作：

1. 递归调用 Fiber 节点及其子孙 Fiber 节点中 fiber.tag 为 ClassComponent 的 `componentWillUnmount` 生命周期钩子，从页面移除 Fiber 节点对应 DOM 节点
2. 解绑 ref
3. 调度 `useEffect` 的销毁函数

### 总结

从这节我们学到，mutation 阶段会遍历 `effectList`，依次执行 `commitMutationEffects`。该方法的主要工作为“根据 `effectTag` 调用不同的处理函数处理 Fiber”。
