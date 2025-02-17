在 **单一节点** 的情况下，当 `newChild` 的类型为 `object`，会进入 `reconcileSingleElement` 函数进行处理。

您可以从[这里](#)查看 `reconcileSingleElement` 的源码。

在 `reconcileChildFibers` 函数中，处理逻辑如下：

```javascript
const isObject = typeof newChild === 'object' && newChild !== null;

if (isObject) {
  // 对象类型，可能是 REACT_ELEMENT_TYPE 或 REACT_PORTAL_TYPE
  switch (newChild.$$typeof) {
    case REACT_ELEMENT_TYPE:
      // 调用 reconcileSingleElement 处理
      return reconcileSingleElement(returnFiber, currentFirstChild, newChild);

    // ...其他 case
  }
}
```
<img width="581" alt="image" src="https://github.com/user-attachments/assets/48a10522-d53a-4ad9-aa27-c5b75ae63c56" />




**`reconcileSingleElement` 函数的主要工作：**

1. **检查是否存在可复用的 DOM 节点。**

2. **判断 DOM 节点是否可以复用，依据是 `key` 和 `type`。**

让我们深入了解第二步是如何实现的：

```javascript
function reconcileSingleElement(
  returnFiber: Fiber,
  currentFirstChild: Fiber | null,
  element: ReactElement
): Fiber {
  const key = element.key;
  let child = currentFirstChild;
  
  // 首先判断是否存在对应 DOM 节点
  while (child !== null) {
    // 上一次更新存在 DOM 节点，接下来判断是否可复用

    // 首先比较 key 是否相同
    if (child.key === key) {

      // key 相同，接下来比较 type 是否相同
      if (child.elementType === element.type) {
        // type 相同，则表示可以复用
        // 返回复用的 fiber
        return child;
      }

      // type 不同，无法复用
      // 将该 fiber 及其兄弟 fiber 标记为删除
      deleteRemainingChildren(returnFiber, child);
      break;
    } else {
      // key 不同，将该 fiber 标记为删除
      deleteChild(returnFiber, child);
    }
    child = child.sibling;
  }

  // 创建新的 Fiber，并返回
  // ...省略创建新 Fiber 的代码
}
```

**结合之前提到的 React 预设的限制，可以看出：**

- React **首先判断 `key` 是否相同**，如果相同，再判断 `type` 是否相同。只有 **`key` 和 `type` 都相同** 时，DOM 节点才能复用。

**需要关注的细节：**

- 当 `child !== null` **且** `key` **相同** **但** `type` **不同** 时，执行 `deleteRemainingChildren`，将 `child` 及其兄弟 fiber 都标记为删除。

- 当 `child !== null` **且** `key` **不同** 时，仅将 `child` 标记为删除，因为后续的兄弟 fiber 还有可能匹配。

**举例说明：**

假设当前页面有三个 `<li>`，我们想全部删除，然后插入一个 `<p>`。

```jsx
// 当前页面显示的
<ul>
  <li>Item 1</li>
  <li>Item 2</li>
  <li>Item 3</li>
</ul>

// 更新后需要渲染的
<ul>
  <p>New Item</p>
</ul>
```

由于本次更新只有一个 `<p>`，属于单一节点的 Diff，会进入上面的处理逻辑。

在 `reconcileSingleElement` 中，会遍历之前的三个 fiber（对应的 DOM 为三个 `<li>`），寻找本次更新的 `<p>` 是否可以复用之前的某个 DOM 节点：

- 由于所有的 `key` 和 `type` 都不匹配（`<li>` 和 `<p>` 类型不同，且未设置 `key`），因此无法复用，需要删除所有旧节点，创建新的 `<p>` 节点。

---

## **练习题**

让我们来做几道习题巩固一下：

**请判断以下 JSX 对象对应的 DOM 元素是否可以复用：**

### **习题 1**

**更新前：**

```jsx
<div>ka song</div>
```

**更新后：**

```jsx
<p>ka song</p>
```

### **习题 2**

**更新前：**

```jsx
<div key="xxx">ka song</div>
```

**更新后：**

```jsx
<div key="ooo">ka song</div>
```

### **习题 3**

**更新前：**

```jsx
<div key="xxx">ka song</div>
```

**更新后：**

```jsx
<p key="ooo">ka song</p>
```

### **习题 4**

**更新前：**

```jsx
<div key="xxx">ka song</div>
```

**更新后：**

```jsx
<div key="xxx">xiao bei</div>
```

---

**思考一下，然后查看答案。**

---

### **公布答案：**

#### **习题 1**

- **是否可以复用：** **否**

- **分析：**

  - **`key`：** 未设置 `key` 属性，默认为 `null`，更新前后 `key` 都为 `null`，即 `key` 相同。

  - **`type`：** 更新前为 `<div>`，更新后为 `<p>`，`type` 不同。

  - **结论：** 虽然 `key` 相同，但 `type` 不同，不能复用。

#### **习题 2**

- **是否可以复用：** **否**

- **分析：**

  - **`key`：** 更新前为 `"xxx"`，更新后为 `"ooo"`，`key` 不同。

  - **`type`：** 更新前后都是 `<div>`。

  - **结论：** 由于 `key` 不同，不需要再判断 `type`，直接判定不能复用。

#### **习题 3**

- **是否可以复用：** **否**

- **分析：**

  - **`key`：** 更新前为 `"xxx"`，更新后为 `"ooo"`，`key` 不同。

  - **`type`：** 更新前为 `<div>`，更新后为 `<p>`，`type` 不同。

  - **结论：** 由于 `key` 不同，不需要再判断 `type`，直接判定不能复用。

#### **习题 4**

- **是否可以复用：** **是**

- **分析：**

  - **`key`：** 更新前后都为 `"xxx"`，`key` 相同。

  - **`type`：** 更新前后都是 `<div>`，`type` 相同。

  - **`children`：** 更新前为 `"ka song"`，更新后为 `"xiao bei"`，内容变化。

  - **结论：** `key` 和 `type` 都相同，可以复用 DOM 节点，React 会复用旧的 `<div>`，并更新其子元素内容。

---

**您都答对了吗？**

理解 React 的 Diff 算法可以帮助我们编写更高效的代码。在这些习题中，我们看到：

- **`key` 和 `type` 相同**，DOM 节点可以复用。

- **`key` 不同**，无需再判断 `type`，直接判定节点不能复用。

- **`type` 不同**，即使 `key` 相同，也不能复用。

---

在接下来的章节中，我们将讨论 **同级有多个节点时的 Diff 算法**，即 `newChild` 类型为数组的情况。

如果您对上述内容有任何疑问，欢迎提出来，我们可以进一步讨论！
