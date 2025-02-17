### React-DOM 渲染过程解析

在解析完了 React.Element 和 React.Component 之后，我们接下来理一理 React-DOM 的整个渲染过程以及组件生命周期，从组件的创建到组件的挂载，最后再画一个流程图来进行总结。

#### ReactDOM.render

React 本身只是一些基础类的创建，比如 React.Element 和 React.Component，而后续的流程则根据不同的平台有不同的实现。我们这里以常用的浏览器环境为例，调用的是 `ReactDOM.render()` 方法。

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

ReactDOM.render(<App />, document.getElementById('root'));
```

`ReactDOM.render` 方法的实现如下：

```javascript
export function render(
  element: React$Element<any>,
  container: Container,
  callback: ?Function,
) {
  return legacyRenderSubtreeIntoContainer(
    null,
    element,
    container,
    false,
    callback,
  );
}
```

从上图可以看出，`render` 函数返回 `legacyRenderSubtreeIntoContainer` 函数的调用，而该函数最终返回的结果是 Component 实例（也就是 App 组件）。

#### legacyRenderSubtreeIntoContainer

我们来看看 `legacyRenderSubtreeIntoContainer` 函数：

```javascript
function legacyRenderSubtreeIntoContainer(
  parentComponent: ?React$Component<any, any>,
  children: ReactNodeList,
  container: Container,
  forceHydrate: boolean,
  callback: ?Function,
) {
  let root: RootType = (container._reactRootContainer: any);
  let fiberRoot;
  if (!root) {
    root = container._reactRootContainer = legacyCreateRootFromDOMContainer(
      container,
      forceHydrate,
    );
    fiberRoot = root._internalRoot;
    if (typeof callback === 'function') {
      const originalCallback = callback;
      callback = function() {
        const instance = getPublicRootInstance(fiberRoot);
        originalCallback.call(instance);
      };
    }
  } else {
    fiberRoot = root._internalRoot;
    if (typeof callback === 'function') {
      const originalCallback = callback;
      callback = function() {
        const instance = getPublicRootInstance(fiberRoot);
        originalCallback.call(instance);
      };
    }
  }
  return fiberRoot;
}
```

在 `legacyRenderSubtreeIntoContainer` 中的第 28 行，就是 FiberNode 树的创建过程。

#### FiberNode

FiberNode 由内部的 `createFiber` 函数进行创建：

```javascript
const createFiber = function(
  tag: WorkTag,
  pendingProps: mixed,
  key: null | string,
  mode: TypeOfMode,
): Fiber {
  return new FiberNode(tag, pendingProps, key, mode);
};
```

FiberNode 被创建后挂载在了 `FiberRoot.current` 上。最后，App 组件作为根组件实例被返回，而接下来的渲染过程由 FiberNode 接管。

#### 渲染过程流程图

我们画一个流程图来帮助理解：

```plaintext
ReactDOM.render()
    ↓
初始化 FiberRoot
    ↓
返回 FiberRoot.child.stateNode（<App /> Component）
```

从上图可以看出，我们的 React Element 作为 `render` 函数的入参，创建了一个 FiberNode 实例，也就是 `FiberRoot.current`，而后续的渲染过程都由这个根 FiberNode 接管，包括所有的生命周期。

#### 总结

通过以上解析，我们了解了 `ReactDOM.render` 的工作流程。接下来，我们将继续深入探讨 React 和 React-DOM 的渲染过程，揭示其内部实现细节。
