### **问题背景**

这段代码的目的是动态加载一个 JavaScript 脚本（通过 `<script>` 标签），并在脚本加载完成后执行一些初始化逻辑。代码中提到 Safari 浏览器下可能会出现 **Promise 状态为 `pending` 的问题**，导致脚本加载完成后无法正确解析（`resolve`）或拒绝（`reject`）Promise。

Safari 的一些特性或限制可能导致以下问题：
1. **`window.cv` 的初始化问题**：
   - 在 Safari 中，`window.cv` 可能是一个 `Promise`，或者在脚本加载完成后未及时初始化。
   - 如果 `window.cv` 是一个 `Promise`，直接传递它可能会导致 Safari 的 Promise 状态卡住（`pending`），从而无法正确触发 `resolve` 或 `reject`。

2. **DOM 变化监听问题**：
   - Safari 对于脚本加载完成的事件处理可能存在不一致性，导致脚本加载完成后无法正确触发相关回调。

3. **异步加载和初始化的时序问题**：
   - Safari 的异步脚本加载和执行顺序可能与其他浏览器不同，导致 `window.cv` 的初始化时机不确定。

---

### **Safari 下的问题分析**

#### **1. `window.cv` 的状态问题**
- 在 Safari 中，`window.cv` 可能是一个 `Promise`，而不是直接的对象。
- 如果直接将 `window.cv` 传递给 `resolve`，可能会导致 Safari 的 Promise 状态卡住（`pending`），因为 Safari 对于嵌套的 Promise 处理可能存在问题。

#### **2. 脚本加载完成的监听问题**
- Safari 的脚本加载完成事件（如 `onload` 或 `onRuntimeInitialized`）可能无法及时触发，或者触发的时机与其他浏览器不同。
- 代码中使用了 `MutationObserver` 来监听 DOM 的变化，以确保在脚本加载完成后能够正确检测到 `window.cv` 的初始化。

#### **3. 异步初始化的时序问题**
- 即使脚本加载完成，`window.cv` 的初始化可能是异步的。
- 如果在 `window.cv` 初始化完成之前调用相关逻辑，可能会导致错误或未定义的行为。

---

### **如何兼容 Safari**

代码中通过以下方式处理 Safari 的兼容性问题：

#### **1. 使用 `MutationObserver` 监听 DOM 变化**
```javascript
const observer = new MutationObserver(async () => {
    if ((window as any).cv) {
        observer.disconnect(); // 断开 observer 的连接
        ...
    }
});
observer.observe(document, { childList: true, subtree: true });
```

- **作用**：
  - 通过 `MutationObserver` 监听 DOM 的变化，确保在脚本加载完成后能够检测到 `window.cv` 的初始化。
  - 即使 Safari 的脚本加载事件（如 `onload`）未正确触发，`MutationObserver` 也能捕获到 DOM 的变化。

- **为什么有效**：
  - 当脚本加载完成并执行时，`window.cv` 会被添加到全局对象中，触发 DOM 的变化。
  - `MutationObserver` 可以捕获这些变化，从而确保代码能够正确检测到 `window.cv` 的初始化。

---

#### **2. 检查 `window.cv` 的状态**
```javascript
if ((window as any).cv instanceof Promise) {
    try {
        resolve(""); // 解析 Promise
    } catch (error) {
        reject(error); // 拒绝 Promise
    }
} else {
    (window as any).cv['onRuntimeInitialized'] = () => {
        resolve(""); // 解析 Promise
    };
    if ((window as any).cv && (window as any).cv['onRuntimeInitialized'] === undefined) {
        resolve("");
    }
}
```

- **作用**：
  - 检查 `window.cv` 是否是一个 `Promise`。
  - 如果是 `Promise`，通过 `try-catch` 处理其解析或拒绝。
  - 如果 `window.cv` 是一个对象，检查其 `onRuntimeInitialized` 属性，确保在初始化完成后触发 `resolve`。

- **为什么有效**：
  - 避免直接传递 `window.cv`，防止 Safari 的 Promise 状态卡住。
  - 通过 `onRuntimeInitialized` 确保在 `window.cv` 初始化完成后触发回调。

---

#### **3. 异步脚本加载**
```javascript
script.async = true; // 设置脚本异步加载
```

- **作用**：
  - 设置脚本为异步加载，避免阻塞页面的其他资源加载。

- **为什么有效**：
  - 异步加载可以提高页面的加载性能，同时避免脚本加载顺序的问题。

---

#### **4. 错误处理**
```javascript
script.onerror = (error) => {
    reject(error); // 脚本加载错误时拒绝 Promise
};
```

- **作用**：
  - 捕获脚本加载错误，确保在加载失败时能够正确触发 `reject`。

- **为什么有效**：
  - 提供了错误处理机制，避免脚本加载失败时 Promise 一直处于 `pending` 状态。

---

### **总结：为什么这样处理能兼容 Safari**

1. **MutationObserver**：
   - Safari 的脚本加载事件可能不可靠，使用 `MutationObserver` 监听 DOM 的变化可以确保在脚本加载完成后检测到 `window.cv` 的初始化。

2. **检查 `window.cv` 的状态**：
   - Safari 中，`window.cv` 可能是一个 `Promise`，直接传递可能导致状态卡住。
   - 通过检查 `window.cv` 的类型和状态，确保在初始化完成后正确触发回调。

3. **异步加载和错误处理**：
   - 异步加载脚本可以避免阻塞页面的其他资源加载。
   - 错误处理机制可以确保在脚本加载失败时不会导致 Promise 一直处于 `pending` 状态。

---

### **Safari 下的特殊性**

Safari 浏览器在处理异步脚本加载和 Promise 时可能存在以下特殊性：
1. **嵌套 Promise 的处理**：
   - Safari 对嵌套 Promise 的解析可能存在问题，导致状态卡住。
2. **脚本加载事件的触发时机**：
   - Safari 的脚本加载事件可能与其他浏览器不一致，导致无法及时检测到脚本加载完成。
3. **全局对象的初始化时机**：
   - Safari 中，`window.cv` 的初始化可能是异步的，且时机不确定。

通过上述兼容性处理，可以有效解决这些问题，确保代码在 Safari 中正常运行。
