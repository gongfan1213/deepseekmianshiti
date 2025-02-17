### Concurrent Mode 概述

在 ReactDOM.render 一节中，我们介绍了 React 当前的三种入口函数。日常开发主要使用的是 Legacy Mode（通过 ReactDOM.render 创建）。

从 [React v17.0 正式发布！](https://reactjs.org/blog/2020/10/20/react-v17.html) 一文可以看到，v17.0 没有包含新特性。究其原因，v17.0 主要的工作在于源码内部对 Concurrent Mode 的支持。所以 v17 版本也被称为“垫脚石”版本。

你可以从 [官网 Concurrent 模式介绍](https://reactjs.org/docs/concurrent-mode-intro.html) 了解其基本概念。

一句话概括：

> Concurrent 模式是一组 React 的新功能，可帮助应用保持响应，并根据用户的设备性能和网速进行适当的调整。

Concurrent Mode 是 React 过去 2 年重构 Fiber 架构的源动力，也是 React 未来的发展方向。

可以预见，当 v17 完美支持 Concurrent Mode 后，v18 会迎来一大波基于 Concurrent Mode 的库。

### Concurrent Mode 的组成部分

底层基础决定了上层 API 的实现，接下来让我们了解下，Concurrent Mode 自底向上都包含哪些组成部分，能够发挥哪些能力？

#### 底层架构 —— Fiber 架构

从设计理念我们了解到要实现 Concurrent Mode，最关键的一点是：实现异步可中断的更新。

基于这个前提，React 花费 2 年时间重构完成了 Fiber 架构。

Fiber 架构的意义在于，它将单个组件作为工作单元，使以组件为粒度的“异步可中断的更新”成为可能。

#### 架构的驱动力 —— Scheduler

如果我们同步运行 Fiber 架构（通过 ReactDOM.render），则 Fiber 架构与重构前并无区别。

但是当我们配合时间切片，就能根据宿主环境性能，为每个工作单元分配一个可运行时间，实现“异步可中断的更新”。

于是，scheduler（调度器）产生了。

#### 架构运行策略 —— lane 模型

到目前为止，React 可以控制更新在 Fiber 架构中运行/中断/继续运行。

基于当前的架构，当一次更新在运行过程中被中断，过段时间再继续运行，这就是“异步可中断的更新”。

当一次更新在运行过程中被中断，转而重新开始一次新的更新，我们可以说：后一次更新打断了前一次更新。

这就是优先级的概念：后一次更新的优先级更高，它打断了正在进行的前一次更新。

多个优先级之间如何互相打断？优先级能否升降？本次更新应该赋予什么优先级？

这就需要一个模型控制不同优先级之间的关系与行为，于是 lane 模型诞生了。

### 上层实现

现在，我们可以说：

从源码层面讲，Concurrent Mode 是一套可控的“多优先级更新架构”。

那么基于该架构之上可以实现哪些有意思的功能？我们举几个例子：

#### batchedUpdates

如果我们在一次事件回调中触发多次更新，它们会被合并为一次更新进行处理。

如下代码执行只会触发一次更新：

```javascript
onClick() {
  this.setState({stateA: 1});
  this.setState({stateB: false});
  this.setState({stateA: 2});
}
```

这种合并多个更新的优化方式被称为 batchedUpdates。

batchedUpdates 在很早的版本就存在了，不过之前的实现局限很多（脱离当前上下文环境的更新不会被合并）。

在 Concurrent Mode 中，是以优先级为依据对更新进行合并的，使用范围更广。

#### Suspense

Suspense 可以在组件请求数据时展示一个 pending 状态。请求成功后渲染数据。

本质上讲 Suspense 内的组件子树比组件树的其他部分拥有更低的优先级。

#### useDeferredValue

`useDeferredValue` 返回一个延迟响应的值，该值可能“延后”的最长时间为 `timeoutMs`。

例子：

```javascript
const deferredValue = useDeferredValue(value, { timeoutMs: 2000 });
```

在 `useDeferredValue` 内部会调用 `useState` 并触发一次更新。

这次更新的优先级很低，所以当前如果有正在进行中的更新，不会受 `useDeferredValue` 产生的更新影响。所以 `useDeferredValue` 能够返回延迟的值。

当超过 `timeoutMs` 后 `useDeferredValue` 产生的更新还没进行（由于优先级太低一直被打断），则会再触发一次高优先级更新。

### 总结

除了以上介绍的实现，相信未来 React 还会开发更多基于 Concurrent Mode 的玩法。

Fiber 架构在之前的章节已经学习了。所以，在本章接下来的部分，我们会按照上文的脉络，自底向上，从架构到实现讲解 Concurrent Mode。
