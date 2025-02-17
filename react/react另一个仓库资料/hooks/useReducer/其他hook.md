### React Hooks

#### 1. useImperativeHandle
语法：
```jsx
useImperativeHandle(ref, createHandle, [deps])
```
- `ref`：需要传递的 ref
- `createHandle`：需要暴露给父级的方法
- `deps`：依赖

`useImperativeHandle` 应当与 `forwardRef` 一起使用。

**DEMO10**
```jsx
import React, {
  useRef,
  forwardRef,
  useImperativeHandle,
  useEffect,
  useState
} from "react";

const Child = forwardRef((props, ref) => {
  const inputEl = useRef();
  const [value, setVal] = useState("");

  // 第一版
  // useImperativeHandle(ref, () => {
  //   console.log("useImperativeHandle");
  //   return {
  //     value,
  //     focus: () => inputEl.current.focus()
  //   };
  // });

  // 第二版
  useImperativeHandle(
    ref,
    () => {
      console.log("useImperativeHandle");
      return {
        value,
        focus: () => inputEl.current.focus()
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <input
      ref={inputEl}
      onChange={e => setVal(e.target.value)}
      value={value}
      {...props}
    />
  );
});

function Demo10() {
  const inputEl = useRef(null);

  useEffect(() => {
    console.log("parent-useEffect", inputEl.current);
    inputEl.current.focus();
  }, []);

  function click() {
    console.log("click:", inputEl.current);
    inputEl.current.focus();
  }

  console.log("Demo10", inputEl.current);
  return (
    <div>
      <Child ref={inputEl} />
      <button onClick={click}>click focus</button>
    </div>
  );
}
```

**结论：**
- `useImperativeHandle` 在当前组件 render 后执行。
- **第一版：** 没有 deps，每当 rerender 时，`useImperativeHandle` 都会执行，且能拿到 state 中最新的值，父组件调用传入的方法也是最新。
- **第二版：** 依赖 `[]`，每当 rerender 时，`useImperativeHandle` 不会执行，且不会更新到父组件。
- **第三版：** 依赖传入的 state 值 `[value]`，达到想要的效果。

#### 2. useDebugValue
不常用, 只能在 React Developer Tools 看到，详见官方传送门。
```jsx
function useFriendStatus(friendID) {
  const [isOnline, setIsOnline] = useState(false);
  // 在开发者工具中的这个 Hook 旁边显示标签
  // e.g. "FriendStatus: Online"
  useDebugValue(isOnline ? "Online" : "Offline");
  return isOnline;
}

function Demo11() {
  const isOnline = useFriendStatus(567);
  return <div>朋友是否在线：{isOnline ? "在线" : "离线"}</div>;
}
```

#### 3. useLayoutEffect
很少用，与 `useEffect` 相同，但它会在所有的 DOM 变更之后同步调用 effect, 详见官方传送门。
