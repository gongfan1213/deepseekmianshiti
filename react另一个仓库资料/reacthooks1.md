### React 组件的发展

#### 1. 功能（无状态）组件
Functional (Stateless) Component，功能组件也叫无状态组件，一般只负责渲染。
```jsx
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}
```

#### 2. 类（有状态）组件
Class (Stateful) Component，类组件也是有状态组件，也可以叫容器组件。一般有交互逻辑和业务逻辑。
```jsx
class Welcome extends React.Component {
  state = {
    name: 'tori',
  }

  componentDidMount() {
    fetch(…);
    …
  }

  render() {
    return (
      <>
        <h1>Hello, {this.state.name}</h1>
        <button onClick={() => this.setState({name: '007'})}>改名</button>
      </>
    );
  }
}
```

#### 3. 渲染组件
Presentational Component，和功能（无状态）组件类似。
```jsx
const Hello = (props) => {
  return (
    <div>
      <h1>Hello! {props.name}</h1>
    </div>
  )
}
```

📢 **总结：**
- 函数组件一定是无状态组件，展示型组件一般是无状态组件；
- 类组件既可以是有状态组件，又可以是无状态组件；
- 容器型组件一般是有状态组件。
- 划分的原则概括为：分而治之、高内聚、低耦合；
- 通过以上组件之间的组合能实现绝大部分需求。

#### 4. 高阶组件
Higher order components (HOC) 主要是抽离状态，将重复的受控组件的逻辑抽离到高阶组件中，以新的props传给受控组件中，高阶组件中可以操作props传入受控组件。
```jsx
class HocFactory extends React.Component {
  constructor(props) {
    super(props)
  }

  // 操作props
  …

  render() {
    const newProps = {…};
    return (Component) => <Component {…newProps} />;
  }
}

const Authorized = (Component) => (permission) => {
  return class Authorized extends React.Component {
    …
    render() {
      const isAuth = ‘’;
      return isAuth ? <Component /> : <NoMatch />;
    }
  }
}

// 项目中涉及到的高阶组件
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './actions';

let cachedActions;

const bindActions = (dispatch, ownProps) => {
  if (!cachedActions) {
    cachedActions = {
      dispatch,
      actions: bindActionCreators(actions, dispatch),
    };
  }
  return cachedActions;
};

const connectWithActions = (
  mapStateToProps,
  mergeProps,
  options
) => (component) => connect(
  mapStateToProps, bindActions, mergeProps, options
)(component);

export default connectWithActions;
```

**HOC的不足**
- HOC产生了许多无用的组件，加深了组件层级，性能和调试受影响。
- 多个HOC同时嵌套，劫持props，命名可能会冲突，且内部无法判断Props是来源于哪个HOC。

#### 5. Render Props
Render Props 你可以把它理解成 JavaScript 中的回调函数
```jsx
class ToggleVisible extends React.Component {
  state = {
    visible: false
  };

  toggle = () => {
    this.setState({visible: !this.state.visible});
  }

  render() {
    return (
      <>{this.props.children({visible: this.state.visible, toggle: this.toggle})}</>
    );
  }
}

// 使用
const EditUser = () => (
  <ToggleVisible>
    {({visible, toggle}) => (
      <>
        <Modal visible={visible}/>
        <Button onClick={toggle}>打开/关闭modal</Button>
      </>
    )}
  </ToggleVisible>
)
```

📢 **优点**
- 组件复用不会产生多余的节点，也就是不会产生多余的嵌套。
- 不用担心props命名问题。

#### 6. 组合式组件（Compound Component）
子组件所需要的props在父组件会封装好，引用子组件的时候就没必要传递所有props了。组合组件核心的两个方法是`React.Children.map`和`React.cloneElement`。
```jsx
class GroupButton extends React.PureComponent {
  state = {
    activeIndex: 0
  };

  render() {
    return (
      <>
        {React.Children.map(this.props.children, (child, index) =>
          child.type
            ? React.cloneElement(child, {
                active: this.state.activeIndex === index,
                onClick: () => {
                  this.setState({ activeIndex: index });
                  this.props.onChange(child.props.value);
                }
              })
            : child
        )}
      </>
    );
  }
}

// 用法
<GroupButton
  onChange={e => {
    console.log("onChange", e);
  }}
>
  <Button value="red">red</Button>
  <Button value="yellow">yellow</Button>
  <Button value="blue">blue</Button>
  <Button value="white">white</Button>
</GroupButton>
```

### React hooks
Hook 出现之前，组件之间复用状态逻辑很难，解决方案（HOC、Render Props）都需要重新组织组件结构，且代码难以理解。在React DevTools 中观察过 React 应用，你会发现由 providers，consumers，高阶组件，render props 等其他抽象层组成的组件会形成“嵌套地狱”。

组件维护越来越复杂，譬如事件监听逻辑要在不同的生命周期中绑定和解绑，复杂的页面`componentDidMount`包涵很多逻辑，代码阅读性变得很差。

class组件中的`this`难以理解，且class 不能很好的压缩，并且会使热重载出现不稳定的情况。更多引子介绍参见官方介绍。

所以hook就为解决这些问题而来：
- 避免地狱式嵌套，可读性提高。
- 函数式组件，比class更容易理解。
- class组件生命周期太多太复杂，使函数组件存在状态。
- 解决HOC和Render Props的缺点。
- UI 和 逻辑更容易分离。

#### 1. useState
📢 函数组件有状态了
```jsx
const [state, setState] = useState(initialState); // state为变量，setState 修改 state值的方法， setState也是异步执行。

function Example() {
  // 声明一个叫 "count" 的 state 变量
  const [count, setCount] = useState(0);
  const [obj, setData] = useState();

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
}
```

class `this.setState`更新是state是合并， `useState`中`setState`是替换。

#### 2. useEffect
📢 忘记生命周期，记住副作用
```jsx
useEffect(() => {
  // Async Action
}, ?[dependencies]); // 第二参数非必填
```

**DEMO2**
```jsx
function Hook2() {
  const [data, setData] = useState();
  useEffect(() => {
    console.log("useEffect");
  });
  return (
    <div>
      {(() => {
        console.log("render");
        return null;
      })()}
      <p>data: {JSON.stringify(data)}</p>
    </div>
  );
}
```
**执行结果：**
```
render
useEffect
```

**结论：**
- `useEffect` 是在render之后生效执行的。

**DEMO3**
```jsx
import React, { useState, useEffect } from "react";

function Demo3() {
  const [data, setData] = useState();
  useEffect(() => {
    console.log("useEffect—[]");
    fetch("https://www.mxnzp.com/api/lottery/common/latest?code=ssq")
      .then(res => res.json())
      .then(res => {
        setData(res);
      });
  }, []);

  useEffect(() => {
    console.log("useEffect ---> 无依赖");
  });

  useEffect(() => {
    console.log("useEffect 依赖data： data发生了变化");
  }, [data]);

  return (
    <div>
      <p>data: {JSON.stringify(data)}</p>
    </div>
  );
}
export default Demo3;
```
**执行结果：**
```
useEffect—[]
useEffect ---> 无依赖
useEffect 依赖data： data发生了变化
```

**结论：**
- `useEffect`在render后按照前后顺序执行。
- `useEffect`在没有任何依赖的情况下，render后每次都按照顺序执行。
- `useEffect`内部执行是异步的。
- 依赖`[]`可以实现类似`componentDidMount`的作用，但最好忘记生命周期，只记副作用。

**DEMO4**
```jsx
import React, { useState, useEffect } from "react";

function Demo4() {
  useEffect(() => {
    console.log("useEffect1");
    const timeId = setTimeout(() => {
      console.log("useEffect1-setTimeout-2000");
    }, 2000);
    return () => {
      clearTimeout(timeId);
    };
  }, []);

  useEffect(() => {
    console.log("useEffect2");
    const timeId = setInterval(() => {
      console.log("useEffect2-setInterval-1000");
    }, 1000);
    return () => {
      clearInterval(timeId);
    };
  }, []);

  return (
    <div>
      {(() => {
        console.log("render");
        return null;
      })()}
      <p>demo4</p>
    </div>
  );
}
export default Demo4;
```
**执行结果：**
```
render
useEffect1
useEffect2
useEffect2-setInterval-1000
useEffect2-setInterval-1000
useEffect1-setTimeout-2000
```

**结论：**
- `useEffect`回调函数是按照先后顺序同时执行的。
- `useEffect`的回调函数返回一个匿名函数，相当于`componentUnMount`的钩子函数，一般是remove eventLisenter， clear timeId等，主要是组件卸载后防止内存泄漏。

综上所述，`useEffect` 就是监听每当依赖变化时，执行回调函数的存在函数组件中的钩子函数。

#### 3. useContext
跨组件共享数据的钩子函数
```jsx
const value = useContext(MyContext);
// MyContext 为 context 对象（React.createContext 的返回值） 
// useContext 返回MyContext的返回值。
// 当前的 context 值由上层组件中距离当前组件最近的<MyContext.Provider> 的 value prop 决定。
```

**DEMO5**
```jsx
import React, { useContext, useState } from "react";
const MyContext = React.createContext();

function Demo5() {
  const [value, setValue] = useState("init");
  console.log("Demo5");
  return (
    <div>
      {(() => {
        console.log("render");
        return null;
      })()}
      <button onClick={() => {
        console.log('click：更新value')
        setValue(`${Date.now()}_newValue`)
      }}>
        改变value
      </button>
      <MyContext.Provider value={value}>
        <Child1 />
        <Child2 />
      </MyContext.Provider>
    </div>
  );
}

function Child1() {
  const value = useContext(MyContext);
  console.log("Child1-value", value);
  return <div>Child1-value: {value}</div>;
}

const Child2 = React.memo((props) => {
  console.log('Child2');
  return <div>Child2</div>;
});

export default Demo5;
```
**执行结果：**
```
Demo5
render
Child1-value init
Child2
click：更新value
render
Child1-value 1634567890123_newValue
```

**结论：**
- `useContext` 的组件总会在 context 值变化时重新渲染，所以`<MyContext.Provider>`包裹的越多，层级越深，性能会造成影响。
- `<MyContext.Provider>` 的 value 发生变化时候，包裹的组件无论是否订阅content value，所有组件都会重新渲染。
- demo中child2 不应该rerender, 如何避免不必要的render？使用`React.memo`优化。

**注意：**
默认情况下`React.memo`只会对复杂对象做浅层对比，如果你想要控制对比过程，那么请将自定义的比较函数通过第二个参数传入来实现。
