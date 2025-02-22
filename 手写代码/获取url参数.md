好的，下面分别用 JavaScript 和 TypeScript 来实现获取 URL 参数的功能，并提供详细的解释。

**JavaScript 实现**

在 JavaScript 中，获取 URL 参数的常用方法有两种：

1.  **使用 `URLSearchParams` 接口 (推荐，现代浏览器支持)**：这是最简洁、最标准的方法。
2.  **手动解析 `window.location.search` 字符串**：这种方法兼容性更好，但代码稍显繁琐。

**方法 1：使用 `URLSearchParams` (推荐)**

```javascript
function getUrlParams(url) {
  const searchParams = new URL(url).searchParams;
  const params = {};

  for (const [key, value] of searchParams) {
    params[key] = value;
  }

  return params;
}

// 示例用法
const url = "https://www.example.com/page?name=John&age=30&city=NewYork";
const params = getUrlParams(url);
console.log(params); // 输出: { name: "John", age: "30", city: "NewYork" }

// 获取单个参数
console.log(params.name); // 输出: "John"
console.log(params.age);  // 输出: "30"
```

**代码解释 (JavaScript - `URLSearchParams`)**

*   `getUrlParams(url)`:  这个函数接收一个 URL 字符串作为参数。
*   `new URL(url).searchParams`:  创建一个 `URL` 对象，然后访问其 `searchParams` 属性，这将返回一个 `URLSearchParams` 对象。
*   `const params = {};`: 创建一个空对象 `params` 来存储解析后的参数。
*   `for (const [key, value] of searchParams)`:  使用 `for...of` 循环遍历 `URLSearchParams` 对象。`URLSearchParams` 对象是可迭代的，每次迭代返回一个 `[key, value]` 数组，其中 `key` 是参数名，`value` 是参数值。
*   `params[key] = value;`:  将参数名和参数值添加到 `params` 对象中。
*   `return params`:  返回包含所有参数的对象。

**方法 2：手动解析 `window.location.search`**

```javascript
function getUrlParamsManual(url) {
  const search = url.indexOf('?') > -1 ? url.substring(url.indexOf('?') + 1) : '';
  const params = {};

  if (search) {
    const paramPairs = search.split('&');

    for (const pair of paramPairs) {
      const [key, value] = pair.split('=');
      params[key] = decodeURIComponent(value || ''); // 解码参数值
    }
  }

  return params;
}
// 示例用法 (与上面相同)
const url = "https://www.example.com/page?name=John&age=30&city=NewYork";
const params = getUrlParamsManual(url);
console.log(params);
console.log(params.name)
```

**代码解释 (JavaScript - 手动解析)**

*    `url.indexOf('?') > -1 ? url.substring(url.indexOf('?') + 1) : '';`: 获取URL中问号后面的部分。如果没有问号，则返回空字符串
*   `paramPairs = search.split('&')`:  将查询字符串按 `&` 符号分割成多个键值对。
*   `[key, value] = pair.split('=')`:  将每个键值对按 `=` 符号分割成键和值。
*   `decodeURIComponent(value || '')`: 对值进行 URL 解码。如果值为空，则使用空字符串。

**TypeScript 实现**

TypeScript 实现与 JavaScript 基本相同，只是增加了类型注解。

```typescript
function getUrlParamsTS(url: string): { [key: string]: string } {
  const searchParams = new URL(url).searchParams;
  const params: { [key: string]: string } = {};

  for (const [key, value] of searchParams) {
    params[key] = value;
  }

  return params;
}

// 示例用法 (与 JavaScript 相同)
const url = "https://www.example.com/page?name=John&age=30&city=NewYork";
const params = getUrlParamsTS(url);
console.log(params);
console.log(params.name)
```

**代码解释 (TypeScript)**

*   `function getUrlParamsTS(url: string): { [key: string]: string }`:
    *   `url: string`:  指定 `url` 参数的类型为字符串。
    *   `: { [key: string]: string }`:  指定函数的返回类型为一个对象，该对象的键（key）是字符串类型，值（value）也是字符串类型。这是一种 TypeScript 索引签名（Index Signature）的写法，表示对象可以有任意多个字符串类型的键值对。
*   `const params: { [key: string]: string } = {};`:  显式地声明 `params` 变量的类型，与函数返回类型相同。

**总结**

*   在现代浏览器中，强烈推荐使用 `URLSearchParams` 接口来获取 URL 参数，因为它更简洁、更易读，而且是标准化的 API。
*   如果需要兼容较旧的浏览器，可以使用手动解析 `window.location.search` 的方法。
*   TypeScript 版本只是在 JavaScript 版本的基础上增加了类型注解，使代码更具可读性和可维护性。