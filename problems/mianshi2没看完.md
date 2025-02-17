以下是图中所有文字的记录：

---

# 美团金融服务二面
## My interview/二周目

- js里==和===的区别
  - ==会类型转换，是宽松相等。例如，'5' == 5 会返回 true，因为字符串 '5' 会被转换为数字 5。
  - ===是严格相等，'5' === 5 会返回 false，因为一个是字符串，一个是数字。

- 讲一下变量提升
- 变量提升（Variable Hoisting）是 JavaScript 中的一种行为，指的是在执行代码之前，变量和函数的声明会被提升到其作用域的顶部。这意味着你可以在声明变量和函数之前使用它们，而不会引发错误。但要注意的是，只有变量的声明会被提升，而变量的初始化不会被提升。

### 1. 变量提升的机制

在 JavaScript 的执行环境中，当代码被解析时，JavaScript 引擎会把所有的变量声明提升到当前作用域的顶部。下面是一些关键点：

- **变量声明提升**：所有的变量声明都会被提升，但初始化不会被提升。这意味着即使在使用变量之前声明，也不会抛出错误，不过它的值在赋值之前是 `undefined`。
  
- **函数声明提升**：函数声明的整个声明（包括定义）会被提升，不仅提升了函数名，整个函数也会被提升，因此在函数定义之前调用它是可以的。

- **let 和 const 的提升**：使用 `let` 和 `const` 声明的变量也会被提升，但它们不会被初始化。访问这些变量之前会导致 **ReferenceError**，称为“暂时性死区”（Temporal Dead Zone）。

### 2. 示例说明

#### 2.1. 变量提升示例

```javascript
console.log(a); // 输出: undefined
var a = 5;
console.log(a); // 输出: 5
```

在这个示例中，尽管变量 `a` 的赋值在 `console.log(a)` 之后，输出第一个日志仍然是 `undefined`。这是因为虽然 `var a` 的声明被提升，但其赋值（`a = 5`）并没有提升。

当此段代码被解析时，JavaScript 引擎实际上执行的是以下内容：

```javascript
var a; // 变量声明被提升
console.log(a); // 输出: undefined
a = 5; // 变量赋值
```

#### 2.2. 函数提升示例

```javascript
console.log(myFunction()); // 输出: "Hello, World!"

function myFunction() {
    return "Hello, World!";
}
```

在这个例子中，虽然调用 `myFunction` 出现在函数定义之前，但由于函数声明会完全提升，所以能够正确调用并输出 `Hello, World!`。

### 3. `let` 和 `const` 的行为

```javascript
console.log(b); // 抛出错误: ReferenceError: Cannot access 'b' before initialization
let b = 10;
```

在这个例子中，尝试访问变量 `b` 会导致 `ReferenceError`，因为在它被声明之前，它处于“暂时性死区”。

### 4. 总结

变量提升是 JavaScript 中一个非常重要的概念，可以帮助开发者理解在不同作用域中变量和函数的访问和使用。以下几点是关键：

- 变量声明总是被提升，但初始化不会。
- 函数声明的整个部分会被提升。
- 使用 `let` 和 `const` 的时候，变量的提升依然存在，但它们会处于“暂时性死区”。
- 了解变量提升有助于避免潜在的错误和更好地理解 JavaScript 的工作机制。

- 讲一下js Promise
- 如何去判断一个变量是数组呢？
# 函数中的 this 指向
在 JavaScript 中，`this` 关键字的指向是一个复杂但重要的概念，理解它对于有效地使用该语言至关重要。`this` 在不同的情况下有不同的含义，以下是一些主要的上下文和用法：

### 1. 全局上下文

在全局上下文中，`this` 通常指向全局对象：

- 在浏览器中，`this` 指向 `window` 对象。
- 在 Node.js 中，`this` 指向 `global`。

```javascript
console.log(this); // 在浏览器中输出: Window
```

### 2. 函数调用

在函数调用中，`this` 的指向取决于函数的调用方式。

#### a. 普通函数调用

普通函数调用中的 `this` 指向全局对象（在严格模式下是 `undefined`）。

```javascript
function sayHello() {
    console.log(this);
}
sayHello(); // 在浏览器中输出: Window
```

#### b. 严格模式

在严格模式（`'use strict';`）下，函数中的 `this` 将是 `undefined`。

```javascript
'use strict';
function sayHello() {
    console.log(this);
}
sayHello(); // 输出: undefined
```

### 3. 对象方法

当 `this` 处于对象的方法中时，它指向调用该方法的对象。

```javascript
const obj = {
    name: 'Alice',
    greet: function() {
        console.log('Hello, ' + this.name);
    }
};

obj.greet(); // 输出: Hello, Alice
```

### 4. 构造函数

当使用 `new` 关键字调用构造函数时，`this` 指向新创建的实例。

```javascript
function Person(name) {
    this.name = name;
}

const person1 = new Person('Bob');
console.log(person1.name); // 输出: Bob
```

### 5. 箭头函数

箭头函数不拥有自己的 `this`，它会从外部作用域继承 `this` 的值。

```javascript
const obj = {
    name: 'Alice',
    greet: function() {
        const arrowFunc = () => {
            console.log('Hello, ' + this.name);
        };
        arrowFunc(); // 输出: Hello, Alice
    }
};

obj.greet();
```

### 6. `call`、`apply` 和 `bind`

可以使用 `call()`、`apply()` 和 `bind()` 方法显式地设置 `this` 的指向。

#### a. `call` 和 `apply`

这两者都立即执行函数，但 `apply` 以数组的形式传递参数。

```javascript
function sayHello() {
    console.log('Hello, ' + this.name);
}

const user = {
    name: 'Alice'
};

sayHello.call(user); // 输出: Hello, Alice
sayHello.apply(user); // 输出: Hello, Alice
```

#### b. `bind`

`bind` 返回一个新函数，`this` 绑定到指定对象。

```javascript
const sayHello = function() {
    console.log('Hello, ' + this.name);
}.bind(user);

sayHello(); // 输出: Hello, Alice
```

### 7. DOM 事件

当在事件处理程序中使用 `this` 时，`this` 通常指向触发事件的元素。

```html
<button id="myButton">Click me</button>
<script>
document.getElementById('myButton').addEventListener('click', function() {
    console.log(this); // 指向 <button>
});
</script>
```

### 总结

- `this` 的值是动态的，依赖于函数的调用方式。
- 在全局上下文中，`this` 引用全局对象；在严格模式下则为 `undefined`。
- 在对象方法中，`this` 指向调用该方法的对象。
- 在构造函数中，`this` 指向新创建的实例。
- 箭头函数不具备自己的 `this`，而是从外部上下文继承。
- 可用 `call`、`apply` 和 `bind` 方法显式设置 `this` 的指向。

理解 `this` 的指向对于编写高效的 JavaScript 代码至关重要，尤其是在复杂的对象和函数交互中。
# state 和 props 的区别是什么
`state` 和 `props` 是 React 中管理组件数据的两种核心方法。它们有不同的用途和特性，理解它们的区别对于有效使用 React 至关重要。以下是它们的主要区别：

### 1. 定义

- **`props`**：
  - `props` 是从父组件传递给子组件的数据。
  - 它们是只读的，子组件不能直接修改 `props`。

- **`state`**：
  - `state` 是组件内部的数据状态。
  - 它是可变的，组件可以通过 `setState` 方法来更新自身的 `state`。

### 2. 更新方式

- **`props`**：
  - `props` 由父组件控制，当传入的数据发生变化时，子组件会自动重新渲染。
  - 组件无法修改自己的 `props`。

```javascript
function ParentComponent() {
    const parentValue = 'Hello from Parent';
    return <ChildComponent message={parentValue} />;
}

function ChildComponent(props) {
    return <div>{props.message}</div>; // props 是只读的
}
```

- **`state`**：
  - `state` 由组件自身管理，组件可以随时通过 `this.setState()`（类组件）或 `useState`（函数组件）来更新状态。
  
```javascript
function Counter() {
    const [count, setCount] = useState(0);

    return (
        <div>
            <p>You clicked {count} times</p>
            <button onClick={() => setCount(count + 1)}>Click me</button>
        </div>
    );
}
```

### 3. 用途

- **`props`**：
  - 用于传递数据和事件回调函数，从而实现组件间的通信。
  - 适用于需要渲染动态内容的场景，但内容不应该被子组件修改。

- **`state`**：
  - 用于保存当前组件的内部数据状态。
  - 适用于需要在用户交互后或其他事件中更新的内容，如表单输入、计数器值等。

### 4. 生命周期

- **`props`**：
  - 由于 `props` 是由父组件传递的，只有当父组件的 `props` 发生变化时，子组件会重新渲染。

- **`state`**：
  - 当 `state` 变化时，组件会重新渲染，不论其父组件的 `props` 是否变化。

### 5. 组件之间的关系

- **`props`**：
  - `props` 允许组件之间传递数据，从父组件到子组件，形成一种单向数据流。

- **`state`**：
  - `state` 表示组件自身的状态，它不是在父子组件之间传递的，而是局部性的。

### 总结

- **`props`**：用于组件间的数据传递，是只读的，不能被子组件修改。通过 `props` 来实现功能的复用和组件之间的交互。
- **`state`**：用于管理组件的内部状态，是可变的，能够反映用户的交互状态，会影响组件的渲染。

理解 `state` 和 `props` 的区别，能够帮助开发者更好地管理组件间的关系，提高应用的可维护性和可读性。

# 讲一下 React hooks 常用的有哪些？有什么好处怎么封装自定义 hooks
React Hooks 是 React 16.8 引入的功能，允许你在函数组件中使用状态和其他 React 特性。下面是一些常用的 React Hooks 及其优缺点，以及如何封装自定义 Hooks 的示例。

### 常用的 React Hooks

1. **useState**
   - **用途**：用于在函数组件中添加状态。
   - **示例**：
     ```javascript
     import React, { useState } from 'react';

     const Counter = () => {
         const [count, setCount] = useState(0);

         return (
             <div>
                 <p>You clicked {count} times</p>
                 <button onClick={() => setCount(count + 1)}>Click me</button>
             </div>
         );
     };
     ```

2. **useEffect**
   - **用途**：用于处理副作用，例如数据获取、定时器设置、事件监听等。
   - **示例**：
     ```javascript
     import React, { useEffect, useState } from 'react';

     const DataFetcher = () => {
         const [data, setData] = useState(null);

         useEffect(() => {
             fetch('https://api.example.com/data')
                 .then(response => response.json())
                 .then(data => setData(data));

             // 清理函数
             return () => {
                 // 取消订阅或清理操作
             };
         }, []); // 空依赖数组表示组件挂载时执行一次

         return <div>{data ? JSON.stringify(data) : 'Loading...'}</div>;
     };
     ```

3. **useContext**
   - **用途**：用于在函数组件中使用上下文 API。
   - **示例**：
     ```javascript
     import React, { useContext } from 'react';

     const ThemeContext = React.createContext('light');

     const ThemedComponent = () => {
         const theme = useContext(ThemeContext);
         return <div className={theme}>This is using the {theme} theme!</div>;
     };
     ```

4. **useReducer**
   - **用途**：用于管理复杂的状态，特别是多个子值的状态。
   - **示例**：
     ```javascript
     import React, { useReducer } from 'react';

     const initialState = { count: 0 };

     const reducer = (state, action) => {
         switch (action.type) {
             case 'increment':
                 return { count: state.count + 1 };
             case 'decrement':
                 return { count: state.count - 1 };
             default:
                 return state;
         }
     };

     const Counter = () => {
         const [state, dispatch] = useReducer(reducer, initialState);

         return (
             <>
                 Count: {state.count}
                 <button onClick={() => dispatch({ type: 'increment' })}>+</button>
                 <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
             </>
         );
     };
     ```

5. **useRef**
   - **用途**：用于访问 DOM 元素或存储可变值。
   - **示例**：
     ```javascript
     import React, { useRef } from 'react';

     const FocusInput = () => {
         const inputRef = useRef(null);

         const handleFocus = () => {
             inputRef.current.focus();
         };

         return (
             <div>
                 <input ref={inputRef} type="text" />
                 <button onClick={handleFocus}>Focus the input</button>
             </div>
         );
     };
     ```

### 封装自定义 Hooks

自定义 Hooks 是一种将功能逻辑抽象到可重用函数中的方式。自定义 Hooks 是以 `use` 开头的 JavaScript 函数，可以使用其他内置 Hook。

#### 例子：创建一个自定义的 `useFetch` Hook

```javascript
import { useState, useEffect } from 'react';

const useFetch = (url) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(url);
                if (!response.ok) throw new Error('Network response was not ok');
                const result = await response.json();
                setData(result);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [url]);

    return { data, loading, error };
};

export default useFetch;
```

### 使用自定义的 `useFetch` Hook

```javascript
import React from 'react';
import useFetch from './useFetch'; // 假设 useFetch 在同一目录下

const DataDisplay = () => {
    const { data, loading, error } = useFetch('https://api.example.com/data');

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return <div>{JSON.stringify(data)}</div>;
};
```

### 自定义 Hooks 的好处

1. **重用逻辑**：可以在多个组件之间共享状态逻辑，避免重复编写相同的代码。
2. **组织性**：逻辑分离使得代码更加模块化，提升可读性和可维护性。
3. **更好的测试**：自定义 Hooks 可以独立地进行测试，提高代码的可测试性。

总结来说，掌握常用的 React Hooks 及其使用，使得构建组件更为灵活和高效，而自定义 Hooks 的封装能力则能极大地提升代码的复用性和结构性。

# 讲一个 hoc 高阶组件在哪里用

高阶组件（Higher-Order Component，HOC）是 React 中的一种设计模式，通常用来复用组件逻辑。HOC 是一个函数，接受一个组件作为参数并返回一个新的组件。它们常用于以下几种场景：

### 1. 代码复用

HOC 允许在多个组件之间共享逻辑和状态，避免代码重复。比如，当你需要在多个组件中实现相同的功能（如权限控制、数据获取等）时，可以通过 HOC 来提取这部分逻辑。

#### 示例：创建一个数据获取 HOC

下面是一个简单的 HOC，它将从 API 获取数据并将其传递给包裹的组件。

```javascript
import React, { Component } from 'react';

// 创建一个 HOC，用于获取数据
const withDataFetching = (WrappedComponent, url) => {
    return class extends Component {
        state = {
            data: null,
            loading: true,
            error: null,
        };

        componentDidMount() {
            fetch(url)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => this.setState({ data, loading: false }))
                .catch(error => this.setState({ error, loading: false }));
        }

        render() {
            const { data, loading, error } = this.state;

            // 将数据和状态传递给包裹的组件
            return (
                <WrappedComponent 
                    data={data} 
                    loading={loading} 
                    error={error} 
                    {...this.props} // 传递其他 props
                />
            );
        }
    };
};

export default withDataFetching;
```

### 2. 逻辑封装

HOC 可以用于将逻辑封装到一个单一的地方，例如，在处理身份验证、权限或用户状态等方面，HOC 可以帮助确保机制一致性。

#### 示例：创建权限控制 HOC

假设我们有一个权限控制机制，可以使用 HOC 来限制某个组件的访问。

```javascript
const withAuthorization = (WrappedComponent) => {
    return class extends Component {
        render() {
            const isAuthorized = /* 你的权限判断逻辑 */;

            if (!isAuthorized) {
                return <div>Unauthorized access</div>;
            }

            return <WrappedComponent {...this.props} />;
        }
    };
};

export default withAuthorization;
```

### 3. 处理组件的生命周期

HOC 可以封装组件的生命周期逻辑，简化代码。

#### 示例：创建日志 HOC

可以创建一个 HOC 来记录组件的挂载和卸载。

```javascript
const withLogging = (WrappedComponent) => {
    return class extends Component {
        componentDidMount() {
            console.log(`${WrappedComponent.name} mounted`);
        }

        componentWillUnmount() {
            console.log(`${WrappedComponent.name} will unmount`);
        }

        render() {
            return <WrappedComponent {...this.props} />;
        }
    };
};

export default withLogging;
```

### 4. 组合多个 HOC

在某些场景中，组件可能需要应用多个高阶组件。在这种情况下，可以通过组合多个 HOC 来增强组件的功能。

#### 示例：组合多个 HOC

```javascript
const EnhancedComponent = withAuthorization(withLogging(withDataFetching(MyComponent, 'https://api.example.com/data')));
```

### 5. 降低代码耦合

通过使用 HOC，你可以减少组件之间的耦合，并将关注点分离，增强组件的单一职责。这有助于提高代码的可维护性。

### 注意事项

- HOC 不能直接修改传入的组件，返回的是一个新的组件。
- HOC 应该尽量保持静态方法和生命周期的一致性，可以使用 `hoist-non-react-statics` 包来复制静态方法。
- 在使用 HOC 时，注意处理 `props` 的传递，以确保 HOC 不会意外覆盖或丢失传递的 `props`。

### 总结

高阶组件在 React 中是一种强大的模式，它让我们可以在组件之间重用逻辑，减少代码重复，并且提高可维护性。它适合用于多种场景，包括数据获取、权限控制、日志记录和生命周期管理等。通过合理使用 HOC，可以使你的 React 应用结构更加清晰和可维护。


- 算法：二分查找
- 手写字符串反转
- 你认为 ToB 和 ToC 平台的侧重点分别是什么？

---

## 说一下 UMD 模块规范是什么？如何在项目中使用 UMD 模块化？
- 自动物点怎么实现？手动点怎么实现？
- scroll 事件相对于 IntersectionObserver 优势和劣势？
- IntersectionObserver 是什么？有什么优势？
- 算法：奇偶链表
- var let count 的区别
- 输入输出题 考点是暂时性死区，介绍一下暂时性死区

---

## 一个 this 指向题目

```javascript
const fn1 = () => { console.log(fn1, this) }
function fn2() { console.log(fn2, this) }
const o = {
  fn1() { console.log('o.fn1', this) },
  fn2: () => { console.log('o.fn2', this) },
  fn3() { this.fn2() },
  fn4: () => { this.fn2() },
}

const fn5 = o.fn3;
```

---

## 在你的低代码项目里边，怎么实现的数据持久化？
- 如果后端接口坏了，现在需要前端去兜底，然后你会怎么去实现这个数据持久化？
- ServiceWorker 是什么？主要是怎么用的？
- 加入一个接口，浏览器发送了一个接口被 ServiceWorker 拦截之后，接口的返回内容和返回状态是什么？
- 你的低代码渲染的页面中不同组件的不同物料是怎么去实现通信的呢？
- React-DND 的实现原理是什么？怎么去实现拖拽组件，手写一个拖拽功能的组件？
- 一个页面中已经有组件 A 和组件 B，我怎么去判断这个组件 A 是要被移动到组件 B 里面还是说说组件 B 是作为一个兄弟平级？
- 一直重复的会有什么问题？怎么去解决页面的重建，比如你的流程搭建工具，每次拖动组件就去重建一次，你怎么去解决这个。

# 为何要用 pnpm 去搭建 monorepo，pnpm 相比 yarn 和 npm 有什么优势？
使用 `pnpm` 来搭建 Monorepo 可以带来多种优势，尤其是在包管理、性能和占用空间等方面。以下是 `pnpm` 相比于 `yarn` 和 `npm` 的一些主要优势：

### 1. 高效的磁盘使用

- **硬链接**：`pnpm` 通过硬链接共享依赖包，可以有效减少磁盘占用。每个项目的 `node_modules` 目录都只包含符号链接（symlinks），实际的包存储在全局的缓存目录中。这种方式显著降低了依赖重复安装的问题。

### 2. 更快的安装速度

- **依赖引用**：由于使用硬链接，`pnpm` 不需要每次都从头开始安装依赖，这可以显著加快安装速度。同时它的算法优化了依赖的解析过程，使得安装过程更高效。
- **并行安装**：`pnpm` 支持并行安装多个依赖，可以进一步加快安装过程。

### 3. 一致的依赖树

- **严格的依赖解析**：`pnpm` 会在每个项目的 `node_modules` 中保留准确的依赖结构，确保每个包只能访问其声明的依赖。这有助于避免意外的全局依赖冲突和版本不一致的问题。

### 4. 更强的 Monorepo 支持

- **Workspaces**：`pnpm` 提供强大的工作区（workspaces）支持，可以让你在一个仓库中管理多个包，方便地处理跨包依赖。
- **集中管理**：在 Monorepo 中，`pnpm` 可以集中管理所有包的依赖，简化了依赖的版本管理。

### 5. 更好的性能

- **快速解析**：`pnpm` 的解析引擎比 `yarn` 和 `npm` 更加高效，能够快速确定依赖关系。

### 6. 强大的 CLI 选项

- `pnpm` 提供了许多有用的命令行选项，增强了用户的灵活性。例如，支持通过 `pnpm list` 来查看依赖树，更好地了解项目结构和依赖关系。

### 7. 生态系统的兼容性

- **兼容性**：`pnpm` 兼容 `npm`、`yarn` 的大多数功能和命令，因此很容易从这两者迁移到 `pnpm`，并且绝大多数现有的包和工具都能兼容工作。

### 8. 依赖的快速更新

- **选择性安装**：`pnpm` 的目标是安装真正所需的包，可以减少无效的包更新问题。更新的速度相对较快。

### 总结

通过上述优势，`pnpm` 是一个非常适合用于搭建 Monorepo 的选择，相比于 `yarn` 和 `npm`，它在磁盘使用、安装速度、依赖管理等方面都有显著的提升。特别适用于管理大型项目及复杂依赖关系的环境，能更有效地支持开发和维护。


--- 

希望这些信息对你有所帮助！
