好的，我们来详细讲解 `Object.keys()`、`Object.values()` 和 `Object.entries()` 这三个方法的使用。它们都是 JavaScript 中用于处理对象属性的非常有用的内置方法。

**1. `Object.keys()`**

*   **作用:**  返回一个包含给定对象自身的所有可枚举属性**键名**（key）的数组。
*   **语法:** `Object.keys(obj)`
    *   `obj`:  要获取其键名的对象。
*   **返回值:** 一个包含对象所有可枚举属性键名的字符串数组。  数组中键名的顺序与对象定义时属性的顺序一致（在大多数现代浏览器中是这样，但不能完全依赖这个顺序）。
*   **注意点:**
    *   只返回对象自身的可枚举属性的键名。
    *   不包括继承来的属性的键名。
    *   不包括不可枚举属性的键名 (例如，使用 `Object.defineProperty` 定义的 `enumerable: false` 的属性)。

```javascript
const person = {
    name: "Alice",
    age: 30,
    city: "New York"
};

const keys = Object.keys(person);
console.log(keys); // 输出: ["name", "age", "city"]

// 演示不可枚举属性和继承属性
const parent = { inheritedProperty: "fromParent" };
Object.defineProperty(parent, 'nonEnumerable', {
    value: 'not enumerable',
    enumerable: false // 设置为不可枚举
});

const child = Object.create(parent); // child 继承自 parent
child.ownProperty = "fromChild";

console.log(Object.keys(child)); // 输出: ["ownProperty"]  (只包含自身可枚举属性)
```

**2. `Object.values()`**

*   **作用:** 返回一个包含给定对象自身的所有可枚举属性**值**（value）的数组。
*   **语法:** `Object.values(obj)`
    *   `obj`: 要获取其值的对象。
*   **返回值:** 一个包含对象所有可枚举属性值的数组。 值的顺序与 `Object.keys()` 返回的键名顺序相对应。
*   **注意点:**
    *   只返回对象自身的可枚举属性的值。
    *   不包括继承来的属性的值。
    *   不包括不可枚举属性的值。

```javascript
const person = {
    name: "Alice",
    age: 30,
    city: "New York"
};

const values = Object.values(person);
console.log(values); // 输出: ["Alice", 30, "New York"]

// 演示不可枚举属性和继承属性 (与 Object.keys() 示例类似)
const parent = { inheritedProperty: "fromParent" };
Object.defineProperty(parent, 'nonEnumerable', {
    value: 'not enumerable',
    enumerable: false
});

const child = Object.create(parent);
child.ownProperty = "fromChild";

console.log(Object.values(child)); // 输出: ["fromChild"] (只包含自身可枚举属性的值)

```

**3. `Object.entries()`**

*   **作用:** 返回一个包含给定对象自身的所有可枚举属性的**键值对**的数组。每个键值对都表示为一个包含两个元素的数组：`[key, value]`。
*   **语法:** `Object.entries(obj)`
    *   `obj`: 要获取其键值对的对象。
*   **返回值:** 一个二维数组，其中每个子数组包含两个元素：`[key, value]`。 键值对的顺序与 `Object.keys()` 返回的键名顺序以及 `Object.values()` 返回的值的顺序相对应。
*   **注意点:**
    *   只返回对象自身的可枚举属性的键值对。
    *   不包括继承来的属性的键值对。
    *   不包括不可枚举属性的键值对。

```javascript
const person = {
    name: "Alice",
    age: 30,
    city: "New York"
};

const entries = Object.entries(person);
console.log(entries);
// 输出:
// [
//   ["name", "Alice"],
//   ["age", 30],
//   ["city", "New York"]
// ]

// 演示不可枚举属性和继承属性 (与 Object.keys() 示例类似)
const parent = { inheritedProperty: "fromParent" };
Object.defineProperty(parent, 'nonEnumerable', {
    value: 'not enumerable',
    enumerable: false
});

const child = Object.create(parent);
child.ownProperty = "fromChild";

console.log(Object.entries(child)); // 输出: [["ownProperty", "fromChild"]]

```

**综合示例与常见用法**

```javascript
const product = {
    id: 123,
    name: "Laptop",
    price: 1200,
    inStock: true,
};

// 1. 遍历对象的所有属性
for (const key of Object.keys(product)) {
    console.log(`${key}: ${product[key]}`);
}

// 2. 获取所有属性值并计算总和 (例如，购物车商品总价)
const prices = [10, 20, 30];
const total = prices.reduce((sum, price) => sum + price, 0); // 使用 reduce 求和
console.log(total);  // 输出 60
//对于对象
const items = {
  item1: 10,
  item2: 20,
  item3: 30
}
const total2 = Object.values(items).reduce((sum, price) => sum + price, 0);
console.log(total2);  // 输出 60

// 3. 将对象转换为键值对数组，方便进行映射、过滤等操作
const entries = Object.entries(product);
const filteredEntries = entries.filter(([key, value]) => typeof value === 'number');
console.log(filteredEntries);
// 输出: [ [ 'id', 123 ], [ 'price', 1200 ] ]

// 4. 使用 Object.fromEntries() 从键值对数组创建对象 (Object.entries() 的逆操作)
const newObject = Object.fromEntries(filteredEntries);
console.log(newObject); // 输出: { id: 123, price: 1200 }

// 5.  快速检查对象是否为空
function isEmptyObject(obj) {
    return Object.keys(obj).length === 0;
}
console.log(isEmptyObject({}));     // 输出: true
console.log(isEmptyObject(product)); // 输出: false
```

**总结**

*   `Object.keys()`：获取对象自身可枚举属性的键名数组。
*   `Object.values()`：获取对象自身可枚举属性的值数组。
*   `Object.entries()`：获取对象自身可枚举属性的键值对数组。

这些方法都非常实用，可以帮助你更方便地处理对象数据，进行遍历、转换、过滤等操作。记住它们只处理对象自身的、可枚举的属性，这是关键。
