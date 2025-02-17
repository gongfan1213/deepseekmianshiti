好的，面试官。在移动端，由于设备像素比（DPR）的存在，直接设置 CSS 的 `border: 1px solid #ccc;` 可能会导致在 Retina 屏幕上显示为 2px 或更粗的边框。下面我将介绍几种利用物理像素和逻辑像素来绘制 1px 分割线的方法：

**1. 使用 `transform: scaleY()`**

*   **原理：** 将元素的高度设置为 1px，然后使用 `transform: scaleY(0.5)` 将其在 Y 轴方向上缩小一半（假设 DPR 为 2）。这样，在视觉上，这条线就只有 0.5 个物理像素的高度，但在 DPR 为 2 的屏幕上，0.5 个物理像素实际上对应 1 个 CSS 像素，因此看起来就是 1px 的细线。
*   **优点：** 实现简单，兼容性好。
*   **缺点：** 在某些情况下，可能会导致线条颜色变浅。

```css
.line {
  height: 1px;
  background-color: #ccc;
  transform: scaleY(0.5); /* 假设 DPR 为 2 */
  transform-origin: 0 0;
}
```

**通用写法：**

```css
.line {
    position: relative;
    border: none;
    height: 1px;
}

.line::after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 1px;
    background-color: #ccc;
    transform-origin: 0 0;
}

@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 2dppx) {
    .line::after {
        transform: scaleY(0.5);
    }
}

@media (-webkit-min-device-pixel-ratio: 3), (min-resolution: 3dppx) {
    .line::after {
        transform: scaleY(0.333);
    }
}
```
* **解释**:
    *   使用伪元素 `::after` 来创建分割线，避免影响原有元素的样式。
    *   使用媒体查询 `@media` 来针对不同的 DPR 应用不同的缩放比例。
    *   `-webkit-min-device-pixel-ratio` 是旧版的媒体查询属性，`min-resolution` 是新版的属性，都用于检测 DPR。
    *   `dppx` 是 CSS 中的一个单位，表示每像素的点数（dots per pixel），等同于 DPR。

**2. 使用 viewport + rem**

*   **原理：**
    *   将 `viewport` 的 `initial-scale` 设置为 `1 / DPR`，这样可以使 1 个 CSS 像素对应 1 个物理像素。
    *   使用 `rem` 单位来设置边框宽度，`1rem` 等于根元素（`<html>`）的字体大小。
    *   通过 JavaScript 动态计算根元素的字体大小，使其等于 `1 / DPR`。
*   **优点：** 可以实现真正的 1px 边框。
*   **缺点：** 需要 JavaScript 代码配合，实现相对复杂。

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<div class="line"></div>

<script>
  const dpr = window.devicePixelRatio || 1;
  const scale = 1 / dpr;
  const viewport = document.querySelector('meta[name="viewport"]');
  viewport.setAttribute('content', `width=device-width, initial-scale=${scale}, maximum-scale=${scale}, minimum-scale=${scale}, user-scalable=no`);
  document.documentElement.style.fontSize = dpr + 'px';
</script>

<style>
  .line {
    border-bottom: 1rem solid #ccc;
  }
</style>
```

**3. 使用 background-image 渐变**

*   **原理：** 使用 `background-image` 创建一个线性渐变，渐变的起始颜色和结束颜色相同，但只在中间的 1px 位置显示颜色，其余部分透明。
*   **优点：** 实现简单，兼容性好。
*   **缺点：** 只能实现水平或垂直的直线，不能实现圆角边框。

```css
.line {
  background-image: linear-gradient(180deg, transparent, transparent 50%, #ccc 50%, #ccc);
  background-size: 100% 1px;
  background-repeat: no-repeat;
  background-position: bottom;
}
```

**4. 使用 box-shadow**

*   **原理：** 使用 `box-shadow` 的 `inset` 阴影来模拟边框，将阴影的扩展半径设置为 `-1px`，模糊半径设置为 `0`，颜色设置为边框颜色。
*   **优点：** 实现简单，兼容性好，可以实现圆角边框。
*   **缺点：** 在某些情况下，可能会导致线条颜色变浅。

```css
.line {
  box-shadow: inset 0 -1px 0 0 #ccc;
}
```
通用写法：
```css
@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 2dppx) {
    .line {
        box-shadow: inset 0px -0.5px 0px 0px #ccc;
    }
}

@media (-webkit-min-device-pixel-ratio: 3), (min-resolution: 3dppx) {
    .line {
        box-shadow: inset 0px -0.333333px 0px 0px #ccc;
    }
}
```
* **解释**:
    *   在DPR为2的设备上，将阴影的垂直偏移设置为-0.5px，这样在视觉上看起来就像是1px的边框。
    *   在DPR为3的设备上，将阴影的垂直偏移设置为-0.333333px，同样在视觉上呈现为1px的边框。

**5. 使用 SVG**

*   **原理：** 使用 SVG 创建一个 1px 宽度的线条。
*   **优点：** 可以实现真正的 1px 边框，且可以绘制各种形状的线条。
*   **缺点：** 实现相对复杂，需要编写 SVG 代码。

```html
<svg width="100%" height="1">
  <line x1="0" y1="0" x2="100%" y2="0" stroke="#ccc" stroke-width="1" />
</svg>
```

**总结：**

以上是几种常见的在移动端绘制 1px 分割线的方法。每种方法都有其优缺点，可以根据实际需求选择合适的方法。

*   **最常用：** `transform: scaleY()`，实现简单，兼容性好。
*   **最精确：** viewport + rem，可以实现真正的 1px 边框，但实现复杂。
*   **最灵活：** SVG，可以绘制各种形状的线条，但需要编写 SVG 代码。

希望这个回答能够满足您的要求。如果您还有其他问题，请随时提出。
