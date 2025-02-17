# 本章为选读章节

*是否学习该章对后续章节的学习没有影响。*

在 **beginWork** 一节我们提到，对于更新的组件，它会将当前组件与该组件在上次更新时对应的 Fiber 节点比较（也就是俗称的 **Diff 算法**），将比较的结果生成新的 Fiber 节点。本章我们将讲解 Diff 算法的实现。

您可以从[这里](#)看到 Diff 算法的介绍。

为了防止概念混淆，这里再强调一下：

一个 DOM 节点在某一时刻最多会有 **4 个节点** 和它相关：

1. **current Fiber**：如果该 DOM 节点已在页面中，current Fiber 代表该 DOM 节点对应的 Fiber 节点。

2. **workInProgress Fiber**：如果该 DOM 节点将在本次更新中渲染到页面中，workInProgress Fiber 代表该 DOM 节点对应的 Fiber 节点。

3. **DOM 节点** 本身。

4. **JSX 对象**：即 ClassComponent 的 `render` 方法的返回结果，或 FunctionComponent 的调用结果。JSX 对象中包含描述 DOM 节点的信息。

**Diff 算法的本质** 是对比 **1** 和 **4**，生成 **2**。

---

## Diff 的瓶颈以及 React 如何应对

由于 Diff 操作本身也会带来性能损耗，React 文档中提到，即使在最前沿的算法中，将前后两棵树完全比对的算法的复杂程度为 **O(n³)**，其中 **n** 是树中元素的数量。如果在 React 中使用了该算法，那么展示 1000 个元素所需要执行的计算量将在十亿的量级范围。这个开销实在是太过高昂。

**为了降低算法复杂度，React 的 Diff 会预设三个限制：**

1. **只对同级元素进行 Diff**：如果一个 DOM 节点在前后两次更新中跨越了层级，那么 React 不会尝试复用它。

2. **两个不同类型的元素会产生出不同的树**：如果元素由 `<div>` 变为 `<p>`，React 会销毁 `<div>` 及其子孙节点，并新建 `<p>` 及其子孙节点。

3. **开发者可以通过 `key` 属性来暗示哪些子元素在不同的渲染下能保持稳定**。

   考虑如下例子：

   ```jsx
   // 更新前
   <div>
     <p key="ka">ka</p>
     <h3 key="song">song</h3>
   </div>

   // 更新后
   <div>
     <h3 key="song">song</h3>
     <p key="ka">ka</p>
   </div>
   ```

   如果没有 `key`，React 会认为 `<div>` 的第一个子节点由 `<p>` 变为 `<h3>`，第二个子节点由 `<h3>` 变为 `<p>`。这符合限制 2 的设定，会销毁并新建。

   但是当我们用 `key` 指明了节点前后对应关系后，React 知道 `key === "ka"` 的 `<p>` 在更新后还存在，所以 DOM 节点可以复用，只是需要交换一下顺序。

这就是 React 为了应对算法性能瓶颈做出的三条限制。

---

## Diff 是如何实现的

我们从 Diff 的入口函数 `reconcileChildFibers` 出发，该函数会根据 `newChild`（即 JSX 对象）类型调用不同的处理函数。您可以从[这里](#)看到 `reconcileChildFibers` 的源码。

```javascript
// 根据 newChild 类型选择不同 diff 函数处理
function reconcileChildFibers(
  returnFiber: Fiber,
  currentFirstChild: Fiber | null,
  newChild: any,
): Fiber | null {

  const isObject = typeof newChild === 'object' && newChild !== null;

  if (isObject) {
    // object 类型，可能是 REACT_ELEMENT_TYPE 或 REACT_PORTAL_TYPE
    switch (newChild.$$typeof) {
      case REACT_ELEMENT_TYPE:
        // 调用 reconcileSingleElement 处理
        // ...省略其他 case
    }
  }

  if (typeof newChild === 'string' || typeof newChild === 'number') {
    // 调用 reconcileSingleTextNode 处理
    // ...省略
  }

  if (isArray(newChild)) {
    // 调用 reconcileChildrenArray 处理
    // ...省略
  }

  // 一些其他情况调用处理函数
  // ...省略

  // 以上都没有命中，删除节点
  return deleteRemainingChildren(returnFiber, currentFirstChild);
}
```

我们可以根据同级的节点数量将 Diff 分为两类：

1. **同级只有一个节点**：当 `newChild` 类型为 `object`、`number`、`string`，代表同级只有一个节点。

2. **同级有多个节点**：当 `newChild` 类型为 `Array`，同级有多个节点。

在接下来的两节中，我们将分别讨论这两类节点的 Diff。

---

*（接下来的内容将在后续章节中详细介绍。）*
