### React Hooks

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

#### 4. useRef
传送门
```jsx
const refContainer = useRef(initialValue);
```
`useRef` 返回一个可变的 ref 对象, 和自建一个 `{current: …}` 对象的唯一区别是，`useRef` 会在每次渲染时返回同一个 ref 对象, 在整个组件的生命周期内是唯一的。
`useRef` 可以保存任何可变的值。其类似于在 class 中使用实例字段的方式。

**总结：**
- `useRef` 可以存储那些不需要引起页面重新渲染的数据。
- 如果你刻意地想要从某些异步回调中读取 /最新的/ state，你可以用 一个 ref 来保存它，修改它，并从中读取。

#### 5. useReducer
```jsx
const [state, dispatch] = useReducer(reducer, initialState);
```
`reducer`就是一个只能通过`action`将`state`从一个过程转换成另一个过程的纯函数;
`useReducer`就是一种通过`(state, action) => newState`的过程，和`redux`工作方式一样。数据流： `dispatch(action) => reducer更新state => 返回更新后的state`

```jsx
const initialState = {count: 0};

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return {count: state.count + 1};
    case 'decrement':
      return {count: state.count - 1};
    default:
      throw new Error();
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <>
      Count: {state.count}
      <button onClick={() => dispatch({type: 'decrement'})}>-</button>
      <button onClick={() => dispatch({type: 'increment'})}>+</button>
    </>
  );
}
```

