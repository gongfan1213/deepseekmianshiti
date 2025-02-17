OpenCV.js 是 OpenCV 的 JavaScript 版本，提供了与 OpenCV C++ 类似的 API，用于在浏览器中进行图像处理和计算机视觉任务。以下是 OpenCV.js 中常见的 API 及其详细讲解，包括功能、参数和示例代码。

---

## **1. OpenCV.js 的基本概念**

- **`cv.Mat`**：OpenCV.js 中的核心数据结构，用于表示图像或矩阵。
- **`cv.MatVector`**：用于存储多个 `cv.Mat` 对象的容器。
- **`cv.Scalar`**：表示颜色或标量值。
- **`cv.Size`**：表示尺寸（宽度和高度）。

---

## **2. 常见的 OpenCV.js API**

### **2.1 图像读取和显示**

#### **`cv.imread(canvas)`**
- **功能**：从 HTML `<canvas>` 元素中读取图像数据，并将其转换为 `cv.Mat` 对象。
- **参数**：
  - `canvas`：HTML `<canvas>` 元素。
- **返回值**：`cv.Mat` 对象。
- **示例**：
  ```javascript
  let img = cv.imread('canvasId'); // 从 canvas 读取图像
  ```

#### **`cv.imshow(canvas, mat)`**
- **功能**：将 `cv.Mat` 对象显示到 HTML `<canvas>` 元素中。
- **参数**：
  - `canvas`：HTML `<canvas>` 元素。
  - `mat`：`cv.Mat` 对象。
- **示例**：
  ```javascript
  cv.imshow('canvasId', img); // 将图像显示到 canvas
  ```

---

### **2.2 图像颜色转换**

#### **`cv.cvtColor(src, dst, code)`**
- **功能**：转换图像的颜色空间。
- **参数**：
  - `src`：源图像（`cv.Mat`）。
  - `dst`：目标图像（`cv.Mat`）。
  - `code`：颜色转换代码，例如：
    - `cv.COLOR_RGBA2GRAY`：将 RGBA 转换为灰度。
    - `cv.COLOR_BGR2HSV`：将 BGR 转换为 HSV。
- **示例**：
  ```javascript
  let gray = new cv.Mat();
  cv.cvtColor(img, gray, cv.COLOR_RGBA2GRAY); // 转换为灰度图像
  ```

---

### **2.3 图像几何变换**

#### **`cv.resize(src, dst, dsize, fx, fy, interpolation)`**
- **功能**：调整图像大小。
- **参数**：
  - `src`：源图像。
  - `dst`：目标图像。
  - `dsize`：目标尺寸（`cv.Size`）。
  - `fx`：宽度缩放因子。
  - `fy`：高度缩放因子。
  - `interpolation`：插值方法，例如 `cv.INTER_LINEAR`。
- **示例**：
  ```javascript
  let resized = new cv.Mat();
  cv.resize(img, resized, new cv.Size(200, 200), 0, 0, cv.INTER_LINEAR);
  ```

#### **`cv.warpAffine(src, dst, M, dsize)`**
- **功能**：对图像进行仿射变换。
- **参数**：
  - `src`：源图像。
  - `dst`：目标图像。
  - `M`：仿射变换矩阵。
  - `dsize`：目标尺寸。
- **示例**：
  ```javascript
  let M = cv.getRotationMatrix2D(new cv.Point(100, 100), 45, 1); // 旋转矩阵
  cv.warpAffine(img, dst, M, new cv.Size(200, 200));
  ```

---

### **2.4 图像滤波**

#### **`cv.GaussianBlur(src, dst, ksize, sigmaX, sigmaY, borderType)`**
- **功能**：对图像进行高斯模糊。
- **参数**：
  - `src`：源图像。
  - `dst`：目标图像。
  - `ksize`：高斯核大小（`cv.Size`）。
  - `sigmaX`：X 方向的标准差。
  - `sigmaY`：Y 方向的标准差（默认为 0）。
  - `borderType`：边界类型（默认为 `cv.BORDER_DEFAULT`）。
- **示例**：
  ```javascript
  cv.GaussianBlur(img, dst, new cv.Size(5, 5), 0, 0, cv.BORDER_DEFAULT);
  ```

#### **`cv.medianBlur(src, dst, ksize)`**
- **功能**：对图像进行中值滤波。
- **参数**：
  - `src`：源图像。
  - `dst`：目标图像。
  - `ksize`：滤波器大小（必须为奇数）。
- **示例**：
  ```javascript
  cv.medianBlur(img, dst, 5);
  ```

---

### **2.5 边缘检测**

#### **`cv.Canny(src, dst, threshold1, threshold2, apertureSize, L2gradient)`**
- **功能**：使用 Canny 算法检测图像边缘。
- **参数**：
  - `src`：源图像（灰度图像）。
  - `dst`：目标图像。
  - `threshold1`：低阈值。
  - `threshold2`：高阈值。
  - `apertureSize`：Sobel 算子的大小（默认为 3）。
  - `L2gradient`：是否使用更精确的 L2 范数。
- **示例**：
  ```javascript
  cv.Canny(gray, edges, 50, 150, 3, false);
  ```

---

### **2.6 图像形态学操作**

#### **`cv.dilate(src, dst, kernel, anchor, iterations, borderType, borderValue)`**
- **功能**：对图像进行膨胀操作。
- **参数**：
  - `src`：源图像。
  - `dst`：目标图像。
  - `kernel`：结构元素。
  - `anchor`：锚点（默认为 `new cv.Point(-1, -1)`）。
  - `iterations`：膨胀次数。
- **示例**：
  ```javascript
  let kernel = cv.Mat.ones(5, 5, cv.CV_8U);
  cv.dilate(img, dst, kernel);
  ```

#### **`cv.erode(src, dst, kernel, anchor, iterations, borderType, borderValue)`**
- **功能**：对图像进行腐蚀操作。
- **参数**：
  - 同 `cv.dilate`。
- **示例**：
  ```javascript
  cv.erode(img, dst, kernel);
  ```

#### **`cv.morphologyEx(src, dst, op, kernel, anchor, iterations, borderType, borderValue)`**
- **功能**：对图像进行形态学操作（如开运算、闭运算）。
- **参数**：
  - `op`：操作类型，例如 `cv.MORPH_OPEN`、`cv.MORPH_CLOSE`。
- **示例**：
  ```javascript
  cv.morphologyEx(img, dst, cv.MORPH_OPEN, kernel);
  ```

---

### **2.7 图像轮廓检测**

#### **`cv.findContours(src, contours, hierarchy, mode, method)`**
- **功能**：检测图像中的轮廓。
- **参数**：
  - `src`：二值图像。
  - `contours`：存储轮廓的数组。
  - `hierarchy`：存储层次结构的数组。
  - `mode`：轮廓检索模式，例如 `cv.RETR_TREE`。
  - `method`：轮廓近似方法，例如 `cv.CHAIN_APPROX_SIMPLE`。
- **示例**：
  ```javascript
  let contours = new cv.MatVector();
  let hierarchy = new cv.Mat();
  cv.findContours(edges, contours, hierarchy, cv.RETR_TREE, cv.CHAIN_APPROX_SIMPLE);
  ```

#### **`cv.drawContours(src, contours, contourIdx, color, thickness, lineType, hierarchy, maxLevel, offset)`**
- **功能**：绘制轮廓。
- **参数**：
  - `contourIdx`：要绘制的轮廓索引（-1 表示绘制所有轮廓）。
- **示例**：
  ```javascript
  cv.drawContours(img, contours, -1, new cv.Scalar(255, 0, 0), 2);
  ```

---

### **2.8 图像数学运算**

#### **`cv.addWeighted(src1, alpha, src2, beta, gamma, dst)`**
- **功能**：对两幅图像进行加权求和。
- **参数**：
  - `src1`、`src2`：两幅源图像。
  - `alpha`、`beta`：权重。
  - `gamma`：加到结果上的常数。
- **示例**：
  ```javascript
  cv.addWeighted(img1, 0.5, img2, 0.5, 0, dst);
  ```

---

### **2.9 图像通道操作**

#### **`cv.split(src, mv)`**
- **功能**：将图像的通道分离为多个单通道图像。
- **参数**：
  - `src`：源图像。
  - `mv`：`cv.MatVector` 对象，用于存储分离的通道。
- **示例**：
  ```javascript
  let channels = new cv.MatVector();
  cv.split(img, channels);
  ```

#### **`cv.merge(mv, dst)`**
- **功能**：将多个单通道图像合并为一个多通道图像。
- **参数**：
  - `mv`：`cv.MatVector` 对象。
  - `dst`：目标图像。
- **示例**：
  ```javascript
  cv.merge(channels, dst);
  ```

---

### **2.10 图像归一化**

#### **`cv.normalize(src, dst, alpha, beta, normType, dtype, mask)`**
- **功能**：对图像进行归一化处理。
- **参数**：
  - `alpha`、`beta`：归一化范围。
  - `normType`：归一化类型，例如 `cv.NORM_MINMAX`。
- **示例**：
  ```javascript
  cv.normalize(img, dst, 0, 255, cv.NORM_MINMAX);
  ```

---

## **3. 总结**

OpenCV.js 提供了丰富的 API，涵盖了图像处理的各个方面。以下是常见的使用场景和对应的 API：
1. **图像读取和显示**：`cv.imread`、`cv.imshow`。
2. **颜色转换**：`cv.cvtColor`。
3. **几何变换**：`cv.resize`、`cv.warpAffine`。
4. **滤波**：`cv.GaussianBlur`、`cv.medianBlur`。
5. **边缘检测**：`cv.Canny`。
6. **形态学操作**：`cv.dilate`、`cv.erode`、`cv.morphologyEx`。
7. **轮廓检测**：`cv.findContours`、`cv.drawContours`。
8. **数学运算**：`cv.addWeighted`。
9. **通道操作**：`cv.split`、`cv.merge`。
10. **归一化**：`cv.normalize`。

通过熟悉这些 API，你可以在浏览器中实现强大的图像处理和计算机视觉功能。如果有具体问题或需求，可以随时提问！
