- renderer工作的阶段被称为commit阶段，在commit阶段，会将各种副作用flags表示,commit提交到宿主环境的ui,
- render阶段流程会被打断，commit阶段一旦开始就会同步执行直到完成，整个过程分为三个阶段beforeMutation,Mutation,Layout阶段
- 起点:commitRoot方法的调用
- commitRoot(root);root代表本次更新所属FiberRootNode,root.finishedWork代表Wip HostRootFiber,就是render阶段构建的wip fiber tree的hostRootFiber
- 三个子阶段执行之前，需要判断本次更新是否涉及和三个子阶段相关的副作用，

```js
  const subtreeHasEffects = (finishedWork.subtreeFlags !== NoFlags) 
  && (BeforeMutationMask | MutationMask | LayoutMask | PassiveMask);

const rootHasEffect = (finishedWork.flags !== NoFlags) 
  && (BeforeMutationMask | MutationMask | LayoutMask | PassiveMask);
    if (subtreeHasEffects || rootHasEffect) {
      // 省略进入三个子阶段
    } else {
      // 省略本次更新没有三个子阶段的副作用
    }
```


- 其中 subtreeHasEffects 代表 “WIP HostRootFiber 的子孙元素存在的副作用 flags”
- rootHasEffect 代表 “WIP HostRootFiber 本身存在的副作用 flags”。
-  所以当 WIP HostRootFiber 或其子孙存在副作用 flags 时，会进入三个子阶段，否则会跳过三个子阶段。


```js
// 再来观察与 subtreeHasEffects 相关的 mask（掩码）:
const BeforeMutationMask = Update | Snapshot;
const MutationMask = Placement | Update | ChildDeletion | ContentReset | Ref | Hydrating | Visibility;
const LayoutMask = Update | Callback | Ref | Visibility;
const PassiveMask = Passive | ChildDeletion;
```
- 每个 mask 由 “与该阶段相关的副作用 flags” 组合而成。
- 比如 BeforeMutationMask 由 Update 与 Snapshot 组成，代表 “BeforeMutation 阶段与这两个 flags 相关”。
- 由于 Snapshot 是 “Class Component 存在更新，且定义了 getSnapshotBeforeUpdate 方法” 后才会设置的 flags，
- 因此可以判断 BeforeMutation 阶段会执行 getSnapshotBeforeUpdate 方法。

- 这里提供以上所有 flags 的部分含义供参考。

- Update: 
  - Class Component 存在更新，且定义了 componentDidMount 或 componentDidUpdate 方法；
  - Host Component 发生属性变化；
  - Host Text 发生内容变化；
  - Functional Component 定义了 useLayoutEffect。

- Snapshot: 
  - Class Component 存在更新，且定义了 getSnapshotBeforeUpdate 方法。

- Placement: 
  - 当前 Fiber Node 或子孙 Fiber Node 存在 “需要插入或移动” 的情况。
以下是您提供的内容经过整理和修正后的版本，确保语法和逻辑的正确性，并保持原有结构。


- **HostComponent 或 HostText**: 
  - 代表 React 中的宿主组件或宿主文本。

- **ChildDeletion**: 
  - 有“需要被删除的子 HostComponent 或子 HostText”。

- **ContentReset**: 
  - 清空 HostComponent 的文本内容。

- **Ref**: 
  - HostComponent `ref` 属性的创建与更新。

- **Hydrating**: 
  - 与 `hydrate` 相关的操作。

- **Visibility**: 
  - 控制 `SuspenseComponent` 的子树与 fallback 切换时子树的显隐。

- **Callback**: 
  - 当 Class Component 中的 `this.setState` 执行时，或 `ReactDOM.render` 执行时传递了回调函数参数。

- **Passive**: 
  - Functional Component 中定义了 `useEffect` 且需要触发回调函数。

通过概括上述 flags 的含义，读者可以大体了解每个子阶段要做的工作。例如：`MutationMask` 包含的 flags 大多是“与 UI 相关的副作用”，所以 UI 相关操作发生在 Mutation 阶段。

当 Mutation 阶段完成“UI 相关副作用”后，根据双缓存机制，会执行如下代码完成 Current Fiber Tree 的切换：

```javascript
root.current = finishedWork;
```

当 Layout 阶段执行完（或被跳过）时，基于如下原因会开启新的调度：
- commit 阶段触发了新的更新，比如在 `useLayoutEffect` 回调中触发更新；
- 有遗留的更新未处理。

### 4.1.1 子阶段的执行流程

如果说 render 阶段的 `completeWork` 会完成“自下而上”的 `subtreeFlags` 标记过程，那么 commit 阶段的三个子阶段会完成“自下而上”的 `subtreeFlags` 消费过程。具体来说，每个子阶段的执行过程都遵循三段式（将下文的 XXX 替换为子阶段名称，即对应子阶段执行的函数）。

1. **commitXXXEffects**:
   - 入口函数，`finishedWork` 会作为 `firstChild` 参数传入，代码如下：

```js
nextEffect = firstChild;

function commitXXXEffects(root, firstChild) {
  // 省略标记全局变量
  commitXXXEffects_begin(); // 省略重置全局变量
}

// 将 firstChild 赋值给全局变量 nextEffect，执行 commitXXXEffects_begin
function commitXXXEffects_begin() {
 
  
  while (nextEffect !== null) {
    let fiber = nextEffect;
    let child = fiber.child;

    // 省略该子阶段的一些特有操作

    if ((fiber.subtreeFlags & XXXMask) !== NoFlags && child !== null) {
      // 省略辅助方法
      // 省略向下遍历
      nextEffect = child;
    } else {
      // 执行具体操作的方法
      commitXXXEffects_complete();
    }
  }
}

// 
```
### commitXXXEffects_begin
- 向下遍历直到“第一个满足如下条件之一的 fiberNode”:
- 当前 fiberNode 的子 fiberNode 不包含“该子阶段对应的 flags”，
- 即当前 fiberNode 是“包含该子阶段对应 flags”的“层级最低”的 fiberNode:
- 当前 fiberNode 不存在子 fiberNode，即当前 fiberNode 是叶子元素。
- 对于一些子阶段，在 commitXXXEffects_begin 向下遍历过程中还会执行“该子阶段特有的操作”，这部分内容将在介绍子阶段时讲解。

以下是您提供的内容经过整理和修正后的版本，确保语法和逻辑的正确性，并保持原有结构。


#### 3. commitXXXEffects_complete

执行“flags 对应操作”的函数，包含三个步骤：

1. 对当前 `fiberNode` 执行“flags 对应操作”，即执行 `commitXXXEffectsOnFiber`。
2. 如果当前 `fiberNode` 存在兄弟 `fiberNode`，则对兄弟 `fiberNode` 执行 `commitXXXEffects_begin`。
3. 如果不存在兄弟 `fiberNode`，则对父 `fiberNode` 执行 `commitXXXEffects_complete`。

代码如下：

```javascript
function commitXXXEffects_complete(root) {
  while (nextEffect !== null) {
    let fiber = nextEffect;
    try {
      commitXXXEffectsOnFiber(fiber, root);
    } catch (error) {
      // 错误处理
      captureCommitPhaseError(fiber, fiber.return, error);
    }

    let sibling = fiber.sibling;
    if (sibling !== null) {
      // 省略辅助方法
      nextEffect = sibling;
      return;
    }
    nextEffect = fiber.return;
  }
}
```

综上所述，子阶段的遍历会以 DFS 的顺序，从 `HostRootFiber` 开始向下遍历到第一个满足如下条件的 `fiberNode`:

- `(fiber.subtreeFlags & XXXMask) !== NoFlags` 
- `child !== null`

再从该 `fiberNode` 向上遍历直到 `HostRootFiber`（`HostRootFiber.return === null`）为止。在遍历过程中会执行“flags 对应操作”。


