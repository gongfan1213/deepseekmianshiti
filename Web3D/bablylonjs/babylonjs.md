

## **什么是 Babylon.js？**
**Babylon.js** 是一个基基于 JavaScript 的开源 3D 渲染引擎，专门用于在 Web 浏览器中创建 3D 图形和场景。它使用 WebGL 技术来渲染 3D 内容，并且支持现代浏览器。

### **Babylon.js 的特点**
1. **开源**：完全免费，代码托管在 GitHub 上。
2. **跨平台**：支持所有现代浏览器（Chrome、Firefox、Edge 等），并且可以在桌面和移动设备上运行。
3. **强大的功能**：
   - 支持 3D 模型加载（如 `.glb`、`.gltf` 文件）。
   - 支持光照、材质、阴影、粒子系统等高级效果。
   - 支持虚拟现实 (VR) 和增强现实 (AR)。
4. **易于学习**：提供了丰富的文档和示例，适合新手学习。

---

## **第一步：如何开始使用 Babylon.js？**

### **1. 准备开发环境**
要使用 Babylon.js，你只需要一个现代浏览器和一个代码编辑器（如 VS Code）。以下是两种常见的使用方式：

#### **方式 1：通过 CDN 引入 Babylon.js**
这是最简单的方式，适合新手快速上手。你只需要在 HTML 文件中引入 Babylon.js 的 CDN 链接。

```html
<script src="https://cdn.babylonjs.com/babylon.js"></script>
```

#### **方式 2：使用 npm 安装**
如果你熟悉 Node.js 和 npm，可以通过 npm 安装 Babylon.js：

```bash
npm install babylonjs
```

---

### **2. 创建一个简单的 HTML 文件**
我们从一个最简单的 Babylon.js 场景开始。以下是一个完整的 HTML 文件，它会在浏览器中显示一个空白的 3D 场景。

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Babylon.js 初体验</title>
    <script src="https://cdn.babylonjs.com/babylon.js"></script>
</head>
<body>
    <!-- 创建一个用于渲染 3D 场景的画布 -->
    <canvas id="renderCanvas" style="width: 100%; height: 100%;"></canvas>

    <script>
        // 1. 获取画布元素
        const canvas = document.getElementById("renderCanvas");

        // 2. 创建 Babylon.js 引擎
        const engine = new BABYLON.Engine(canvas, true);

        // 3. 创建场景
        const createScene = function () {
            const scene = new BABYLON.Scene(engine);

            // 4. 添加一个摄像机
            const camera = new BABYLON.ArcRotateCamera("camera", Math.PI / 2, Math.PI / 2, 10, BABYLON.Vector3.Zero(), scene);
            camera.attachControl(canvas, true);

            // 5. 添加一个光源
            const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

            // 6. 添加一个立方体
            const box = BABYLON.MeshBuilder.CreateBox("box", {}, scene);

            return scene;
        };

        // 创建场景
        const scene = createScene();

        // 渲染循环
        engine.runRenderLoop(function () {
            scene.render();
        });

        // 监听窗口大小变化
        window.addEventListener("resize", function () {
            engine.resize();
        });
    </script>
</body>
</html>
```

---

### **3. 代码讲解**
上面的代码是一个最简单的 Babylon.js 示例，以下是每一部分的详细解释：

#### **1. 获取画布元素**
```javascript
const canvas = document.getElementById("renderCanvas");
```
- Babylon.js 需要一个 `<canvas>` 元素来渲染 3D 场景。
- 我们通过 `document.getElementById` 获取 HTML 中的 `<canvas>` 元素。

#### **2. 创建 Babylon.js 引擎**
```javascript
const engine = new BABYLON.Engine(canvas, true);
```
- `BABYLON.Engine` 是 Babylon.js 的核心，它负责管理渲染和场景更新。
- 第一个参数是画布元素，第二个参数 `true` 表示启用抗锯齿。

#### **3. 创建场景**
```javascript
const scene = new BABYLON.Scene(engine);
```
- `BABYLON.Scene` 是 Babylon.js 中的核心对象，用于管理 3D 对象、光源、摄像机等。

#### **4. 添加摄像机**
```javascript
const camera = new BABYLON.ArcRotateCamera("camera", Math.PI / 2, Math.PI / 2, 10, BABYLON.Vector3.Zero(), scene);
camera.attachControl(canvas, true);
```
- `ArcRotateCamera` 是一种可以围绕目标旋转的摄像机。
- 参数解释：
  - `"camera"`：摄像机的名称。
  - `Math.PI / 2`：摄像机的水平角度。
  - `Math.PI / 2`：摄像机的垂直角度。
  - `10`：摄像机与目标的距离。
  - `BABYLON.Vector3.Zero()`：摄像机的目标点（这里是原点）。
- `camera.attachControl(canvas, true)`：允许用户通过鼠标或触摸控制摄像机。

#### **5. 添加光源**
```javascript
const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
```
- `HemisphericLight` 是一种环境光源，用于照亮场景。
- 参数解释：
  - `"light"`：光源的名称。
  - `new BABYLON.Vector3(0, 1, 0)`：光源的方向（从上往下照射）。

#### **6. 添加一个立方体**
```javascript
const box = BABYLON.MeshBuilder.CreateBox("box", {}, scene);
```
- `MeshBuilder.CreateBox` 用于创建一个立方体。
- 参数解释：
  - `"box"`：立方体的名称。
  - `{}`：立方体的配置（这里使用默认值）。
  - `scene`：将立方体添加到的场景。

#### **7. 渲染循环**
```javascript
engine.runRenderLoop(function () {
    scene.render();
});
```
- `engine.runRenderLoop` 是 Babylon.js 的渲染循环，它会不断调用 `scene.render()` 来更新场景。

#### **8. 监听窗口大小变化**
```javascript
window.addEventListener("resize", function () {
    engine.resize();
});
```
- 当窗口大小发生变化时，调整引擎的大小以适应新的画布尺寸。

---

### **4. 运行代码**
1. 将上述代码保存为一个 HTML 文件（例如 `index.html`）。
2. 用浏览器打开文件。
3. 你会看到一个可以旋转的 3D 立方体！

---

### **下一步学习方向**
1. **深入了解 Mesh（网格）**：学习如何创建更多形状（球体、平面等）。
2. **材质和纹理**：为 3D 对象添加颜色、纹理和反射效果。
3. **光照系统**：探索不同类型的光源（点光源、聚光灯等）。
4. **加载 3D 模型**：学习如何加载 `.glb` 或 `.gltf` 文件。
5. **交互**：添加鼠标点击或键盘控制。

---

如果你有任何问题，或者想深入了解某一部分，请随时告诉我！ 😊
