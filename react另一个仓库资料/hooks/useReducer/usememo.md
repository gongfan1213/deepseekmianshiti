### React Hooks

#### 7. useMemo
语法：
```jsx
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```
返回一个 memoized 值，和 `useCallback` 一样，当依赖项发生变化，才会重新计算 memoized 的值。`useMemo` 和 `useCallback` 不同之处是：它允许你将 memoized 应用于任何值类型（不仅仅是函数）。

**DEMO9**
```jsx
import React, { useState, useMemo } from "react";

function Demo9() {
  const [count, setCount] = useState(0);
  const handle = () => {
    console.log("handle", count);
    return count;
  };

  const handle1 = useMemo(() => {
    console.log("handle1", count);
    return count;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handle2 = useMemo(() => {
    console.log("handle2", count);
    // 大计算量的方法
    return count;
  }, [count]);

  console.log("render-parent");

  return (
    <div>
      <p>
        demo9: {count}
        <button onClick={() => setCount(count + 1)}>++count</button>
      </p>
      <p>-------------------</p>
      <Child handle={handle1} />
    </div>
  );
}

function Child({ handle }) {
  console.log("render-child");
  return (
    <div>
      <p>child</p>
      <p>props-data: {handle}</p>
    </div>
  );
}

export default Demo9;
```

**总结：**
- `useMemo` 会在 render 前执行。
- 如果没有提供依赖项数组，`useMemo` 在每次渲染时都会计算新的值。
- `useMemo` 用于返回 memoized 值，防止每次 render 时大计算量带来的开销。
- 使用 `useMemo` 优化需谨慎，因为优化本身也带来了计算，大多数时候，你不需要考虑去优化不必要的重新渲染。
