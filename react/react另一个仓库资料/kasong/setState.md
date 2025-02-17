### this.setState 的工作流程

当我们有了前面知识的铺垫，就很容易理解 `this.setState` 的工作流程。

### 流程概览

可以看到，`this.setState` 内会调用 `this.updater.enqueueSetState` 方法。

```javascript
Component.prototype.setState = function (partialState, callback) {
  if (!(typeof partialState === 'object' || typeof partialState === 'function' || partialState == null)) {
    {
      throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
    }
  }
  this.updater.enqueueSetState(this, partialState, callback, 'setState');
};
```

在 `enqueueSetState` 方法中，就是我们熟悉的从创建 update 到调度 update 的流程了。

```javascript
enqueueSetState(inst, payload, callback) {
  // 通过组件实例获取对应 fiber
  const fiber = getInstance(inst);

  const eventTime = requestEventTime();
  const suspenseConfig = requestCurrentSuspenseConfig();

  // 获取优先级
  const lane = requestUpdateLane(fiber, suspenseConfig);

  // 创建 update
  const update = createUpdate(eventTime, lane, suspenseConfig);

  update.payload = payload;

  // 赋值回调函数
  if (callback !== undefined && callback !== null) {
    update.callback = callback;
  }

  // 将 update 插入 updateQueue
  enqueueUpdate(fiber, update);
  // 调度 update
  scheduleUpdateOnFiber(fiber, lane, eventTime);
}
```

这里值得注意的是对于 ClassComponent，`update.payload` 为 `this.setState` 的第一个传参（即要改变的 state）。

### this.forceUpdate

在 `this.updater` 上，除了 `enqueueSetState` 外，还存在 `enqueueForceUpdate`，当我们调用 `this.forceUpdate` 时会调用它。

可以看到，除了赋值 `update.tag = ForceUpdate` 以及没有 `payload` 外，其他逻辑与 `this.setState` 一致。

```javascript
enqueueForceUpdate(inst, callback) {
  const fiber = getInstance(inst);
  const eventTime = requestEventTime();
  const suspenseConfig = requestCurrentSuspenseConfig();
  const lane = requestUpdateLane(fiber, suspenseConfig);

  const update = createUpdate(eventTime, lane, suspenseConfig);

  // 赋值 tag 为 ForceUpdate
  update.tag = ForceUpdate;

  if (callback !== undefined && callback !== null) {
    update.callback = callback;
  }

  enqueueUpdate(fiber, update);
  scheduleUpdateOnFiber(fiber, lane, eventTime);
}
```

### ForceUpdate 的作用

在判断 ClassComponent 是否需要更新时有两个条件需要满足：

```javascript
const shouldUpdate =
  checkHasForceUpdateAfterProcessing() ||
  checkShouldComponentUpdate(
    workInProgress,
    ctor,
    oldProps,
    newProps,
    oldState,
    newState,
    nextContext,
  );
```

- **checkHasForceUpdateAfterProcessing**：内部会判断本次更新的 Update 是否为 ForceUpdate。即如果本次更新的 Update 中存在 `tag` 为 ForceUpdate，则返回 `true`。
- **checkShouldComponentUpdate**：内部会调用 `shouldComponentUpdate` 方法，以及当该 ClassComponent 为 PureComponent 时会浅比较 state 与 props。

所以，当某次更新含有 `tag` 为 ForceUpdate 的 Update，那么当前 ClassComponent 不会受其他性能优化手段（`shouldComponentUpdate` | PureComponent）影响，一定会更新。

### 总结

至此，我们学习完了 HostRoot | ClassComponent 所使用的 Update 的更新流程。

在下一章我们会学习另一种数据结构的 Update —— 用于 Hooks 的 Update。
