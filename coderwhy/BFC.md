好的，以下是所有文字内容的整理，没有遗漏：

**08-你如何理解块级上下文（BFC），并且创建BFC的方法有哪些？**

什么是FC呢？

（图片：头文字D电影剧照，配文“你是斗不过我的FC的 You can't beat my FC”）

FC的全称是Formatting Context，元素在标准流里面都是属于一个FC的；

Boxes in the normal flow belong to a formatting context, which may be block or inline, but not both simultaneously.  `Block-level` boxes participate in a `block formatting` context. `Inline-level boxes` participate in an `inline formatting` context.

块级元素的布局属于Block Formatting Context（BFC）

*   也就是block level box都是在BFC中布局的;

行内级元素的布局属于Inline Formatting Context（IFC）

*   而inline level box都是在IFC中布局的;

block level box都是在BFC中布局的，那么这个BFC在哪里呢？拿出来给我看看。

**9.4.1 Block formatting contexts**

Floats, absolutely positioned elements, block containers (such as inline-blocks, table-cells, and table-captions) that are not block boxes, and block boxes with 'overflow' other than 'visible' (except when that value has been propagated to the viewport) establish new block formatting contexts for their contents.

MDN上有整理出在哪些具体的情况下会创建BFC:

*   根元素（）
*   浮动元素（元素的 float 不是 none）
*   绝对定位元素（元素的 position 为 absolute 或 fixed）
*   行内块元素（元素的 display 为 inline-block）
*   表格单元格（元素的 display 为 table-cell，HTML表格单元格默认认为该值），表格标题（元素的 display 为 table-caption, HTML表格标题默认认为该值）
*   匿名表格单元格元素（元素的 display 为 table、table-row、 table-row-group、table-header-group、table-footer-group（分别是HTML table、row、tbody、thead、tfoot的默认属性）或 inline-table）
*   overflow 计算值(Computed)不为 visible 的块元素
*    弹性元素（display 为 flex 或 inline-flex 元素的直接子元素）
*    网格元素（display 为 grid 或 inline-grid 元素的直接子元素）
*    display 值为 flow-root 的元素

我们来看一下官方文档对BFC作用的描述：

In a block formatting context, boxes are laid out one after the other, vertically, beginning at the top of a containing block. The vertical distance between two sibling boxes is determined by the 'margin' properties. Vertical margins between adjacent block-level boxes in a block formatting context `collapse`.

In a block formatting context, each box's left outer edge touches the left edge of the containing block (for right-to-left formatting, right edges touch). This is true even in the presence of floats (although a box's *line boxes* may shrink due to the floats), unless the box establishes a new block formatting context (in which case the box itself *may become narrower* due to the floats).

简单概况如下：

*   在BFC中，box会在垂直方向上一个挨着一个的排布；
*   垂直方向的间距由margin属性决定；
*   在同一个BFC中，相邻两个box之间的margin会折叠（collapse）；
*   在BFC中，每个元素的左边缘是紧挨着包含块的左边缘的；

**问题一面试回答：**

*   针对BFC网上有特别多的说法，但是都没有解释的很清楚，所以我是专门查过MDN文档的
*   在标准流中，我们所有的盒子，不管是块级盒子还是行内盒子，它们都属于某一个FC（格式化上下文），块级盒子属于BFC（块级格式化上下文），行内级元素属于IFC（行内格式化上下文）。
*   BFC就是用来决定块级盒子是如何排布的
*   在BFC中，块级盒子是一个挨着一个在垂直方向排布的，垂直方向的间距由margin属性决定，并且在同一个BFC中，两个相邻的box之间margin会折叠。
*   这个就是BFC的官方解释。

**问题二面试回答：**

*   创建BFC的方式非常多，要根据不同的场景使用不同的方式。
*   比如HTML元素本身就是创建了一个BFC，浮动元素、绝对定位元素、inline-block、表格元素以及很多子元素都会创建BFC。
*   在开发中我们想要在很多情况下不影响布局创建BFC，比较常用的是将overflow设置为非visible，比如auto就可以创建BFC。

**09-开发中会使用BFC解决哪些问题？它是如何解决的？**

BFC在开发中主要解决两个问题：

*   解决margin的折叠问题；
*   解决浮动高度塌陷问题；
好的，继续整理，以下是所有文字内容的完整版，没有任何遗漏：

**08-你如何理解块级上下文（BFC），并且创建BFC的方法有哪些？**

什么是FC呢？

（图片：头文字D电影剧照，配文“你是斗不过我的FC的 You can't beat my FC”）

FC的全称是Formatting Context，元素在标准流里面都是属于一个FC的；

Boxes in the normal flow belong to a formatting context, which may be block or inline, but not both simultaneously.  `Block-level` boxes participate in a `block formatting` context. `Inline-level boxes` participate in an `inline formatting` context.

块级元素的布局属于Block Formatting Context（BFC）

*   也就是block level box都是在BFC中布局的;

行内级元素的布局属于Inline Formatting Context（IFC）

*   而inline level box都是在IFC中布局的;

block level box都是在BFC中布局的，那么这个BFC在哪里呢？拿出来给我看看。

**9.4.1 Block formatting contexts**

Floats, absolutely positioned elements, block containers (such as inline-blocks, table-cells, and table-captions) that are not block boxes, and block boxes with 'overflow' other than 'visible' (except when that value has been propagated to the viewport) establish new block formatting contexts for their contents.

MDN上有整理出在哪些具体的情况下会创建BFC:

*   根元素（）
*   浮动元素（元素的 float 不是 none）
*   绝对定位元素（元素的 position 为 absolute 或 fixed）
*   行内块元素（元素的 display 为 inline-block）
*   表格单元格（元素的 display 为 table-cell，HTML表格单元格默认认为该值），表格标题（元素的 display 为 table-caption, HTML表格标题默认认为该值）
*   匿名表格单元格元素（元素的 display 为 table、table-row、 table-row-group、table-header-group、table-footer-group（分别是HTML table、row、tbody、thead、tfoot的默认属性）或 inline-table）
*   overflow 计算值(Computed)不为 visible 的块元素
*    弹性元素（display 为 flex 或 inline-flex 元素的直接子元素）
*    网格元素（display 为 grid 或 inline-grid 元素的直接子元素）
*    display 值为 flow-root 的元素

我们来看一下官方文档对BFC作用的描述：

In a block formatting context, boxes are laid out one after the other, vertically, beginning at the top of a containing block. The vertical distance between two sibling boxes is determined by the 'margin' properties. Vertical margins between adjacent block-level boxes in a block formatting context `collapse`.

In a block formatting context, each box's left outer edge touches the left edge of the containing block (for right-to-left formatting, right edges touch). This is true even in the presence of floats (although a box's *line boxes* may shrink due to the floats), unless the box establishes a new block formatting context (in which case the box itself *may become narrower* due to the floats).

简单概况如下：

*   在BFC中，box会在垂直方向上一个挨着一个的排布；
*   垂直方向的间距由margin属性决定；
*   在同一个BFC中，相邻两个box之间的margin会折叠（collapse）；
*   在BFC中，每个元素的左边缘是紧挨着包含块的左边缘的；

**问题一面试回答：**

*   针对BFC网上有特别多的说法，但是都没有解释的很清楚，所以我是专门查过MDN文档的
*   在标准流中，我们所有的盒子，不管是块级盒子还是行内盒子，它们都属于某一个FC（格式化上下文），块级盒子属于BFC（块级格式化上下文），行内级元素属于IFC（行内格式化上下文）。
*   BFC就是用来决定块级盒子是如何排布的
*   在BFC中，块级盒子是一个挨着一个在垂直方向排布的，垂直方向的间距由margin属性决定，并且在同一个BFC中，两个相邻的box之间margin会折叠。
*   这个就是BFC的官方解释。

**问题二面试回答：**

*   创建BFC的方式非常多，要根据不同的场景使用不同的方式。
*   比如HTML元素本身就是创建了一个BFC，浮动元素、绝对定位元素、inline-block、表格元素以及很多子元素都会创建BFC。
*   在开发中我们想要在很多情况下不影响布局创建BFC，比较常用的是将overflow设置为非visible，比如auto就可以创建BFC。

**09-开发中会使用BFC解决哪些问题？它是如何解决的？**

BFC在开发中主要解决两个问题：

*   解决margin的折叠问题；
*   解决浮动高度塌陷问题；

**作用一： 解决margin的折叠问题**

从上面的内容我们可以知道，BFC可以解决BFC的margin折叠的问题，如果两个块级盒子不处于同一个BFC中，那么它们的margin就不会折叠了。

官方文档明确的有说:

*   The vertical distance between two sibling boxes is determined by the 'margin' properties. Vertical margins between adjacent block-level boxes in a block formatting context collapse.

那么如果我们让两个box是不同的BFC呢？ 那么就可以解决折叠问题。

(图片：Before 和 After 的对比，展示 margin 折叠和不折叠的效果)
<img width="393" alt="image" src="https://github.com/user-attachments/assets/d1139e01-eb5c-4967-80a6-e75d7ed5a20c" />

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        .box1,
        .box2 {
            height: 200px;
        }

        .container {
            overflow: auto;
        }
    .box1 {
      background-color: #789;
      margin-bottom: 30px;
    }

    .box2 {
      margin-top: 60px;
      background-color: #18f;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="box1"></div>
  </div>
    <div class="box2"></div>
</body>
</html>
```

**作用二： 解决浮动高度塌陷问题**

网上有很多说法，BFC可以解决浮动高度塌陷，可以实现清除浮动的效果。

*   但是从来没有给出过BFC可以解决高度塌陷的原理或者权威的文档说明；
*   他们也压根没有办法解释，为什么可以解决浮动高度的问题，但是不能解决绝对定位元素的高度塌陷问题呢？

事实上，BFC解决高度塌陷需要满足两个条件：

*   浮动元素的父元素触发BFC，形成独立的块级格式化上下文（Block Formatting Context）；
*   浮动元素的父元素的高度是auto的；

**10.6.7 'Auto' heights for block formatting context roots**

In certain cases (see, e.g., sections `10.6.4` and `10.6.6` above), the height of an element that establishes a block formatting context is computed as follows:

If it only has inline-level children, the height is the distance between the top of the topmost line box and the bottom of the bottommost line box.

If it has block-level children, the height is the distance between the top margin-edge of the topmost block-level child box and the bottom margin-edge of the bottommost block-level child box.

Absolutely positioned children are ignored, and relatively positioned boxes are considered without their offset. Note that the child box may be an `anonymous block box`.

In addition, if the element has any floating descendants whose bottom margin edge is below the element's bottom content edge, then the height is increased to include those edges. Only floats that participate in this block formatting context are taken into account, e.g., floats inside absolutely positioned descendants or other floats are not.

BFC的高度是auto的情况下，是如下方法计算高度的

*   1.如果只有inline-level，是行高的顶部和底部的距离；
*   2.如果有block-level，是由最顶层的块上边缘和最底层块盒子的下边缘之间的距离
*   3.如果有绝对定位元素，将被忽略；
*   4.如果有浮动元素，那么会增加高度以包括这些浮动元素的下边缘

那么也就意味着我们如果让一个高度为auto的元素，变成一个BFC，那么它会增加高度包裹浮动元素的下边缘。

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        .container {
            background-color: #17f;
            overflow: auto;
        }
        .item {
            width: 300px;
            height: 200px;
            background-color: #f71;
            float: left;
            border: 1px solid slateblue;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="item">item1</div>
        <div class="item">item2</div>
        <div class="item">item3</div>
    </div>
</body>
</html>
```
好的，这是最后一部分的文字整理，确保所有内容无遗漏：

**面试题回答：**

*   BFC在开发中主要可以用来解决两个问题：解决margin的折叠问题和解决浮动元素高度塌陷问题。
*   解决margin的折叠问题是通过让两个垂直方向的盒子处于不同的BFC中，因为在同一个BFC会折叠，那么处于不同的BFC时就不会折叠了
*    解决浮动元素高度塌陷问题是源于一个盒子是BFC时，它高度的计算规则，当一个盒子是BFC并且高度设置为auto时，它会在计算高度时要求增加高度以包裹浮动元素的下边缘，那么为了包裹浮动元素的下边缘增加了高度，就不会出现高度塌陷的问题了。
