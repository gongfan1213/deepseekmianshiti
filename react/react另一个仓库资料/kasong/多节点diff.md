上一节我们介绍了**单一节点**的 Diff，现在我们来讨论当**同级有多个节点**时，React 是如何处理 Diff 的。

## 示例代码

假设我们有一个函数式组件 `List`：

```jsx
function List() {
  return (
    <ul>
      <li key="0">0</li>
      <li key="1">1</li>
      <li key="2">2</li>
      <li key="3">3</li>
    </ul>
  );
}
```

`List` 的返回值中，`JSX` 对象的 `children` 属性是一个包含四个对象的数组：

```jsx
{
  $$typeof: Symbol(react.element),
  key: null,
  props: {
    children: [
      { $$typeof: Symbol(react.element), type: "li", key: "0", props: { ... } },
      { $$typeof: Symbol(react.element), type: "li", key: "1", props: { ... } },
      { $$typeof: Symbol(react.element), type: "li", key: "2", props: { ... } },
      { $$typeof: Symbol(react.element), type: "li", key: "3", props: { ... } }
    ]
  },
  ref: null,
  type: "ul"
}
```

在这种情况下，`reconcileChildFibers` 的 `newChild` 参数类型为数组，会走到以下处理逻辑：

```javascript
if (isArray(newChild)) {
  // 调用 reconcileChildrenArray 处理
  return reconcileChildrenArray(returnFiber, currentFirstChild, newChild);
}
```

您可以在[这里](#)查看这段源码。

---

## 如何处理同级多个节点的 Diff

### 概览

首先，我们归纳需要处理的情况：

- **情况 1**：节点更新
  - **属性变化**
    ```jsx
    // 更新前
    <ul>
      <li key="0" className="before">0</li>
      <li key="1">1</li>
    </ul>

    // 更新后
    <ul>
      <li key="0" className="after">0</li>
      <li key="1">1</li>
    </ul>
    ```
  - **类型变化**
    ```jsx
    // 更新前
    <ul>
      <li key="0">0</li>
      <li key="1">1</li>
    </ul>

    // 更新后
    <ul>
      <div key="0">0</div>
      <li key="1">1</li>
    </ul>
    ```

- **情况 2**：节点新增或减少
  - **新增节点**
    ```jsx
    // 更新前
    <ul>
      <li key="0">0</li>
      <li key="1">1</li>
    </ul>

    // 更新后
    <ul>
      <li key="0">0</li>
      <li key="1">1</li>
      <li key="2">2</li>
    </ul>
    ```
  - **删除节点**
    ```jsx
    // 更新前
    <ul>
      <li key="0">0</li>
      <li key="1">1</li>
    </ul>

    // 更新后
    <ul>
      <li key="1">1</li>
    </ul>
    ```

- **情况 3**：节点位置变化
  ```jsx
  // 更新前
  <ul>
    <li key="0">0</li>
    <li key="1">1</li>
  </ul>

  // 更新后
  <ul>
    <li key="1">1</li>
    <li key="0">0</li>
  </ul>
  ```

同级多个节点的 Diff，一定属于以上三种情况中的一种或多种。

---

## Diff 的思路

如果让我们设计一个 Diff 算法，可能首先想到以下方案：

1. 判断当前节点的更新属于哪种情况。
2. 如果是新增，执行新增逻辑。
3. 如果是删除，执行删除逻辑。
4. 如果是更新，执行更新逻辑。

然而，这个方案隐含的前提是：不同操作的优先级是相同的。

**React** 团队发现，在日常开发中，相较于新增和删除，**更新组件发生的频率更高**。因此，React 的 Diff 会**优先判断当前节点是否属于更新**。

**注意：**

- 在处理数组相关的算法时，我们经常使用双指针从数组两端同时遍历以提高效率。但是在 React 的 Diff 中，这种方法行不通。理由是：

  - 本次更新的 `newChildren` 是数组形式，但它要和 `current fiber` 比较。
  - 同级的 `Fiber` 节点是由 `sibling` 指针链接形成的单链表，不支持双指针遍历。

- 因此，无法使用双指针优化。

---

## Diff 算法的整体流程

基于以上原因，React 的 Diff 算法的整体逻辑会经历**两轮遍历**：

1. **第一轮遍历**：处理更新的节点。
2. **第二轮遍历**：处理剩下的不属于更新的节点。

### **第一轮遍历**

第一轮遍历的步骤如下：

1. 初始化 `i = 0`，遍历 `newChildren`，将 `newChildren[i]` 与 `oldFiber` 比较，判断 DOM 节点是否可复用。

2. **如果可复用**：
   - `i++`，继续比较 `newChildren[i]` 与 `oldFiber.sibling`。
   - 如果可复用，则继续遍历。

3. **如果不可复用**，分两种情况：
   - **`key` 不同**导致不可复用，立即跳出整个遍历，第一轮遍历结束。
   - **`key` 相同但 `type` 不同**导致不可复用，将 `oldFiber` 标记为 `Deletion`，并继续比较 `oldFiber.sibling`。

4. **遍历结束条件**：
   - `newChildren` 遍历完（即 `i === newChildren.length`）。
   - `oldFiber` 遍历完（即 `oldFiber.sibling === null`）。

您可以从[这里](#)查看这段源码。

#### **第一轮遍历的两种结果**

- **情况 1**：步骤 3 导致的跳出遍历
  - 此时 `newChildren` 没有遍历完，`oldFiber` 也没有遍历完。
  - 例如：

    ```jsx
    // 更新前
    <li key="0">0</li>
    <li key="1">1</li>
    <li key="2">2</li>

    // 更新后
    <li key="0">0</li>
    <li key="2">2</li>
    <li key="1">1</li>
    ```

    - 第一个节点可复用，遍历到 `key === "2"` 的节点，发现 `key` 改变，不可复用，跳出遍历。
    - 此时，`oldFiber` 剩下 `key === "1"`, `key === "2"` 未遍历，`newChildren` 剩下 `key === "2"`, `key === "1"` 未遍历。

- **情况 2**：步骤 4 导致的遍历结束
  - 可能 `newChildren` 遍历完，或 `oldFiber` 遍历完，或它们同时遍历完。
  - 例如：

    ```jsx
    // 更新前
    <li key="0" className="a">0</li>
    <li key="1" className="b">1</li>

    // 情况 1：newChildren 与 oldFiber 都遍历完
    <li key="0" className="aa">0</li>
    <li key="1" className="bb">1</li>

    // 情况 2：newChildren 没遍历完，oldFiber 遍历完
    // newChildren 剩下 key==="2" 未遍历
    <li key="0" className="aa">0</li>
    <li key="1" className="bb">1</li>
    <li key="2" className="cc">2</li>

    // 情况 3：newChildren 遍历完，oldFiber 没遍历完
    // oldFiber 剩下 key==="1" 未遍历
    <li key="0" className="aa">0</li>
    ```

---

### **第二轮遍历**

根据第一轮遍历的结果，我们分别讨论：

#### **情况 1：newChildren 与 oldFiber 同时遍历完**

- 最理想的情况：只需在第一轮遍历中进行组件更新。
- 此时 Diff 结束。

#### **情况 2：newChildren 没遍历完，oldFiber 遍历完**

- 已有的 DOM 节点都复用了，还有新加入的节点。
- 意味着本次更新**有新节点插入**，需要遍历剩下的 `newChildren`，为生成的 `workInProgress` fiber 依次标记 `Placement`。

您可以从[这里](#)查看这段源码。

#### **情况 3：newChildren 遍历完，oldFiber 没遍历完**

- 意味着本次更新比之前的节点数量少，有节点被删除了。
- 需要遍历剩下的 `oldFiber`，依次标记 `Deletion`。

您可以从[这里](#)查看这段源码。

#### **情况 4：newChildren 与 oldFiber 都没遍历完**

- 意味着有节点在这次更新中改变了位置。
- **这是 Diff 算法最精髓也是最难理解的部分**，接下来我们重点讲解。

您可以从[这里](#)查看这段源码。

---

## 处理移动的节点

由于节点位置发生了变化，我们不能再用位置索引 `i` 对比前后的节点。如何才能将同一个节点在两次更新中对应上呢？

**答案是：使用节点的 `key`。**

### **构建 `existingChildren` 映射**

为了快速找到 `key` 对应的 `oldFiber`，我们将所有还未处理的 `oldFiber` 存入一个 `Map`：

```javascript
const existingChildren = mapRemainingChildren(returnFiber, oldFiber);
```

您可以从[这里](#)查看这段源码。

### **遍历剩余的 `newChildren`**

接下来，遍历剩余的 `newChildren`，通过 `newChildren[i].key` 就能在 `existingChildren` 中找到 `key` 相同的 `oldFiber`。

### **标记节点是否需要移动**

**节点是否需要移动**，是基于节点在 **`oldFiber` 中的位置索引** 与 **`lastPlacedIndex`** 的比较。

- **`lastPlacedIndex`**：记录**最后一个可复用节点在 `oldFiber` 中的位置索引**。

- **比较逻辑**：

  - **如果当前节点的 `oldIndex >= lastPlacedIndex`**，表示该节点在上次更新的位置在最后一个已处理节点之后，**不需要移动**。
  - **如果 `oldIndex < lastPlacedIndex`**，表示该节点在上次更新的位置在已处理节点之前，**需要移动**。

- **更新 `lastPlacedIndex`**：
  - 当节点不需要移动时，将 `lastPlacedIndex` 更新为当前节点的 `oldIndex`。

### **举例说明**

#### **示例 1**

假设我们有以下更新：

```jsx
// 更新前
a b c d

// 更新后
a c d b
```

**第一轮遍历：**

- 比较 `a`（新）与 `a`（旧）：`key` 相同，可复用。

  - `a` 的 `oldIndex` 为 `0`。
  - 更新 `lastPlacedIndex` 为 `0`。

- 比较 `c`（新）与 `b`（旧）：`key` 不同，**跳出第一轮遍历**。

**第二轮遍历**：

- 构建 `existingChildren` 映射：

  ```javascript
  {
    b: oldFiber for b (oldIndex: 1),
    c: oldFiber for c (oldIndex: 2),
    d: oldFiber for d (oldIndex: 3)
  }
  ```

- 遍历剩余的 `newChildren`：`c`, `d`, `b`

  - **新节点 `c`**：

    - 在 `existingChildren` 中找到匹配的 `oldFiber`。
    - `oldIndex` 为 `2`，`lastPlacedIndex` 为 `0`。
    - `oldIndex (2) >= lastPlacedIndex (0)`，不需要移动。
    - 更新 `lastPlacedIndex` 为 `2`。

  - **新节点 `d`**：

    - 在 `existingChildren` 中找到匹配的 `oldFiber`。
    - `oldIndex` 为 `3`，`lastPlacedIndex` 为 `2`。
    - `oldIndex (3) >= lastPlacedIndex (2)`，不需要移动。
    - 更新 `lastPlacedIndex` 为 `3`。

  - **新节点 `b`**：

    - 在 `existingChildren` 中找到匹配的 `oldFiber`。
    - `oldIndex` 为 `1`，`lastPlacedIndex` 为 `3`。
    - `oldIndex (1) < lastPlacedIndex (3)`，需要移动。

**结果**：

- 节点 `a`, `c`, `d` 不需要移动。
- 节点 `b` 需要移动，插入到合适的位置。

#### **示例 2**

另一个例子：

```jsx
// 更新前
a b c d

// 更新后
d a b c
```

**第一轮遍历**：

- 比较 `d`（新）与 `a`（旧）：`key` 不同，**跳出第一轮遍历**。

**第二轮遍历**：

- 构建 `existingChildren` 映射：

  ```javascript
  {
    a: oldFiber for a (oldIndex: 0),
    b: oldFiber for b (oldIndex: 1),
    c: oldFiber for c (oldIndex: 2),
    d: oldFiber for d (oldIndex: 3)
  }
  ```

- 遍历剩余的 `newChildren`：`d`, `a`, `b`, `c`

  - **新节点 `d`**：

    - `oldIndex` 为 `3`，`lastPlacedIndex` 为 `0`。
    - `oldIndex (3) >= lastPlacedIndex (0)`，不需要移动。
    - 更新 `lastPlacedIndex` 为 `3`。

  - **新节点 `a`**：

    - `oldIndex` 为 `0`，`lastPlacedIndex` 为 `3`。
    - `oldIndex (0) < lastPlacedIndex (3)`，需要移动。

  - **新节点 `b`**：

    - `oldIndex` 为 `1`，`lastPlacedIndex` 为 `3`。
    - `oldIndex (1) < lastPlacedIndex (3)`，需要移动。

  - **新节点 `c`**：

    - `oldIndex` 为 `2`，`lastPlacedIndex` 为 `3`。
    - `oldIndex (2) < lastPlacedIndex (3)`，需要移动。

**结果**：

- 节点 `d` 不需要移动。
- 节点 `a`, `b`, `c` 需要移动。

---

## **总结**

- **React 的 Diff 算法在处理同级多个节点时，优先处理更新的节点。**

- **节点是否需要移动**，是通过比较节点在旧列表中的位置索引 `oldIndex` 与 `lastPlacedIndex` 来确定的。

- **为了优化性能**，React 尽量减少将节点从后面移动到前面的操作。因此，在上述示例 2 中，React 保持了节点 `d` 不变，而将其他节点标记为需要移动。

---

## **优化建议**

- **尽量提供稳定的 `key` 值**，确保同一节点在不同渲染下可以正确地匹配。

- **避免不必要的 DOM 操作**，例如在列表前面插入节点，会导致后续所有节点位置的变化，增加移动的成本。

---

希望以上内容能够帮助您更好地理解 React 中同级多个节点的 Diff 算法。如果您有任何疑问，欢迎提出！
