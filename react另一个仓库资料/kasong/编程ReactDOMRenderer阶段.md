- cra建立新项目或者用已有的项目

```js
npx create-react-app reactdom-demo
```

- 新建customRender.js引入react-reconciler并且完成初始化，hostConfig是宿主环境配置项后续我们将完善配置项

  
```js
import ReactReconciler from 'react-reconciler'
//宿主环境配置项
const hostConfig = {};
//初始化ReactReconciler
const ReactReconcilerInst = ReactReconciler(hostConfig);
```

- 执行customerRender.js导出一个包含render方法的对象

  
```js
export default {
//render方法
render:(reactElement,domElement,callback)=> {
//创建根节点
if(!domElement._rootContainer){
domElement._rootContainer = ReactReconcilerInst.createContainer(domElement,false);
}
return ReactReconcilerInst.updateContainer(reactElement,domElement._rootContainer,null,callback);
}
};
```

- 在项目入口文件，将reactDOM替换成为CustomeRenderer

```js
// index.js
import React from 'react';
import { customRenderer } from './customRender';
import App from './App'; // 假设你有一个 App 组件

CustomeRenderer.render(<App/>,document.getElementById('root'))
```


- 然后实现hostConfig配置，填充空函数，避免应用因为缺失必要的函数而报错的
在 React 的 Fiber 架构中，`hostConfig` 是一个重要的配置对象，它定义了如何在特定平台上渲染组件。为了避免应用因为缺失必要的函数而报错，我们可以实现一个基本的 `hostConfig` 配置，填充一些空函数。以下是一个示例实现：

```javascript
const hostConfig = {
  // 支持的变更类型
  supportsMutation: true,

  // 获取根主机上下文
  getRootHostContext: () => {
    return {};
  },

  // 获取子主机上下文
  getChildHostContext: (parentContext) => {
    return {};
  },

  // 创建文本节点
  createTextNode: (text) => {
    return document.createTextNode(text);
  },

  // 创建元素节点
  createInstance: (type, props, rootContainerInstance, hostContext) => {
    const element = document.createElement(type);
    // 处理属性
    for (const prop in props) {
      if (props.hasOwnProperty(prop)) {
        element[prop] = props[prop];
      }
    }
    return element;
  },

  // 追加子节点
  appendInitialChild: (parentInstance, child) => {
    parentInstance.appendChild(child);
  },

  // 移除子节点
  removeChild: (parentInstance, child) => {
    parentInstance.removeChild(child);
  },

  // 更新节点
  commitUpdate: (instance, updatePayload, type, oldProps, newProps) => {
    // 处理更新逻辑
    for (const prop in newProps) {
      if (newProps.hasOwnProperty(prop)) {
        instance[prop] = newProps[prop];
      }
    }
  },

  // 其他必要的空函数
  // 这里可以根据需要添加更多的空函数
  finalizeInitialChildren: (domElement, type, props) => {
    return false;
  },

  // 处理其他主机相关的操作
  // ...
};

// 导出 hostConfig
export default hostConfig;
```

### 说明
1. **supportsMutation**: 表示是否支持变更操作，通常设置为 `true`。
2. **getRootHostContext** 和 **getChildHostContext**: 返回上下文对象，通常可以返回空对象。
3. **createTextNode** 和 **createInstance**: 用于创建文本节点和元素节点。
4. **appendChild** 和 **removeChild**: 用于操作 DOM 树。
5. **commitUpdate**: 用于处理节点的更新逻辑。
6. **finalizeInitialChildren**: 用于处理初始子节点的逻辑。

### 注意
- 以上代码是一个基础的实现，具体的实现细节可能需要根据你的应用需求进行调整。
- 你可以根据需要添加更多的函数和逻辑，以支持更复杂的渲染需求。
- 唯一支持Boolean类型的配置项是supportsMutation表示宿主环境的api是否支持Mutation,Dom api的工作方式属于Mutation,比如element.appendChild,element.removeChild
- 将这些api分为4类：
- 初始化环境信息
- getRootHostContext,getChildHostContext初始化上下文信息
- 创建domNode
- createInstance创建dom元素,create TextInstance创建dom的textNode
- 关键逻辑的判断，shouldSetTextContent用于判断组件的children是否是文本节点


```js
function shouldSetTextContent(type, props) {
  // 检查 props.children 是否是有效的文本内容
  const children = props.children;
  return (
    typeof children === 'string' ||
    typeof children === 'number' ||
    (Array.isArray(children) && children.every(child => typeof child === 'string' || typeof child === 'number'))
  );
}
```

- dom操作
- appendInitialChild插入dom元素placement flag
- removeChild删除子dom元素,childDeletion flag,removeChild

```js
import ReactReconciler from 'react-reconciler';

// 宿主环境配置项
const hostConfig = {
  // 支持的变更类型
  supportsMutation: true,

  // 获取根主机上下文
  getRootHostContext: () => {
    return {};
  },

  // 获取子主机上下文
  getChildHostContext: (parentContext) => {
    return {};
  },

  // 创建文本节点
  createTextNode: (text) => {
    return document.createTextNode(text);
  },

  // 创建元素节点
  createInstance: (type, props, rootContainerInstance, hostContext) => {
    // 创建一个新的 DOM 元素
    const element = document.createElement(type);

    // 处理属性
    for (const prop in props) {
      if (props.hasOwnProperty(prop) && prop !== 'children') {
        // 处理常规属性
        element[prop] = props[prop];
      }
    }

    // 处理 children 属性
    if (props.children) {
      // 如果 children 是文本节点，直接设置文本内容
      if (typeof props.children === 'string' || typeof props.children === 'number') {
        element.textContent = props.children;
      } else if (Array.isArray(props.children)) {
        // 如果 children 是数组，递归添加子节点
        props.children.forEach(child => {
          if (typeof child === 'string' || typeof child === 'number') {
            element.appendChild(document.createTextNode(child));
          }
        });
      }
    }

    return element;
  },

  // 追加初始子节点
  appendInitialChild: (parentInstance, child) => {
    parentInstance.appendChild(child);
  },

  // 移除子节点
  removeChild: (parentInstance, child) => {
    parentInstance.removeChild(child);
  },

  // 更新节点
  commitUpdate: (instance, updatePayload, type, oldProps, newProps) => {
    // 更新属性
    for (const prop in newProps) {
      if (newProps.hasOwnProperty(prop) && prop !== 'children') {
        instance[prop] = newProps[prop];
      }
    }

    // 处理 children 更新
    if (newProps.children) {
      // 清空现有子节点
      while (instance.firstChild) {
        instance.removeChild(instance.firstChild);
      }

      // 添加新的子节点
      if (typeof newProps.children === 'string' || typeof newProps.children === 'number') {
        instance.textContent = newProps.children;
      } else if (Array.isArray(newProps.children)) {
        newProps.children.forEach(child => {
          if (typeof child === 'string' || typeof child === 'number') {
            instance.appendChild(document.createTextNode(child));
          }
        });
      }
    }
  },

  // 判断是否设置文本内容
  shouldSetTextContent: (type, props) => {
    const children = props.children;
    return (
      typeof children === 'string' ||
      typeof children === 'number' ||
      (Array.isArray(children) && children.every(child => typeof child === 'string' || typeof child === 'number'))
    );
  },

  // 处理初始子节点
  finalizeInitialChildren: (domElement, type, props) => {
    return false;
  },

  // 处理其他主机相关的操作
  // 这里可以根据需要添加更多的函数
};

// 初始化 ReactReconciler
const ReactReconcilerInst = ReactReconciler(hostConfig);

// 导出一个包含 render 方法的对象
export default {
  render: (reactElement, domElement, callback) => {
    // 创建根节点
    if (!domElement._rootContainer) {
      domElement._rootContainer = ReactReconcilerInst.createContainer(domElement, false);
    }
    return ReactReconcilerInst.updateContainer(reactElement, domElement._rootContainer, null, callback);
  }
};
```



下面是您提供的代码经过整理和注释后的版本。我们将确保代码的可读性，并添加详细的注释以解释每个部分的功能。

### 整理后的 `customRenderer.js`

```javascript
import ReactReconciler from "react-reconciler";

// 宿主环境配置项
const hostConfig = {
  // 获取根主机上下文
  getRootHostContext: () => {
    return {};
  },

  // 获取子主机上下文
  getChildHostContext: () => {
    return {};
  },

  // 准备提交
  prepareForCommit: () => true,

  // 提交后重置
  resetAfterCommit: () => {},

  // 判断是否设置文本内容
  shouldSetTextContent: (_, props) => {
    return (
      typeof props.children === "string" || 
      typeof props.children === "number"
    );
  },

  // 创建元素节点
  createInstance: (type, newProps, rootContainerInstance, _currentHostContext, workInProgress) => {
    // 创建一个新的 DOM 元素
    const domElement = document.createElement(type);

    // 遍历新属性并设置到 DOM 元素上
    Object.keys(newProps).forEach((propName) => {
      const propValue = newProps[propName];

      if (propName === "children") {
        // 处理 children 属性
        if (typeof propValue === "string" || typeof propValue === "number") {
          domElement.textContent = propValue; // 设置文本内容
        }
      } else if (propName === "onClick") {
        // 处理点击事件
        domElement.addEventListener("click", propValue);
      } else if (propName === "className") {
        // 处理类名
        domElement.setAttribute("class", propValue);
      } else {
        // 处理其他属性
        domElement.setAttribute(propName, propValue);
      }
    });

    return domElement; // 返回创建的 DOM 元素
  },

  // 创建文本节点
  createTextInstance: (text) => {
    return document.createTextNode(text); // 创建文本节点
  },

  // 处理初始子节点
  finalizeInitialChildren: () => {},

  // 清空容器
  clearContainer: () => {},

  // 追加初始子节点
  appendInitialChild: (parent, child) => {
    parent.appendChild(child); // 将子节点添加到父节点
  },

  // 支持的变更类型
  supportsMutation: true,

  // 更新 DOM 元素的准备
  prepareUpdate: (domElement, oldProps, newProps) => {
    return true; // 返回 true 表示需要更新
  },

  // 提交更新
  commitUpdate: (domElement, updatePayload, type, oldProps, newProps) => {
    // 遍历新属性并更新到 DOM 元素上
    Object.keys(newProps).forEach((propName) => {
      const propValue = newProps[propName];

      if (propName === "children") {
        // 处理 children 属性
        if (typeof propValue === "string" || typeof propValue === "number") {
          domElement.textContent = propValue; // 更新文本内容
        }
      } else {
        // 更新其他属性
        domElement.setAttribute(propName, propValue);
      }
    });
  },

  // 提交文本更新
  commitTextUpdate: (textInstance, oldText, newText) => {
    textInstance.text = newText; // 更新文本节点的内容
  },

  // 移除子节点
  removeChild: (parentInstance, child) => {
    parentInstance.removeChild(child); // 从父节点中移除子节点
  }
};

// 初始化 ReactReconciler
const ReactReconcilerInst = ReactReconciler(hostConfig);

// 导出一个包含 render 方法的对象
export default {
  render: (reactElement, domElement, callback) => {
    // 创建根容器
    if (!domElement._rootContainer) {
      domElement._rootContainer = ReactReconcilerInst.createContainer(domElement, false);
    }

    // 更新根容器
    return ReactReconcilerInst.updateContainer(
      reactElement,
      domElement._rootContainer,
      null,
      callback
    );
  }
};
```

### 代码注释说明

1. **宿主环境配置项 (`hostConfig`)**:
   - **getRootHostContext**: 返回根上下文，通常为空对象。
   - **getChildHostContext**: 返回子上下文，通常为空对象。
   - **prepareForCommit**: 准备提交，返回 `true` 表示准备好。
   - **resetAfterCommit**: 提交后重置的操作，当前为空函数。
   - **shouldSetTextContent**: 判断 `props.children` 是否为字符串或数字，以决定是否设置文本内容。
   - **createInstance**: 创建 DOM 元素并设置属性，包括处理 `children`、`onClick` 和 `className`。
   - **createTextInstance**: 创建文本节点。
   - **finalizeInitialChildren**: 处理初始子节点的逻辑，当前为空函数。
   - **clearContainer**: 清空容器的操作，当前为空函数。
   - **appendInitialChild**: 将子节点添加到父节点。
   - **supportsMutation**: 表示支持变更操作。
   - **prepareUpdate**: 准备更新，返回 `true` 表示需要更新。
   - **commitUpdate**: 提交更新，遍历新属性并更新到 DOM 元素。
   - **commitTextUpdate**: 提交文本更新，更新文本节点的内容。
   - **removeChild**: 从父节点中移除子节点。

2. **ReactReconciler 实例**
   - 使用 ReactReconciler 初始化 hostConfig。
  - 导出 render 方法:

  - 检查 domElement 是否已经有 _rootContainer，如果没有则创建一个新的容器。
  - 使用 updateContainer 方法更新容器中的内容。
  - 注意事项
  - 这个实现是一个基础的 ReactDOM Renderer，适合用于学习和理解 React 的渲染机制。
  - 你可以根据需要扩展 hostConfig，以支持更多的功能和复杂的组件。
确保在使用时，React 和 React Reconciler 的版本兼容。
