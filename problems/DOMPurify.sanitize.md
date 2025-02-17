`DOMPurify` 是一个用于清理和消毒 HTML 的库，旨在防止跨站脚本攻击（XSS）。`DOMPurify.sanitize` 方法是该库的核心功能，用于清理用户输入的 HTML 代码，移除潜在的恶意代码。

### 安装 DOMPurify

你可以通过 npm 或直接在 HTML 中引入 DOMPurify：

#### 使用 npm 安装

```bash
npm install dompurify
```

#### 在 HTML 中引入

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/dompurify/2.3.4/purify.min.js"></script>
```

### 基本用法

以下是 `DOMPurify.sanitize` 方法的基本用法：

```javascript
// 引入 DOMPurify
import DOMPurify from 'dompurify';

// 要清理的 HTML 字符串
const dirtyHTML = '<img src="x" onerror="alert(1)">Hello <b>world</b>!';

// 使用 DOMPurify 清理 HTML
const cleanHTML = DOMPurify.sanitize(dirtyHTML);

// 输出清理后的 HTML
console.log(cleanHTML); // 输出: Hello <b>world</b>!
```

在这个示例中，`DOMPurify.sanitize` 方法移除了 `onerror` 事件处理程序，防止了潜在的 XSS 攻击。

### 详细介绍

#### 1. `DOMPurify.sanitize` 方法

`DOMPurify.sanitize` 方法用于清理和消毒 HTML 字符串，移除潜在的恶意代码。它接受两个参数：

- **dirty**：要清理的 HTML 字符串。
- **config**（可选）：配置对象，用于自定义清理行为。

#### 2. 配置选项

`DOMPurify.sanitize` 方法的第二个参数是一个配置对象，可以用来定制清理行为。常见的配置选项包括：

- **ALLOWED_TAGS**：允许的 HTML 标签列表。
- **ALLOWED_ATTR**：允许的 HTML 属性列表。
- **FORBID_TAGS**：禁止的 HTML 标签列表。
- **FORBID_ATTR**：禁止的 HTML 属性列表。
- **RETURN_DOM**：返回清理后的 DOM 对象，而不是字符串。
- **RETURN_DOM_FRAGMENT**：返回清理后的 DOM 片段。
- **RETURN_TRUSTED_TYPE**：返回清理后的 TrustedHTML 对象。
- **SAFE_FOR_TEMPLATES**：允许安全的模板标记。
- **SAFE_FOR_JQUERY**：允许安全的 jQuery 标记。

#### 示例

以下是一些使用配置选项的示例：

```javascript
// 允许的标签和属性
const config = {
  ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a'],
  ALLOWED_ATTR: ['href']
};

const dirtyHTML = '<a href="javascript:alert(1)">Click me</a><b>Bold</b>';
const cleanHTML = DOMPurify.sanitize(dirtyHTML, config);

console.log(cleanHTML); // 输出: <a>Click me</a><b>Bold</b>
```

#### 3. 返回 DOM 对象

你可以配置 `DOMPurify.sanitize` 返回清理后的 DOM 对象，而不是字符串：

```javascript
const dirtyHTML = '<img src="x" onerror="alert(1)">Hello <b>world</b>!';
const cleanDOM = DOMPurify.sanitize(dirtyHTML, { RETURN_DOM: true });

console.log(cleanDOM); // 输出: [object HTMLDivElement]
```

#### 4. 使用 Trusted Types

如果你使用 Trusted Types，可以配置 `DOMPurify.sanitize` 返回 TrustedHTML 对象：

```javascript
const dirtyHTML = '<img src="x" onerror="alert(1)">Hello <b>world</b>!';
const cleanTrustedHTML = DOMPurify.sanitize(dirtyHTML, { RETURN_TRUSTED_TYPE: true });

console.log(cleanTrustedHTML); // 输出: [object TrustedHTML]
```

### 其他功能

#### 1. 清理 DOM 节点

你可以直接清理 DOM 节点，而不是字符串：

```javascript
const dirtyNode = document.createElement('div');
dirtyNode.innerHTML = '<img src="x" onerror="alert(1)">Hello <b>world</b>!';
const cleanNode = DOMPurify.sanitize(dirtyNode);

console.log(cleanNode.innerHTML); // 输出: Hello <b>world</b>!
```

#### 2. 使用钩子

DOMPurify 提供了钩子，可以在清理过程中执行自定义逻辑：

```javascript
DOMPurify.addHook('beforeSanitizeElements', (node, data) => {
  console.log('Before sanitizing element:', node);
});

const dirtyHTML = '<img src="x" onerror="alert(1)">Hello <b>world</b>!';
const cleanHTML = DOMPurify.sanitize(dirtyHTML);

console.log(cleanHTML); // 输出: Hello <b>world</b>!
```

### 总结

`DOMPurify.sanitize` 方法是一个强大的工具，用于清理和消毒 HTML，防止跨站脚本攻击（XSS）。通过配置选项和钩子，你可以定制清理行为，以满足特定需求。无论是清理字符串还是 DOM 节点，`DOMPurify` 都能提供安全可靠的解决方案。
