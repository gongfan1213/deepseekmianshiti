### React Hooks

#### 5. useReducer
`useReducer` 是一种通过 `(state, action) => newState` 的过程，和 `redux` 工作方式一样。数据流： `dispatch(action) => reducer更新state => 返回更新后的state`

```jsx
const [state, dispatch] = useReducer(reducer, initialState);
```

`reducer` 就是一个只能通过 `action` 将 `state` 从一个过程转换成另一个过程的纯函数。

**DEMO**
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

**官方推荐以下场景需要 `useReducer` 更佳：**
- state 逻辑较复杂且包含多个子值，可以集中处理。
- 下一个 state 依赖于之前的 state。
- 想更稳定的构建自动化测试用例。
- 想深层级修改子组件的一些状态，使用 `useReducer` 还能给那些会触发深更新的组件做性能优化，因为你可以向子组件传递 `dispatch` 而不是回调函数。

使用 `reducer` 有助于将读取与写入分开。

**DEMO6**
```jsx
const fetchReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_INIT":
      return {
        ...state,
        loading: true,
        error: false
      };
    case "FETCH_SUCCESS":
      return {
        ...state,
        loading: false,
        error: false,
        data: action.payload
      };
    case "FETCH_FAIL":
      return {
        ...state,
        loading: false,
        error: true
      };
    default:
      throw new Error();
  }
};

function Demo6() {
  const [state, dispatch] = useReducer(fetchReducer, {
    loading: false,
    error: false,
    msg: "",
    data: {}
  });

  const getData = useCallback(async () => {
    try {
      dispatch({ type: "FETCH_INIT" });
      const response = await fetch(
        "https://www.mxnzp.com/api/lottery/common/latest?code=ssq"
      );
      const res = await response.json();

      if (res.code) {
        dispatch({ type: "FETCH_SUCCESS", payload: res.data });
      } else {
        dispatch({ type: "FETCH_FAIL", payload: res.msg });
      }
    } catch (error) {
      dispatch({ type: "FETCH_FAIL", payload: error });
    }
  }, []);

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <Loading loading={state.loading}>
      <p>开奖号码： {state.data.openCode}</p>
    </Loading>
  );
}
```
**结论：**
`useReducer` 处理了多个可以用 `useState` 实现的逻辑，包括 `loading`, `error`, `msg`, `data`。

**useContext 和 useReducer 模拟 redux 管理状态**
```jsx
import React, { useReducer, useContext } from "react";

const ModalContext = React.createContext();

const visibleReducer = (state, action) => {
  switch (action.type) {
    case "CREATE":
      return { ...state, ...action.payload };
    case "EDIT":
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

function Demo7() {
  const initModalVisible = {
    create: false,
    edit: false
  };
  const [state, dispatch] = useReducer(visibleReducer, initModalVisible);

  return (
    <ModalContext.Provider value={{ visibles: state, dispatch }}>
      <Demo7Child />
    </ModalContext.Provider>
  );
}

function Demo7Child() {
  return (
    <div>
      Demo7Child
      <Detail />
    </div>
  );
}

function Detail() {
  const { visibles, dispatch } = useContext(ModalContext);
  console.log("contextValue", visibles);
  return (
    <div>
      <p>create: {`${visibles.create}`}</p>
      <button
        onClick={() => dispatch({ type: "CREATE", payload: { create: true } })}
      >
        打开创建modal
      </button>
    </div>
  );
}

export default Demo7;
```
**结论：**
逻辑很清晰的抽离出来，context value中的值不需要在组件中透传，即用即取。

**注意：**
React 会确保 `dispatch` 函数的标识是稳定的，并且不会在组件重新渲染时改变。这就是为什么可以安全地从 `useEffect` 或 `useCallback` 的依赖列表中省略 `dispatch`。
