### Fiber树的构建与替换过程


在React中，Fiber树的构建与替换过程是通过“双缓存”技术实现的。这个过程伴随着DOM的更新。下面我们详细讲解这个过程。

#### 什么是“双缓存”

双缓存是一种在内存中构建并直接替换的技术，用于避免在绘制动画或更新DOM时出现闪烁或白屏的情况。

- **Canvas绘制动画**：在每一帧绘制前调用`ctx.clearRect`清除上一帧的画面。如果当前帧画面计算量较大，清除上一帧画面到绘制当前帧画面之间有较长间隙，就会出现白屏。通过在内存中绘制当前帧动画，绘制完毕后直接替换上一帧画面，可以避免白屏。
- **React中的双缓存**：React使用双缓存技术来完成Fiber树的构建与替换，对应着DOM树的创建与更新。

#### 双缓存 Fiber 树

在React中，最多会同时存在两棵Fiber树：

- **current Fiber树**：当前屏幕上显示内容对应的Fiber树。
- **workInProgress Fiber树**：正在内存中构建的Fiber树。

这两棵树通过`alternate`属性连接：

```javascript
currentFiber.alternate === workInProgressFiber;
workInProgressFiber.alternate === currentFiber;
```

React应用的根节点通过使`current`指针在不同Fiber树的`rootFiber`间切换来完成`current Fiber树`指向的切换。

#### mount 时

考虑如下例子：

```javascript
function App() {
  const [num, add] = useState(0);
  return <p onClick={() => add(num + 1)}>{num}</p>;
}

ReactDOM.render(<App />, document.getElementById("root"));
```

首次执行`ReactDOM.render`会创建`fiberRootNode`和`rootFiber`。其中`fiberRootNode`是整个应用的根节点，`rootFiber`是`<App />`所在组件树的根节点。

- `fiberRootNode`的`current`会指向当前页面上已渲染内容对应的Fiber树，即`current Fiber树`。
- 由于是首屏渲染，页面中还没有挂载任何DOM，所以`fiberRootNode.current`指向的`rootFiber`没有任何子Fiber节点（即`current Fiber树`为空）。
<img width="404" alt="image" src="https://github.com/user-attachments/assets/31bcf13f-1c46-442e-b713-23b80082cdd7" />

接下来进入`render`阶段，根据组件返回的JSX在内存中依次创建Fiber节点并连接在一起构建Fiber树，被称为`workInProgress Fiber树`。

在构建`workInProgress Fiber树`时会尝试复用`current Fiber树`中已有的Fiber节点内的属性，在首屏渲染时只有`rootFiber`存在对应的`current fiber`（即`rootFiber.alternate`）。
<img width="410" alt="image" src="https://github.com/user-attachments/assets/96cc7405-b4db-424b-a08c-ca71773a3102" />

图中右侧已构建完的`workInProgress Fiber树`在`commit`阶段渲染到页面。此时DOM更新为右侧树对应的样子。`fiberRootNode`的`current`指针指向`workInProgress Fiber树`使其变为`current Fiber 树`。
<img width="436" alt="image" src="https://github.com/user-attachments/assets/45cbc68f-0834-4577-839b-d6a38d22904c" />

#### update 时

接下来我们点击`p`节点触发状态改变，这会开启一次新的`render`阶段并构建一棵新的`workInProgress Fiber 树`。
<img width="442" alt="image" src="https://github.com/user-attachments/assets/8fffc3ae-af1f-431b-961c-8d1e7fb0d7b2" />

和`mount`时一样，`workInProgress fiber`的创建可以复用`current Fiber树`对应的节点数据。

这个决定是否复用的过程就是Diff算法，后面章节会详细讲解。

`workInProgress Fiber 树`在`render`阶段完成构建后进入`commit`阶段渲染到页面上。渲染完毕后，`workInProgress Fiber 树`变为`current Fiber 树`。
<img width="378" alt="image" src="https://github.com/user-attachments/assets/23043e77-7d71-44b0-b2c0-6c9f146c496b" />
<img width="375" alt="image" src="https://github.com/user-attachments/assets/4df4a836-ac06-4435-9831-506e3d1b9fe5" />

### 总结

本文介绍了Fiber树的构建与替换过程，这个过程伴随着DOM的更新。通过双缓存技术，React能够在内存中构建新的Fiber树，并在完成后直接替换当前的Fiber树，从而实现高效的DOM更新。

### 参考资料

- [Lin Clark - A Cartoon Intro to Fiber - React Conf 2017](https://www.youtube.com/watch?v=ZCuYPiUIONs)

通过本节的学习，我们了解了Fiber树的构建与替换过程。接下来，我们将深入探讨在构建过程中每个Fiber节点具体是如何创建的。
通过本章的学习，我们了解了 React 的 **Scheduler-Reconciler-Renderer** 架构体系。在结束本章前，我想介绍几个源码中的术语：

1. **Render 阶段（渲染阶段）**：
   - 这是 **Reconciler** 工作的阶段。
   - 在此阶段，React 会调用组件的 `render` 方法，计算新的虚拟 DOM 树。
   - 该阶段的主要任务是找出需要更新的组件以及如何更新。

2. **Commit 阶段（提交阶段）**：
   - 这是 **Renderer** 工作的阶段。
   - 类似于完成编码后执行 `git commit` 提交代码，Commit 阶段会将 Render 阶段生成的更新实际渲染到页面上。
   - 该阶段将更新应用到真实的 DOM 上，执行副作用（如 DOM 操作、调用生命周期方法等）。

3. **Work（工作）**：
   - **Render 阶段**和**Commit 阶段**统称为 **Work**，即 React 正在执行工作的阶段。
   - 如果任务正在 **Scheduler** 中调度，则不属于 Work 阶段。
   - Work 阶段表示 React 正在处理更新任务，而调度阶段则负责安排任务的优先级和执行顺序。

在接下来的架构篇中，我们会分别讲解 **Reconciler** 和 **Renderer** 的工作流程，因此章节名称分别为 **Render 阶段** 和 **Commit 阶段**。
