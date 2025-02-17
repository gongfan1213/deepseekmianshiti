![image](https://github.com/user-attachments/assets/a8145582-a0d6-445f-9200-0ed21ddb8930)
在前面的讨论中，我们深入了解了React在渲染阶段的`beginWork`和`completeWork`两个核心函数。`beginWork`主要负责根据组件类型生成相应的Fiber子节点，而`completeWork`则是在“归”阶段完成对Fiber节点的处理，包括生成或更新对应的DOM节点，以及管理副作用（effects）。

**`completeWork`函数的主要工作：**

1. **处理不同类型的Fiber节点：**
   `completeWork`根据`fiber.tag`的不同，采取不同的处理逻辑。对于大多数组件类型，如函数组件、类组件、Fragment等，`completeWork`可能只是返回`null`，因为它们不需要直接处理DOM节点。

2. **重点关注`HostComponent`：**
   对于`HostComponent`（对应原生DOM节点的Fiber），`completeWork`需要根据是**初次渲染（mount）**还是**更新（update）**，采取不同的操作。

---

### **更新（Update）时的处理：**

- **无需创建新的DOM节点：** 因为在更新阶段，DOM节点已经存在于`workInProgress.stateNode`中。
- **处理属性变化：**
  - 事件处理函数的更新（如`onClick`、`onChange`）。
  - 样式更新（`style`属性）。
  - 处理`dangerouslySetInnerHTML`属性。
  - 更新子节点（`children`）。

调用`updateHostComponent`函数来比较新旧属性，生成`updatePayload`，并将其存储在`workInProgress.updateQueue`中，供提交阶段（commit phase）使用。

**示例：**

```javascript
if (current !== null && workInProgress.stateNode != null) {
  // 更新逻辑
  updateHostComponent(
    current,
    workInProgress,
    type,
    newProps,
    rootContainerInstance
  );
}
```

---

### **初次渲染（Mount）时的处理：**

- **创建新的DOM节点：** 使用`createInstance`函数，根据类型和新属性生成对应的DOM节点，并赋值给`workInProgress.stateNode`。
- **递归插入子节点：** 通过`appendAllChildren`函数，将所有子孙DOM节点插入到刚创建的DOM节点中。
- **处理初始属性：** 调用`finalizeInitialChildren`来处理初始属性设置，如果需要更新，则标记`effectTag`为`Update`。

**示例：**

```javascript
// 初次渲染逻辑
const instance = createInstance(
  type,
  newProps,
  rootContainerInstance,
  currentHostContext,
  workInProgress
);

// 插入子节点
appendAllChildren(instance, workInProgress, false, false);

// 将DOM节点赋给stateNode
workInProgress.stateNode = instance;

// 处理初始属性
if (
  finalizeInitialChildren(
    instance,
    type,
    newProps,
    rootContainerInstance,
    currentHostContext
  )
) {
  markUpdate(workInProgress);
}
```

---

### **构建`effectList`：**

在`completeWork`阶段，为了优化在提交阶段的性能，React不会再次遍历整棵Fiber树来找出需要处理的副作用节点，而是在“归”阶段构建了一条`effectList`。

- **`effectList`结构：** 这是一个单向链表，所有有副作用的Fiber节点（`effectTag`不为`null`）会被串联到这个链表中。
- **作用：** 在提交阶段，只需遍历`effectList`，就可以高效地处理所有需要执行副作用的Fiber节点。

**可视化示意：**

```
rootFiber.firstEffect ---> Fiber节点 ---> Fiber节点 ---> ... ---> rootFiber.lastEffect
```

---

### **为什么初次渲染只需要在`rootFiber`上有一个`Placement`的`effectTag`？**

由于在`completeWork`的“归”阶段，每个父节点都会通过`appendAllChildren`将其子节点的DOM插入自身。这意味着在到达`rootFiber`时，我们已经有了一棵完整的离屏DOM树。最终，在提交阶段，只需在`rootFiber`的位置执行一次插入操作，就可以将整棵DOM树挂载到页面上。

---

### **总结：**

`completeWork`在React协调过程中扮演着关键角色：

- **处理Fiber节点对应的实际DOM操作**，包括创建和更新DOM节点。
- **构建`effectList`，提升提交阶段的性能**。
- **为提交阶段提供必要的数据**，确保副作用能被正确地执行。

通过理解`completeWork`的工作流程，我们更深入地了解了React是如何高效地更新UI，以及其中所涉及的性能优化策略。

---

**参考资料：**

- [React源码之completeWork](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberCompleteWork.new.js)
- [React Fiber架构解析](https://reactjs.org/docs/implementation-notes.html)
- Dan Abramov对`effectList`的比喻：将其比作圣诞树上的一串彩灯，形象地描述了副作用链表的工作方式。
