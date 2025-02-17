`globalCompositeOperation` 是 HTML5 `canvas` API 中的一个属性，用于设置绘图的合成（compositing）方式。它定义了新绘制的图像如何与已经存在的图像进行组合。`globalCompositeOperation` 有多种不同的值，每个值代表一种不同的合成方式。

### `source-in` 合成模式

`source-in` 是 `globalCompositeOperation` 的一种合成模式。它的作用是将新绘制的图像与已经存在的图像进行组合，只保留新绘制图像与已有图像重叠的部分，其他部分会被清除。

#### 具体效果
- **新绘制图像**：只保留与已有图像重叠的部分。
- **已有图像**：只保留与新绘制图像重叠的部分，其他部分会被清除。

### 示例

假设我们有一个已有的矩形和一个新绘制的圆形，使用 `source-in` 合成模式时，只有圆形与矩形重叠的部分会被保留，其他部分会被清除。

#### 代码示例

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Canvas globalCompositeOperation Example</title>
</head>
<body>
  <canvas id="canvas" width="400" height="400" style="border:1px solid #000;"></canvas>
  <script>
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    // 绘制已有的矩形
    ctx.fillStyle = 'blue';
    ctx.fillRect(50, 50, 200, 200);

    // 设置合成模式为 'source-in'
    ctx.globalCompositeOperation = 'source-in';

    // 绘制新绘制的圆形
    ctx.beginPath();
    ctx.arc(150, 150, 100, 0, Math.PI * 2, true);
    ctx.fillStyle = 'red';
    ctx.fill();
  </script>
</body>
</html>
```

#### 解释
1. **绘制已有的矩形**：
   ```javascript
   ctx.fillStyle = 'blue';
   ctx.fillRect(50, 50, 200, 200);
   ```
   - 绘制一个蓝色的矩形，位置在 (50, 50)，宽度和高度为 200 像素。

2. **设置合成模式为 `source-in`**：
   ```javascript
   ctx.globalCompositeOperation = 'source-in';
   ```
   - 设置合成模式为 `source-in`，表示只保留新绘制图像与已有图像重叠的部分。

3. **绘制新绘制的圆形**：
   ```javascript
   ctx.beginPath();
   ctx.arc(150, 150, 100, 0, Math.PI * 2, true);
   ctx.fillStyle = 'red';
   ctx.fill();
   ```
   - 绘制一个红色的圆形，圆心在 (150, 150)，半径为 100 像素。

#### 结果
- 只有红色圆形与蓝色矩形重叠的部分会被保留，其他部分会被清除。

### 在 `downFile` 函数中的应用

在 `downFile` 函数中，`globalCompositeOperation: 'source-in'` 的作用是将临时画布上的图层与底层图层进行合并，只保留重叠的部分。具体来说：

1. **创建临时画布**：
   - 临时画布用于合并除底层外的所有图层，并添加水印。

2. **创建最终画布**：
   - 最终画布用于合并底层图层和临时画布上的图层。

3. **合并图层**：
   - 使用 `source-in` 合成模式，将临时画布上的图层与底层图层进行合并，只保留重叠的部分。

#### 代码片段
```javascript
const tempCanvasImage = new Image();
tempCanvasImage.onload = () => {
  const mergedLayer = new fabric.Image(tempCanvasImage, {
    left: 0,
    top: 0,
    width: bgWidth,
    height: bgHeight,
    globalCompositeOperation: 'source-in', // 设置合成模式为source-in
  });
  finalCanvas.clear();
  finalCanvas.add(clonedBaseLayer);
  finalCanvas.add(mergedLayer);
  finalCanvas.renderAll();
};
tempCanvasImage.src = tempCanvas.toDataURL({ format: 'png' });
```

#### 解释
1. **创建临时画布图像**：
   - 将临时画布的内容转换为图像数据 URL，并创建一个新的图像对象 `tempCanvasImage`。

2. **设置合成模式为 `source-in`**：
   - 创建一个新的图层 `mergedLayer`，使用 `source-in` 合成模式，将临时画布上的图层与底层图层进行合并。

3. **合并图层**：
   - 清除最终画布上的所有对象。
   - 添加底层图层。
   - 添加合并后的图层。
   - 渲染最终画布。

### 总结

`globalCompositeOperation` 是 HTML5 `canvas` API 中的一个属性，用于设置绘图的合成方式。`source-in` 是其中的一种合成模式，表示只保留新绘制图像与已有图像重叠的部分。在 `downFile` 函数中，使用 `source-in` 合成模式将临时画布上的图层与底层图层进行合并，只保留重叠的部分，从而生成最终的导出文件。通过这种方式，可以确保导出文件的正确性和美观性。
