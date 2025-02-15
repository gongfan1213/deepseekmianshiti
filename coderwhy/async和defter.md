以下是图片中内容的文字整理，包括代码部分：

---

### 03-defer和async属性在script标签中分别有什么作用？

浏览器在解析HTML的过程中，遇到了script元素是不能继续构建DOM树的：

- 它会停止继续构建，首先下载JavaScript代码，并且执行JavaScript的脚本；
- 只有等到JavaScript脚本执行结束后，才会继续解析HTML，构建DOM树；

**为什么这样做呢？**

- 这是因为JavaScript的作用之一就是操作DOM，并且可以修改DOM；
- 如果我们等到DOM树构建完成并且渲染再执行JavaScript，会造成严重的回流和重绘，影响页面的性能；
- 所以会在遇到script元素时，优先下载和执行JavaScript代码，再继续构建DOM树。

但是这个也往往会带来新的问题，特别是现代网页开发中：

- 在目前的开发模式中（比如Vue、React），脚本往往比HTML页面更“重”，处理时间需要更长；
- 所以会造成页面的解析阻塞，在脚本下载、执行完成之前，用户在界面上什么都看不到；

为了解决这个问题，script元素给我们提供了两个属性（attribute）：**defer**和**async**。

---

### defer的作用

`defer`属性告诉浏览器不要等待脚本下载，而继续解析HTML，构建DOM Tree。

- 脚本会由浏览器来进行下载，但是不会阻塞DOM Tree的构建过程；
- 如果脚本提前下载好了，它会等待DOM Tree构建完成，在DOMContentLoaded事件之前先执行defer中的代码；

所以DOMContentLoaded总是会等待defer中的代码先执行完成。

```html
<script defer src="./js/defer-demo.js"></script>
<script>
  window.addEventListener("DOMContentLoaded", () => {
    console.log("DOMContentLoaded");
  });
</script>
```

**特点：**
- 另外多个带defer的脚本是可以保持正确的顺序执行的；
- 从某种角度来说，defer可以提高页面的性能，并且推荐放到`<head>`元素中。

---

### async的作用

`async`特性与defer有些类似，它也能够让脚本不阻塞页面。

**区别：**
- async是让一个脚本的下载和执行是**独立**的：
  - 浏览器不会因async脚本的下载而阻止DOM的构建（与defer类似）；
  - async脚本会在下载好后立即执行，不能保证在DOMContentLoaded之前或者之后执行（执行时会阻塞DOM Tree的构建）；
  - async脚本不能保证顺序，它是独立下载、独立运行，不会等待其他脚本；

```html
<script>
  window.addEventListener("DOMContentLoaded", () => {
    console.log("DOMContentLoaded");
  });
</script>
<script async src="./js/async-demo.js"></script>
```

---

### 具体的执行时机

以下是`<script>`标签的执行时机对比：

- 普通`<script>`：会阻塞HTML解析，下载和执行脚本后再继续解析HTML；
- `<script defer>`：不会阻塞HTML解析，脚本会在DOMContentLoaded事件之前按顺序执行；
- `<script async>`：不会阻塞HTML解析，脚本下载完成后立即执行，顺序不确定。
<img width="741" alt="image" src="https://github.com/user-attachments/assets/25c1a42b-05e4-4b74-9178-4eeea8403ebc" />

---

### 面试回答

`<script>`标签的`defer`和`async`属性用来控制外部脚本文件的加载和执行方式，它们对于改善页面加载速度非常有帮助。

**区别：**
- `defer`的下载不会阻止DOM的构建，但是在DOM Tree构建完成后，在DOMContentLoaded事件之前，先执行脚本的内容，并且defer脚本的执行是有序的。
- `async`的下载不会阻止DOM的构建，而且不会保证在DOMContentLoaded之前或者之后执行，也不能保证顺序，它的每个脚本是独立进行的。

**应用场景：**
- `defer`通常用于需要在文档解析后操作DOM的JavaScript代码，并且对多个script文件有顺序要求的；
- `async`通常用于独立的脚本，对其他脚本、甚至对DOM没有依赖的脚本；

在现代化框架开发过程中，往往不需要我们自己配置async或者defer，在使用手动或者自己搭建的webpack或者vite项目进行打包时，它会根据需要帮我们加上defer属性，某些情况下我们进行性能优化时，也可以手动的加上async属性（例如一些三方的分析工具或者广告追踪脚本）。

--- 

以上是整理后的完整内容，包括代码部分。
