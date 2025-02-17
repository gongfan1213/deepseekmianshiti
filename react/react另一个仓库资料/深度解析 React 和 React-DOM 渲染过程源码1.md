### 深度解析 React 和 React-DOM 渲染过程源码

在这篇文章中，我们将深入探讨 React 和 React-DOM 的渲染过程源码。我们将从官方 API 和一些简易的 Demo 入手，逐步进入 React 的内部世界，揭示其工作原理。本文解析的 React 版本为 v16.13.0。

#### 结构剖析

首先，我们从一个简单的 React 组件开始：

```javascript
import React from 'react';

class App extends React.Component {
  render() {
    console.log(this);
    return (
      <section>Hello World</section>
    );
  }
}

export default App;
```

在这个例子中，我们创建了一个 `App` 类，它继承自 `React.Component`。在 `render` 方法中，我们返回了一个 JSX 格式的 HTML 标签集合。通过控制台查看创建的实例，我们可以看到如下结构：

```plaintext
App {props: {...}, context: {...}, refs: {...}, updater: {...}, _reactInternalFiber: FiberNode, ...}
```

#### 关键属性解析

- **props**: 类似于函数的入参，传递给组件的数据。
- **context**: 在组件树之间共享的信息。
- **refs**: 访问原生 DOM 元素的集合。
- **updater**: 负责组件状态的更新。
- **_reactInternalFiber**: 组件实例对应的 FiberNode。

#### JSX 语法解析

在 `render` 方法中，第 7 行的内容属于 JSX 语法，它是一种类似 HTML 的高级模板语法。JSX 语法会被编译成 `React.createElement` 函数调用。例如：

```jsx
<section>Hello World</section>
```

会被编译成：

```javascript
React.createElement("section", {}, "Hello World");
```

#### React.createElement

`React.createElement` 函数创建的对象就是虚拟 DOM 树。我们来看一下 `React.createElement` 的源码实现：

```javascript
export function createElement(type, config, children) {
  let propName;
  const props = {};

  let key = null;
  let ref = null;
  let self = null;
  let source = null;

  if (config != null) {
    if (hasValidRef(config)) {
      ref = config.ref;
    }
    if (hasValidKey(config)) {
      key = '' + config.key;
    }
    self = config.__self === undefined ? null : config.__self;
    source = config.__source === undefined ? null : config.__source;
    for (propName in config) {
      if (hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
        props[propName] = config[propName];
      }
    }
  }

  const childrenLength = arguments.length - 2;
  if (childrenLength === 1) {
    props.children = children;
  } else if (childrenLength > 1) {
    const childArray = Array(childrenLength);
    for (let i = 0; i < childrenLength; i++) {
      childArray[i] = arguments[i + 2];
    }
    props.children = childArray;
  }

  if (type && type.defaultProps) {
    const defaultProps = type.defaultProps;
    for (propName in defaultProps) {
      if (props[propName] === undefined) {
        props[propName] = defaultProps[propName];
      }
    }
  }

  return ReactElement(
    type,
    key,
    ref,
    self,
    source,
    ReactCurrentOwner.current,
    props,
  );
}
```

#### 解析 `createElement` 函数

1. **参数解析**: `type` 是元素类型，`config` 是配置对象，`children` 是子元素。
2. **初始化**: 初始化 `props`、`key`、`ref`、`self` 和 `source`。
3. **处理 `config`**: 如果 `config` 存在，处理 `ref`、`key`、`self` 和 `source`，并将其他属性添加到 `props` 中。
4. **处理 `children`**: 根据 `children` 的数量，将其添加到 `props` 中。
5. **处理 `defaultProps`**: 如果 `type` 存在 `defaultProps`，将其添加到 `props` 中。
6. **返回 `ReactElement`**: 最后，返回一个 `ReactElement` 对象。

通过以上解析，我们了解了 `React.createElement` 的工作流程。接下来，我们将继续深入探讨 React 和 React-DOM 的渲染过程，揭示其内部实现细节。
