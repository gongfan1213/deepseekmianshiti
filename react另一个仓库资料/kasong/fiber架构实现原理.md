### Fiber的起源与架构

#### Fiber的起源

在React15及以前，Reconciler采用递归的方式创建虚拟DOM，递归过程是不能中断的。如果组件树的层级很深，递归会占用线程很多时间，造成卡顿。为了解决这个问题，React16将递归的无法中断的更新重构为异步的可中断更新，由于曾经用于递归的虚拟DOM数据结构已经无法满足需要。于是，全新的Fiber架构应运而生。

#### Fiber的含义

Fiber包含三层含义：

1. **作为架构**：React15的Reconciler采用递归的方式执行，数据保存在递归调用栈中，所以被称为stack Reconciler。React16的Reconciler基于Fiber节点实现，被称为Fiber Reconciler。
2. **作为静态的数据结构**：每个Fiber节点对应一个React element，保存了该组件的类型（函数组件/类组件/原生组件等）、对应的DOM节点等信息。
3. **作为动态的工作单元**：每个Fiber节点保存了本次更新中该组件改变的状态、要执行的工作（需要被删除/被插入页面中/被更新等）。

#### Fiber的结构

Fiber节点的属性定义可以按三层含义分类来看：

```javascript
function FiberNode(
  tag: WorkTag,
  pendingProps: mixed,
  key: null | string,
  mode: TypeOfMode,
) {
  // 作为静态数据结构的属性
  this.tag = tag;
  this.key = key;
  this.elementType = null;
  this.type = null;
  this.stateNode = null;

  // 用于连接其他Fiber节点形成Fiber树
  this.return = null;
  this.child = null;
  this.sibling = null;
  this.index = 0;

  this.ref = null;

  // 作为动态的工作单元的属性
  this.pendingProps = pendingProps;
  this.memoizedProps = null;
  this.updateQueue = null;
  this.memoizedState = null;
  this.dependencies = null;

  this.mode = mode;

  this.effectTag = NoEffect;
  this.nextEffect = null;

  this.firstEffect = null;
  this.lastEffect = null;

  // 调度优先级相关
  this.lanes = NoLanes;
  this.childLanes = NoLanes;

  // 指向该fiber在另一次更新时对应的fiber
  this.alternate = null;
}
```

##### 作为架构

每个Fiber节点有个对应的React element，多个Fiber节点通过以下三个属性连接形成树：

- `this.return`：指向父级Fiber节点。
- `this.child`：指向子Fiber节点。
- `this.sibling`：指向右边第一个兄弟Fiber节点。

例如，以下组件结构：

```javascript
function App() {
  return (
    <div>
      i am
      <span>KaSong</span>
    </div>
  )
}
```

对应的Fiber树结构如下图所示：
- 这里需要提一下，为什么父级指针叫做return而不是parent或者father呢？因为作为一个工作单元，return指节点执行完completeWork（本章后面会介绍）后会返回的下一个节点。子Fiber节点及其兄弟节点完成工作后会返回其父级节点，所以用return指代父级节点。




<img width="410" alt="image" src="https://github.com/user-attachments/assets/667a8643-53e6-49b7-807d-c48febdbde91" />

![Fiber架构](https://user-images.githubusercontent.com/316198/828710-828710.png)

##### 作为静态的数据结构

作为一种静态的数据结构，Fiber节点保存了组件相关的信息：

- `this.tag`：Fiber对应组件的类型（Function/Class/Host等）。
- `this.key`：key属性。
- `this.elementType`：大部分情况同type，某些情况不同，比如FunctionComponent使用React.memo包裹。
- `this.type`：对于FunctionComponent，指函数本身；对于ClassComponent，指class；对于HostComponent，指DOM节点tagName。
- `this.stateNode`：Fiber对应的真实DOM节点。

##### 作为动态的工作单元

作为动态的工作单元，Fiber节点保存了本次更新相关的信息：

- `this.pendingProps`：保存本次更新造成的状态改变相关信息。
- `this.memoizedProps`：上一次渲染的props。
- `this.updateQueue`：更新队列。
- `this.memoizedState`：上一次渲染的state。
- `this.dependencies`：依赖项。
- `this.effectTag`：保存本次更新会造成的DOM操作。
- `this.nextEffect`：下一个副作用。
- `this.firstEffect`：第一个副作用。
- `this.lastEffect`：最后一个副作用。

调度优先级相关的信息：

- `this.lanes`：调度优先级相关。
- `this.childLanes`：子节点的调度优先级相关。

注意：在2020年5月，调度优先级策略经历了比较大的重构。以`expirationTime`属性为代表的优先级模型被`lane`取代。

### 总结

通过本节我们了解了Fiber的起源与架构，其中Fiber节点可以构成Fiber树。那么Fiber树和页面呈现的DOM树有什么关系，React又是如何更新DOM的呢？我们会在下一节讲解。

### 参考资料

- [Lin Clark - A Cartoon Intro to Fiber - React Conf 2017](https://www.youtube.com/watch?v=ZCuYPiUIONs)

通过本节的学习，我们了解了Fiber的起源、含义和结构。接下来，我们将深入探讨Fiber树和页面呈现的DOM树之间的关系，以及React是如何更新DOM的。
