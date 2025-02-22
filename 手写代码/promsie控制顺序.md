好的，这里提供一道关于 Promise 的手写题，目标是控制两个异步请求完成后，按照特定顺序渲染结果。我会提供题目描述、JavaScript 和 TypeScript 的实现，以及详细的代码解释。

**题目描述**

假设有两个异步请求：

1.  `fetchData1()`: 模拟一个网络请求，返回一个 Promise，该 Promise 在一段时间后 resolve 一个字符串 "Data 1"。
2.  `fetchData2()`: 模拟另一个网络请求，返回一个 Promise，该 Promise 在一段时间后 resolve 一个字符串 "Data 2"。

要求：

*   同时发起这两个请求（并发）。
*   无论哪个请求先完成，都要确保先渲染 "Data 2" 的结果，然后再渲染 "Data 1" 的结果。
*   提供一个 `renderData(data)` 函数，用于模拟渲染数据的操作（例如，将数据显示在页面上）。

**JavaScript 实现**

```javascript
// 模拟异步请求
function fetchData1() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("Data 1");
    }, 1500); // 模拟 1.5 秒延迟
  });
}

function fetchData2() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("Data 2");
    }, 500); // 模拟 0.5 秒延迟
  });
}

// 模拟渲染函数
function renderData(data) {
  console.log("Rendering:", data);
  // 在实际应用中，这里会将数据渲染到页面上
}

async function processData() {
  try {
    const [data1, data2] = await Promise.all([fetchData1(), fetchData2()]);
    renderData(data2); // 先渲染 Data 2
    renderData(data1); // 后渲染 Data 1

  } catch (error) {
    console.error("An error occurred:", error);
  }
}

processData();

```

**代码解释 (JavaScript)**

1.  **`fetchData1()` 和 `fetchData2()`:**
    *   这两个函数模拟异步请求，使用 `setTimeout` 来模拟网络延迟。
    *   它们都返回一个 Promise，该 Promise 在延迟结束后 resolve 相应的数据。

2.  **`renderData(data)`:**
    *   这个函数模拟渲染数据的操作。在示例中，它只是简单地将数据打印到控制台。
    *   在实际应用中，你可能会在这里将数据更新到 DOM 元素中。

3.  **`processData()`:**
    *   这是一个 `async` 函数，用于处理异步操作。
    *   `const [data1, data2] = await Promise.all([fetchData1(), fetchData2()]);`:
        *   `Promise.all()`:  这是一个关键的 Promise 方法。它接收一个 Promise 数组作为参数，并返回一个新的 Promise。
        *   并发执行: `Promise.all` 会 *同时* 发起数组中的所有 Promise（并发执行）。
        *   等待所有完成:  返回的 Promise 会等待数组中的 *所有* Promise 都变为 fulfilled 状态（或其中一个变为 rejected 状态）。
        *   结果数组:  当所有 Promise 都 fulfilled 时，返回的 Promise 会 resolve 一个数组，该数组包含所有 Promise 的 resolve 值，并且这些值的顺序与传入的 Promise 数组的顺序 *相同*。  这是保证顺序的关键！
        *   `await`:  `await` 关键字用于等待 `Promise.all()` 返回的 Promise 的结果。
        *   解构赋值: `[data1, data2] = ...` 使用数组解构赋值，将 `Promise.all()` 返回的数组中的值分别赋给 `data1` 和 `data2` 变量。
    *   `renderData(data2);`:  先渲染 `data2`。
    *   `renderData(data1);`:  后渲染 `data1`。
    *   `try...catch`:  用于捕获可能发生的错误（例如，如果其中一个请求失败）。

**TypeScript 实现**

```typescript
// 模拟异步请求 (与 JavaScript 版本相同，但增加了类型注解)
function fetchData1TS(): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("Data 1");
    }, 1500);
  });
}

function fetchData2TS(): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("Data 2");
    }, 500);
  });
}

// 模拟渲染函数 (与 JavaScript 版本相同，但增加了类型注解)
function renderDataTS(data: string): void {
  console.log("Rendering:", data);
}

async function processDataTS(): Promise<void> {
  try {
    const [data1, data2]: [string, string] = await Promise.all([
      fetchData1TS(),
      fetchData2TS(),
    ]);
    renderDataTS(data2);
    renderDataTS(data1);
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

processDataTS();
```

**代码解释 (TypeScript)**

TypeScript 版本与 JavaScript 版本的主要区别在于增加了类型注解：

*   `fetchData1TS(): Promise<string>` 和 `fetchData2TS(): Promise<string>`:  指定这两个函数返回一个 Promise，该 Promise resolve 的值的类型是 `string`。
*   `renderDataTS(data: string): void`:  指定 `renderDataTS` 函数接收一个 `string` 类型的参数，并且没有返回值（`void`）。
*   `processDataTS(): Promise<void>`: 指定该async函数返回一个resolve值为`void`的Promise
*   `const [data1, data2]: [string, string] = ...`:  使用元组类型 `[string, string]` 来明确指定 `data1` 和 `data2` 的类型都是 `string`。

**关键点总结**

*   **`Promise.all()` 的并发性：**  `Promise.all()` 会同时发起所有传入的 Promise，这使得多个异步操作可以并行执行，提高了效率。
*   **`Promise.all()` 的结果顺序：**  `Promise.all()` 返回的 Promise resolve 的数组的顺序与传入的 Promise 数组的顺序一致，这使得我们可以控制渲染的顺序。
*   **`async/await` 的使用：**  `async/await` 语法糖使得异步代码更易于编写和理解，它简化了 Promise 的处理。
*   **TypeScript 的类型注解：**  TypeScript 的类型注解提高了代码的可读性、可维护性和安全性。

这个题目考察了对 Promise 的核心概念（并发、顺序、错误处理）以及 `async/await` 语法的理解和应用。  `Promise.all()` 是解决这类问题的关键。