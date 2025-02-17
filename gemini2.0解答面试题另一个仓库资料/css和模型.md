好的，面试官，关于 CSS 盒模型、盒模型切换以及 `width: 100%` 在不同盒模型下的表现，我将详细解答如下：

**1. CSS 盒模型的两种类型**

CSS 盒模型（Box Model）描述了元素在页面中所占据的空间。它有两种类型：

*   **标准盒模型 (content-box):**
    *   元素的宽度和高度只包括内容区域（content area）。
    *   内边距（padding）、边框（border）和外边距（margin）都会增加元素的总宽度和总高度。
    *   元素的总宽度 = `width` + `padding-left` + `padding-right` + `border-left-width` + `border-right-width`
    *   元素的总高度 = `height` + `padding-top` + `padding-bottom` + `border-top-width` + `border-bottom-width`
    *   这是 W3C 标准推荐的盒模型。

*   **IE 盒模型/怪异盒模型 (border-box):**
    *   元素的宽度和高度包括内容区域、内边距和边框。
    *   外边距不会增加元素的总宽度和总高度。
    *   元素的总宽度 = `width` (包括 content、padding 和 border)
    *   元素的总高度 = `height` (包括 content、padding 和 border)
    *   内容区域的宽度 = `width` - `padding-left` - `padding-right` - `border-left-width` - `border-right-width`
    *   内容区域的高度 = `height` - `padding-top` - `padding-bottom` - `border-top-width` - `border-bottom-width`
    *   这是 IE 浏览器在 Quirks 模式下使用的盒模型。

**2. 如何切换盒模型**

可以使用 CSS 的 `box-sizing` 属性来切换盒模型：

```css
/* 标准盒模型 (默认值) */
.element {
  box-sizing: content-box;
}

/* IE 盒模型/怪异盒模型 */
.element {
  box-sizing: border-box;
}
```

*   **`box-sizing: content-box;` (默认值):** 使用标准盒模型。
*   **`box-sizing: border-box;`:** 使用 IE 盒模型/怪异盒模型。

**3. `width: 100%` 在不同盒模型下的表现**

当一个父 div 设置了 `width: 100%` 时，它的宽度在不同盒模型下的表现如下：

*   **标准盒模型 (content-box):**
    *   `width: 100%` 表示父 div 的内容区域（content area）的宽度等于其包含块（containing block）的宽度。
    *   如果父 div 有内边距或边框，那么父 div 的总宽度会超出其包含块的宽度。

    ```html
    <div style="width: 300px;">
      <div style="width: 100%; padding: 10px; border: 1px solid black; box-sizing: content-box;">
        Content
      </div>
    </div>
    ```

    在这个例子中，内部 div 的内容区域宽度为 300px，但其总宽度为 300px + 20px (padding) + 2px (border) = 322px。

*   **IE 盒模型/怪异盒模型 (border-box):**
    *   `width: 100%` 表示父 div 的总宽度（包括内容区域、内边距和边框）等于其包含块的宽度。
    *   父 div 的内容区域宽度会自动调整，以适应 `width: 100%` 的设置。

    ```html
    <div style="width: 300px;">
      <div style="width: 100%; padding: 10px; border: 1px solid black; box-sizing: border-box;">
        Content
      </div>
    </div>
    ```

    在这个例子中，内部 div 的总宽度为 300px，其内容区域宽度为 300px - 20px (padding) - 2px (border) = 278px。

**4. 包含块 (Containing Block)**

元素的包含块决定了元素的定位和大小。以下是一些常见的包含块：

*   **根元素（`<html>`）的包含块：** 通常是视口（viewport）。
*   **非根元素的包含块：**
    *   如果元素的 `position` 属性是 `static` 或 `relative`，则包含块是其最近的块级祖先元素（如 `<div>`、`<p>`）或格式化上下文（formatting context）创建者。
    *   如果元素的 `position` 属性是 `absolute`，则包含块是其最近的 `position` 属性不为 `static` 的祖先元素。
    *   如果元素的 `position` 属性是 `fixed`，则包含块是视口。
    *   如果元素的`position`属性是`sticky`，则包含块是最近的滚动祖先。

**5. 最佳实践与建议**

*   **全局设置 `box-sizing: border-box;`：**
    *   由于 `border-box` 更符合直觉，且在响应式设计中更易于控制，许多开发者推荐全局设置 `box-sizing: border-box;`：

        ```css
        html {
          box-sizing: border-box;
        }

        *,
        *::before,
        *::after {
          box-sizing: inherit;
        }
        ```

    *   这样，所有元素默认都会使用 `border-box`，除非显式地覆盖。
*   **理解包含块：** 在设置 `width: 100%` 时，要清楚元素的包含块是什么，以确保元素的大小符合预期。
*   **避免混用不同的盒模型：** 在同一个项目中，尽量保持一致的盒模型设置，避免混用 `content-box` 和 `border-box`，以减少混乱和潜在的问题。

**总结**

CSS 盒模型有两种类型：标准盒模型（`content-box`）和 IE 盒模型/怪异盒模型（`border-box`）。可以使用 `box-sizing` 属性来切换盒模型。`width: 100%` 在不同盒模型下的表现不同：在标准盒模型下，`width: 100%` 指的是内容区域的宽度；在 IE 盒模型下，`width: 100%` 指的是总宽度（包括内容区域、内边距和边框）。全局设置 `box-sizing: border-box;` 是一种常见的最佳实践。理解盒模型和包含块的概念对于精确控制元素的大小和布局至关重要。
