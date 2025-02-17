### React Hooks

#### 6. useCallback
语法：
```jsx
const memoizedCallback = useCallback(
  () => {
    doSomething(a, b);
  },
  [a, b],
);
```
返回一个 memoized 回调函数。

`useCallback` 解决了什么问题？先看 DEMO8

**DEMO8**
```jsx
import React, { useRef, useEffect, useState, useCallback } from "react";

function Child({ event, data }) {
  console.log("child-render");
  // 第五版
  useEffect(() => {
    console.log("child-useEffect");
    event();
  }, [event]);
  return (
    <div>
      <p>child</p>
      {/* <p>props-data: {data.data && data.data.openCode}</p> */}
      <button onClick={event}>调用父级event</button>
    </div>
  );
}

const set = new Set();

function Demo8() {
  const [count, setCount] = useState(0);
  const [data, setData] = useState({});

  // 第一版
  // const handle = async () => {
  //   const response = await fetch(
  //     "https://www.mxnzp.com/api/lottery/common/latest?code=ssq"
  //   );
  //   const res = await response.json();
  //   console.log("handle", data);
  //   setData(res);
  // };

  // 第二版
  // const handle = useCallback(async () => {
  //   const response = await fetch(
  //     "https://www.mxnzp.com/api/lottery/common/latest?code=ssq"
  //   );
  //   const res = await response.json();
  //   console.log("handle", data);
  //   setData(res);
  // });

  // 第三版
  // const handle = useCallback(async () => {
  //   const response = await fetch(
  //     "https://www.mxnzp.com/api/lottery/common/latest?code=ssq"
  //   );
  //   const res = await response.json();
  //   setData(res);
  //   console.log("useCallback", data);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  // 第四版
  // const handle = useCallback(async () => {
  //   const response = await fetch(
  //     "https://www.mxnzp.com/api/lottery/common/latest?code=ssq"
  //   );
  //   const res = await response.json();
  //   setData(res);
  //   console.log("parent-useCallback", data);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  // 第五版
  const handle = useCallback(async () => {
    const response = await fetch(
      "https://www.mxnzp.com/api/lottery/common/latest?code=ssq"
    );
    const res = await response.json();
    setData(res);
    console.log("parent-useCallback", data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);
  set.add(handle);

  console.log("parent-render====>", data);
  return (
    <div>
      <button
        onClick={e => {
          setCount(count + 1);
        }}
      >
        count++
      </button>
      <p>set size: {set.size}</p>
      <p>count: {count}</p>
      <p>data: {data.data && data.data.openCode}</p>
      <p>-------------------------------</p>
      <Child event={handle} />
    </div>
  );
}
export default Demo8;
```

**结论：**
- **第一版：** 每次 render，handle 都是新的函数，且每次都能拿到最新的 data。
- **第二版：** 用 `useCallback` 包裹 handle，每次 render，handle 也是新的函数，且每次都能拿到最新的 data，和第一版效果一样，所以不建议这么用。
- **第三版：** `useCallback` 假如第二个参数 deps，handle 会被 memoized，所以每次 data 都是第一次记忆时候的 data（闭包）。
- **第四版：** `useCallback` 依赖 count 的变化，每当 count 变化时，handle 会被重新 memoized。
- **第五版：** 每当 count 变化时，传入子组件的函数都是最新的，所以导致 child 的 `useEffect` 执行。

**总结：**
- `useCallback` 将返回一个记忆的回调版本，仅在其中一个依赖项已更改时才更改。
- 当将回调传递给依赖于引用相等性的优化子组件以防止不必要的渲染时，此方法很有用。
- 使用回调函数作为参数传递，每次 render 函数都会变化，也会导致子组件 rerender，`useCallback` 可以优化 rerender。

**疑问：如何优化子组件不必要的渲染？**
- 可以使用 `React.memo` 来优化子组件的渲染，确保只有在 props 变化时才重新渲染子组件。
