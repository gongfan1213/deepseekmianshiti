### Hooks 的工作原理

在开始本章学习前，你需要了解 Hooks 的基本用法。如果你还未使用过 Hooks，可以从 [官方文档](https://reactjs.org/docs/hooks-intro.html) 开始。

你可以从 [这里](https://reactjs.org/docs/hooks-intro.html#motivation) 了解 Hooks 的设计动机。作为一名框架使用者，了解设计动机对于我们日常开发就足够了。

但是，为了更好地理解 Hooks 的源码架构，我们需要转换身份，以框架开发者的角度来看待 Hooks 的设计理念。

### 从 LOGO 聊起

React LOGO 的图案是代表原子（atom）的符号。世间万物由原子组成，原子的类型与属性决定了事物的外观与表现。

同样，在 React 中，我们可以将 UI 拆分为很多独立的单元，每个单元被称为 Component。这些 Component 的属性与类型决定了 UI 的外观与表现。

讽刺的是，原子在希腊语中的意思为不可分割的（indivisible），但随后科学家在原子中发现了更小的粒子 —— 电子（electron）。电子可以很好地解释原子是如何工作的。

在 React 中，我们可以说 ClassComponent 是一类原子。但对于 Hooks 来说，与其说是一类原子，不如说它是更贴近事物运行规律的电子。

我们知道，React 的架构遵循 schedule - render - commit 的运行流程，这个流程是 React 世界最底层的运行规律。

ClassComponent 作为 React 世界的原子，它的生命周期（componentWillXXX/componentDidXXX）是为了介入 React 的运行流程而实现的更上层抽象，这么做是为了方便框架使用者更容易上手。

相比于 ClassComponent 的更上层抽象，Hooks 则更贴近 React 内部运行的各种概念（state | context | life-cycle）。

作为使用 React 技术栈的开发者，当我们初次学习 Hooks 时，不管是官方文档还是身边有经验的同事，总会拿 ClassComponent 的生命周期来类比 Hooks API 的执行时机。

这固然是很好的上手方式，但是当我们熟练运用 Hooks 时，就会发现，这两者的概念有很多割裂感，并不是同一抽象层次可以互相替代的概念。

比如：替代 componentWillReceiveProps 的 Hooks 是什么呢？

可能有些同学会回答，是 useEffect：

```javascript
useEffect(() => {
  console.log('something updated');
}, [props.something]);
```

但是 componentWillReceiveProps 是在 render 阶段执行，而 useEffect 是在 commit 阶段完成渲染后异步执行。

所以，从源码运行规律的角度看待 Hooks，可能是更好的角度。这也是为什么上文说 Hooks 是 React 世界的电子而不是原子的原因。

### 总结

Concurrent Mode 是 React 未来的发展方向，而 Hooks 是能够最大限度发挥 Concurrent Mode 潜力的 Component 构建方式。

正如 Dan 在 React Conf 2018 演讲结尾所说：你可以从 React 的 LOGO 中看到这些围绕着核心的电子飞行轨道，Hooks 可能一直就在其中。

为了更好理解 Hooks 原理，这一节我们遵循 React 的运行流程，实现一个不到 100 行代码的极简 useState Hook。建议对照着代码来看本节内容。

### 工作原理

对于 useState Hook，考虑如下例子：

```javascript
function App() {
  const [num, updateNum] = useState(0);

  return <p onClick={() => updateNum((num) => num + 1)}>{num}</p>;
}
```

可以将工作分为两部分：

1. 通过一些途径产生更新，更新会造成组件 render。
2. 组件 render 时 useState 返回的 num 为更新后的结果。

其中步骤 1 的更新可以分为 mount 和 update：

- 调用 `ReactDOM.render` 会产生 mount 的更新，更新内容为 useState 的 initialValue（即 0）。
- 点击 p 标签触发 updateNum 会产生一次 update 的更新，更新内容为 `num => num + 1`。

接下来讲解这两个步骤如何实现。

### 更新是什么

通过一些途径产生更新，更新会造成组件 render。首先我们要明确更新是什么。

在我们的极简例子中，更新就是如下数据结构：

```javascript
const update = {
  // 更新执行的函数
  action,
  // 与同一个 Hook 的其他更新形成链表
  next: null,
};
```

对于 App 来说，点击 p 标签产生的 update 的 action 为 `num => num + 1`。

如果我们改写下 App 的 onClick：

```javascript
// 之前
return <p onClick={() => updateNum((num) => num + 1)}>{num}</p>;

// 之后
return (
  <p
    onClick={() => {
      updateNum((num) => num + 1);
      updateNum((num) => num + 1);
      updateNum((num) => num + 1);
    }}
  >
    {num}
  </p>
);
```

那么点击 p 标签会产生三个 update。

### update 数据结构

这些 update 是如何组合在一起呢？

答案是：它们会形成环状单向链表。

调用 updateNum 实际调用的是 `dispatchAction.bind(null, hook.queue)`，我们先来了解下这个函数：

```javascript
function dispatchAction(queue, action) {
  // 创建 update
  const update = {
    action,
    next: null,
  };

  // 环状单向链表操作
  if (queue.pending === null) {
    update.next = update;
  } else {
    update.next = queue.pending.next;
    queue.pending.next = update;
  }
  queue.pending = update;

  // 模拟 React 开始调度更新
  schedule();
}
```

环状链表操作不太容易理解，这里我们详细讲解下。

当产生第一个 update（我们叫他 u0），此时 `queue.pending === null`。

`update.next = update;` 即 `u0.next = u0`，它会和自己首尾相连形成单向环状链表。

然后 `queue.pending = update;` 即 `queue.pending = u0`

```plaintext
queue.pending = u0 ---> u0
                ^       |
                |       |
                ---------
```

当产生第二个 update（我们叫他 u1），`update.next = queue.pending.next;`，此时 `queue.pending.next === u0`，即 `u1.next = u0`。

`queue.pending.next = update;`，即 `u0.next = u1`。

然后 `queue.pending = update;` 即 `queue.pending = u1`

```plaintext
queue.pending = u1 ---> u0
                ^       |
                |       |
                ---------
```

你可以照着这个例子模拟插入多个 update 的情况，会发现 `queue.pending` 始终指向最后一个插入的 update。

这样做的好处是，当我们要遍历 update 时，`queue.pending.next` 指向第一个插入的 update。

### 状态如何保存

现在我们知道，更新产生的 update 对象会保存在 queue 中。

不同于 ClassComponent 的实例可以存储数据，对于 FunctionComponent，queue 存储在哪里呢？

答案是：FunctionComponent 对应的 fiber 中。

我们使用如下精简的 fiber 结构：

```javascript
// App 组件对应的 fiber 对象
const fiber = {
  // 保存该 FunctionComponent 对应的 Hooks 链表
  memoizedState: null,
  // 指向 App 函数
  stateNode: App,
};
```

### Hook 数据结构

接下来我们关注 `fiber.memoizedState` 中保存的 Hook 的数据结构。

可以看到，Hook 与 update 类似，都通过链表连接。不过 Hook 是无环的单向链表。

```javascript
hook = {
  // 保存 update 的 queue，即上文介绍的 queue
  queue: {
    pending: null,
  },
  // 保存 hook 对应的 state
  memoizedState: initialState,
  // 与下一个 Hook 连接形成单向无环链表
  next: null,
};
```

### 模拟 React 调度更新流程

在上文 `dispatchAction` 末尾我们通过 `schedule` 方法模拟 React 调度更新流程。

```javascript
function dispatchAction(queue, action) {
  // ...创建 update

  // ...环状单向链表操作

  // 模拟 React 开始调度更新
  schedule();
}
```

现在我们来实现它。

我们用 `isMount` 变量指代是 mount 还是 update。

```javascript
// 首次 render 时是 mount
isMount = true;

function schedule() {
  // 更新前将 workInProgressHook 重置为 fiber 保存的第一个 Hook
  workInProgressHook = fiber.memoizedState;
  // 触发组件 render
  fiber.stateNode();
  // 组件首次 render 为 mount，以后再触发的更新为 update
  isMount = false;
}
```

通过 `workInProgressHook` 变量指向当前正在工作的 hook。

```javascript
workInProgressHook = fiber.memoizedState;
```

在组件 render 时，每当遇到下一个 useState，我们移动 `workInProgressHook` 的指针。

```javascript
workInProgressHook = workInProgressHook.next;
```

这样，只要每次组件 render 时 useState 的调用顺序及数量保持一致，那么始终可以通过 `workInProgressHook` 找到当前 useState 对应的 hook 对象。

### 计算 state

组件 render 时会调用 useState，它的大体逻辑如下：

```javascript
function useState(initialState) {
  // 当前 useState 使用的 hook 会被赋值该变量
  let hook;

  if (isMount) {
    // ...mount 时需要生成 hook 对象
  } else {
    // ...update 时从 workInProgressHook 中取出该 useState 对应的 hook
  }

  let baseState = hook.memoizedState;
  if (hook.queue.pending) {
    // ...根据 queue.pending 中保存的 update 更新 state
  }
  hook.memoizedState = baseState;

  return [baseState, dispatchAction.bind(null, hook.queue)];
}
```

我们首先关注如何获取 hook 对象：

```javascript
if (isMount) {
  // mount 时为该 useState 生成 hook
  hook = {
    queue: {
      pending: null,
    },
    memoizedState: initialState,
    next: null,
  };

  // 将 hook 插入 fiber.memoizedState 链表末尾
  if (!fiber.memoizedState) {
    fiber.memoizedState = hook;
  } else {
    workInProgressHook.next = hook;
  }
  // 移动 workInProgressHook 指针
  workInProgressHook = hook;
} else {
  // update 时找到对应 hook
  hook = workInProgressHook;
  // 移动 workInProgressHook 指针
  workInProgressHook = workInProgressHook.next;
}
```

当找到该 useState 对应的 hook 后，如果该 `hook.queue.pending` 不为空（即存在 update），则更新其 state。

```javascript
// update 执行前的初始 state
let baseState = hook.memoizedState;

if (hook.queue.pending) {
  // 获取 update 环状单向链表中第一个 update
  let firstUpdate = hook.queue.pending.next;

  do {
    // 执行 update action
    const action = firstUpdate.action;
    baseState = action(baseState);
    firstUpdate = firstUpdate.next;

    // 最后一个 update 执行完后跳出循环
  } while (firstUpdate !== hook.queue.pending.next);

  // 清空 queue.pending
  hook.queue.pending = null;
}

// 将 update action 执行完后的 state 作为 memoizedState
hook.memoizedState = baseState;
```

### 完整代码

```javascript
function useState(initialState) {
  let hook;

  if (isMount) {
    hook = {
      queue: {
        pending: null,
      },
      memoizedState: initialState,
      next: null,
    };
    if (!fiber.memoizedState) {
      fiber.memoizedState = hook;
    } else {
      workInProgressHook.next = hook;
    }
    workInProgressHook = hook;
  } else {
    hook = workInProgressHook;
    workInProgressHook = workInProgressHook.next;
  }

  let baseState = hook.memoizedState;
  if (hook.queue.pending) {
    let firstUpdate = hook.queue.pending.next;

    do {
      const action = firstUpdate.action;
      baseState = action(baseState);
      firstUpdate = firstUpdate.next;
    } while (firstUpdate !== hook.queue.pending.next);

    hook.queue.pending = null;
  }
  hook.memoizedState = baseState;

  return [baseState, dispatchAction.bind(null, hook.queue)];
}
```

### 对触发事件进行抽象

最后，让我们抽象一下 React 的事件触发方式。通过调用 App 返回的 click 方法模拟组件 click 的行为。

```javascript
function App() {
  const [num, updateNum] = useState(0);

  console.log(`${isMount ? "mount" : "update"} num: `, num);

  return {
    click() {
      updateNum((num) => num + 1);
    },
  };
}
```

### 在线 Demo

至此，我们完成了一个不到 100 行代码的 Hooks。重要的是，它与 React 的运行逻辑相同。

### 与 React 的区别

我们用尽可能少的代码模拟了 Hooks 的运行，但是相比 React Hooks，它还有很多不足。以下是它与 React Hooks 的区别：

1. React Hooks 没有使用 `isMount` 变量，而是在不同时机使用不同的 dispatcher。换言之，mount 时的 useState 与 update 时的 useState 不是同一个函数。
2. React Hooks 有中途跳过更新的优化手段。
3. React Hooks 有 batchedUpdates，当在 click 中触发三次 updateNum，精简 React 会触发三次更新，而 React 只会触发一次。
4. React Hooks 的 update 有优先级概念，可以跳过不高优先的 update。

更多的细节，我们会在本章后续小节讲解。
