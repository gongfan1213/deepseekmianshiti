### JSX 与 React 概念解析

在深入 React 源码之前，我们需要解决以下疑问：

1. JSX 和 Fiber 节点是同一个东西么？
2. React Component、React Element 是同一个东西么？它们和 JSX 有什么关系？

### JSX 简介

JSX 是一种为 JS 赋予更多视觉表现力的语法扩展，常用于描述组件内容。在编译时，JSX 会被 Babel 编译为 `React.createElement` 方法。

#### JSX 编译

JSX 在编译时会被 Babel 编译为 `React.createElement` 方法。这也是为什么在每个使用 JSX 的 JS 文件中，你必须显式地声明 `import React from "react";`。在 React 17 中，已经不需要显式导入 React 了。

JSX 并不是只能被编译为 `React.createElement` 方法，你可以通过 `@babel/plugin-transform-react-jsx` 插件显式告诉 Babel 编译时需要将 JSX 编译为什么函数的调用（默认为 `React.createElement`）。

### React.createElement

既然 JSX 会被编译为 `React.createElement`，让我们看看它做了什么：

```javascript
export function createElement(type, config, children) {
  let propName;
  const props = {};
  let key = null;
  let ref = null;
  let self = null;
  let source = null;

  if (config != null) {
    // 将 config 处理后赋值给 props
    // ...省略
  }

  const childrenLength = arguments.length - 2;
  // 处理 children，会被赋值给 props.children
  // ...省略

  // 处理 defaultProps
  // ...省略

  return ReactElement(
    type,
    key,
    ref,
    self,
    source,
    ReactCurrentOwner.current,
    props
  );
}

const ReactElement = function (type, key, ref, self, source, owner, props) {
  const element = {
    // 标记这是个 React Element
    $$typeof: REACT_ELEMENT_TYPE,
    type: type,
    key: key,
    ref: ref,
    props: props,
    _owner: owner,
  };

  return element;
};
```

`React.createElement` 最终会调用 `ReactElement` 方法返回一个包含组件数据的对象，该对象有个参数 `$$typeof: REACT_ELEMENT_TYPE` 标记了该对象是个 React Element。

### React.isValidElement

React 提供了验证合法 React Element 的全局 API `React.isValidElement`，我们看下它的实现：

```javascript
export function isValidElement(object) {
  return (
    typeof object === "object" &&
    object !== null &&
    object.$$typeof === REACT_ELEMENT_TYPE
  );
}
```

可以看到，`$$typeof === REACT_ELEMENT_TYPE` 的非 null 对象就是一个合法的 React Element。换言之，在 React 中，所有 JSX 在运行时的返回结果（即 `React.createElement()` 的返回值）都是 React Element。

### React Component

在 React 中，我们常使用 ClassComponent 与 FunctionComponent 构建组件。

```javascript
class AppClass extends React.Component {
  render() {
    return <p>KaSong</p>;
  }
}
console.log("这是ClassComponent：", AppClass);
console.log("这是Element：", <AppClass />);

function AppFunc() {
  return <p>KaSong</p>;
}
console.log("这是FunctionComponent：", AppFunc);
console.log("这是Element：", <AppFunc />);
```

我们可以从控制台打印的对象看出，ClassComponent 对应的 Element 的 `type` 字段为 `AppClass` 自身。FunctionComponent 对应的 Element 的 `type` 字段为 `AppFunc` 自身。

值得注意的是，由于 `AppClass instanceof Function === true` 和 `AppFunc instanceof Function === true`，所以无法通过引用类型区分 ClassComponent 和 FunctionComponent。React 通过 ClassComponent 实例原型上的 `isReactComponent` 变量判断是否是 ClassComponent。

```javascript
ClassComponent.prototype.isReactComponent = {};
```

### JSX 与 Fiber 节点

JSX 是一种描述当前组件内容的数据结构，它不包含组件 schedule、reconcile、render 所需的相关信息，比如：

- 组件在更新中的优先级
- 组件的 state
- 组件被打上的用于 Renderer 的标记

这些内容都包含在 Fiber 节点中。

在组件 mount 时，Reconciler 根据 JSX 描述的组件内容生成组件对应的 Fiber 节点。在 update 时，Reconciler 将 JSX 与 Fiber 节点保存的数据对比，生成组件对应的 Fiber 节点，并根据对比结果为 Fiber 节点打上标记。

### 参考资料

- [如何干掉知乎的全部 DIV](https://zhuanlan.zhihu.com/p/25095594) - 通过这篇文章在运行时修改 `React.createElement` 达到消除页面所有 div 元素的效果
- [React 官网 Blog](https://reactjs.org/blog/2015/12/18/react-components-elements-and-instances.html) - 关于 React Component, Element, Instance, Reconciliation 的简介
