Sass（Syntactically Awesome Stylesheets）是一种高级的CSS预处理器。它扩展了CSS语言，提供了更多功能使得CSS代码更高效、易读和便于管理。以下是关于Sass的详细用法：

---

## 一、Sass 基础语法
Sass有两种语法格式：
1. **`.scss`**（Sassy CSS）：扩展名为`.scss`，类似于CSS，支持大括号和分号。
2. **`.sass`**（缩进语法）：扩展名为`.sass`，无需大括号和分号，使用缩进决定嵌套关系。

以下将以`.scss`为例说明。

---

## 二、Sass 的主要功能和用法

### 1. 变量（Variables）
使用`$`符号定义变量，可以存储颜色、字体大小、宽度等值，从而实现样式的复用和修改。
```scss
// 定义变量
$primary-color: #3498db;
$font-stack: Helvetica, sans-serif;

// 使用变量
body {
  font-family: $font-stack;
  background-color: $primary-color;
}
```

---

### 2. 嵌套（Nesting）
Sass 允许样式规则嵌套，使代码结构更清晰。
```scss
nav {
  ul {
    margin: 0;
    padding: 0;
    list-style: none;
    
    li {
      display: inline-block;
      
      a {
        text-decoration: none;
        color: $primary-color;
      }
    }
  }
}
```

编译后的CSS：
```css
nav ul {
  margin: 0;
  padding: 0;
  list-style: none;
}

nav ul li {
  display: inline-block;
}

nav ul li a {
  text-decoration: none;
  color: #3498db;
}
```

---

### 3. 局部样式 & 父选择器引用
通过嵌套的父选择器（`&`），可以简化伪类和状态选择器规则。
```scss
button {
  padding: 10px 15px;
  background-color: $primary-color;
  
  &:hover {
    background-color: darken($primary-color, 10%);
  }

  &.disabled {
    background-color: gray;
    cursor: not-allowed;
  }
}
```

---

### 4. Partials（部分文件）
Sass支持将代码分割到多个文件，通过`@import`引入。

例如：
- `_variables.scss`
- `_buttons.scss`
  
然后在主文件`main.scss`中引入：
```scss
@import 'variables';
@import 'buttons';
```
> **注意：** 以`_`开头的文件不会单独编译，避免生成多余的文件。

---

### 5. Mixin（混合宏）
Mixin可用于定义复用的样式规则，还支持参数传递。
```scss
@mixin flex-center($direction: row, $gap: 10px) {
  display: flex;
  flex-direction: $direction;
  gap: $gap;
  justify-content: center;
  align-items: center;
}

// 使用Mixin
.container {
  @include flex-center(column, 20px);
}
```

---

### 6. Extend（继承）
通过`@extend`继承已有的选择器样式，避免重复代码。
```scss
%button-style {
  padding: 10px 20px;
  border-radius: 6px;
  background-color: $primary-color;
}

.primary-btn {
  @extend %button-style;
  color: white;
}

.secondary-btn {
  @extend %button-style;
  background-color: gray;
}
```

---

### 7. Sass 函数（Functions）
Sass 提供了许多内置函数，如颜色处理、数学运算等。
#### 常用函数举例：
- `lighten($color, $percentage)`：使颜色更亮
- `darken($color, $percentage)`：使颜色更暗
- `rgb()`, `rgba()`：定义颜色透明度
```scss
.button {
  color: darken($primary-color, 15%);
}
```

同时，你也可以定义自己的函数：
```scss
@function calculate-rem($px) {
  @return $px / 16 * 1rem;
}

// 使用自定义函数
h1 {
  font-size: calculate-rem(24);
}
```

---

### 8. 操作符和插值
Sass支持基本的数学运算和字符串插值。
```scss
$width: 200px;

.container {
  width: $width / 2; // 结果为 100px
}

.background {
  content: "#{$primary-color}";
}
```

---

### 9. 条件与循环
Sass 支持基本的条件语句和循环，提升样式的灵活性。

#### 条件语句：
```scss
@mixin theme($mode) {
  @if $mode == 'dark' {
    background-color: black;
  } @else if $mode == 'light' {
    background-color: white;
  } @else {
    background-color: gray;
  }
}

.header {
  @include theme('dark');
}
```

#### 循环：
```scss
@for $i from 1 through 5 {
  .col-#{$i} {
    width: 20% * $i;
  }
}
```
输出：
```css
.col-1 {
  width: 20%;
}
.col-2 {
  width: 40%;
}
/* 以此类推 */
```

---

### 10. 内置模块 @use 和 @forward
- **`@use`**：在Sass中引入模块。
```scss
// 引入math模块
@use 'sass:math';

.box {
  width: math.round(2.5);
}
```

- **`@forward`**：重新导出模块，用于模块封装。

---

## 三、工具及生态系统
1. **安装工具：**
   - 安装Sass：`npm install -g sass`
   - 编译命令：`sass source.scss output.css`

2. **实时监控文件：**
   ```
   sass --watch input.scss:output.css
   ```

3. **与框架结合：**
   Sass 能很好地与前端框架结合，例如 Bootstrap、TailwindCSS 的定制。

---

通过学习这些功能，你可以大大提升 CSS 的代码效率和可维护性！如果需要演示，可以再详细展开某部分内容。
