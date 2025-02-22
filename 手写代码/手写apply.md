在 JavaScript 中，`Function.prototype.apply()` 方法允许你调用一个函数，并指定该函数的 `this` 值以及以数组形式传递的参数。下面将详细介绍如何手写一个 `apply` 方法。

### 实现思路
1. **将函数挂载到指定的 `this` 对象上**：通过在指定的 `this` 对象上添加一个临时属性，将调用 `apply` 的函数赋值给这个临时属性。这样，当调用这个临时属性时，函数内部的 `this` 值就会指向指定的对象。
2. **处理参数**：如果传入了参数数组，将其展开并作为函数的参数传递。
3. **执行函数并返回结果**：调用临时属性对应的函数，保存结果后删除临时属性，并返回结果。

### 代码实现
```javascript
Function.prototype.myApply = function (context = window, args = []) {
    // 获取调用 myApply 的函数，即当前函数
    const fn = Symbol('fn');
    context[fn] = this;

    // 调用函数并传入参数
    const result = context[fn](...args);

    // 删除临时属性
    delete context[fn];

    // 返回函数执行结果
    return result;
};

// 测试代码
function greet(message) {
    console.log(`${message}, ${this.name}`);
    return `Greeted ${this.name}`;
}

const person = { name: 'John' };
const result = greet.myApply(person, ['Hello']);
console.log(result); 
```

### 代码解释
1. **`context = window`**：这是参数的默认值，表示如果没有传入 `context`，则默认使用 `window` 对象（在浏览器环境中）。
2. **`args = []`**：同样是参数的默认值，表示如果没有传入参数数组，则默认为空数组。
3. **`const fn = Symbol('fn')`**：使用 `Symbol` 创建一个唯一的属性名，避免与 `context` 对象上已有的属性名冲突。
4. **`context[fn] = this`**：将调用 `myApply` 的函数赋值给 `context` 对象的 `fn` 属性。
5. **`const result = context[fn](...args)`**：调用 `context` 对象上的 `fn` 函数，并传入展开后的参数数组，将结果保存到 `result` 变量中。
6. **`delete context[fn]`**：删除 `context` 对象上的临时属性，避免对 `context` 对象造成污染。
7. **`return result`**：返回函数的执行结果。

通过以上步骤，我们就实现了一个简单的 `apply` 方法。