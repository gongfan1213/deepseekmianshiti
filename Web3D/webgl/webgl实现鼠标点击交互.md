在 WebGL 中实现鼠标点击交互（如点击 3D 对象）需要结合 **鼠标事件监听** 和 **射线投射（Raycasting）** 技术。由于 WebGL 本身是一个低级 API，它并没有直接提供鼠标点击检测的功能，因此我们需要手动实现以下步骤：

---

## 实现鼠标点击的基本步骤

1. **捕获鼠标点击事件**：
   - 使用 HTML 的鼠标事件（如 `mousedown` 或 `click`）获取鼠标点击的位置。

2. **将鼠标点击的屏幕坐标转换为 WebGL 的世界坐标**：
   - 鼠标点击的位置是屏幕坐标（像素单位），需要将其转换为 WebGL 的标准化设备坐标（NDC，范围为 `[-1, 1]`）。

3. **生成射线（Ray）**：
   - 根据鼠标点击的 NDC 坐标和摄像机的视图矩阵，生成一条射线。

4. **检测射线与 3D 对象的碰撞**：
   - 使用射线投射算法，判断射线是否与场景中的 3D 对象相交。

5. **处理点击事件**：
   - 如果射线与某个对象相交，则触发相应的点击事件。

---

## 详细实现步骤

### 1. **捕获鼠标点击事件**

在 HTML 中监听鼠标事件，并获取鼠标点击的屏幕坐标。

#### 示例代码：
```javascript
canvas.addEventListener('mousedown', (event) => {
  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left; // 鼠标在 canvas 内的 X 坐标
  const mouseY = event.clientY - rect.top;  // 鼠标在 canvas 内的 Y 坐标
  handleMouseClick(mouseX, mouseY);
});
```

---

### 2. **屏幕坐标转换为标准化设备坐标（NDC）**

WebGL 的坐标范围是 `[-1, 1]`，而鼠标点击的屏幕坐标是以像素为单位的。需要将屏幕坐标转换为 NDC。

#### 转换公式：
```javascript
const ndcX = (mouseX / canvas.width) * 2 - 1;
const ndcY = -((mouseY / canvas.height) * 2 - 1); // Y 轴需要反转
```

---

### 3. **生成射线（Ray）**

射线的生成需要结合摄像机的视图矩阵和投影矩阵。以下是生成射线的步骤：

#### 3.1 **从 NDC 转换到世界坐标**
- 使用摄像机的逆投影矩阵和逆视图矩阵，将 NDC 坐标转换为世界坐标。
- 射线的起点是摄像机的位置，方向是从摄像机指向鼠标点击位置的方向。

#### 示例代码：
```javascript
function generateRay(ndcX, ndcY, camera) {
  // 逆投影矩阵
  const inverseProjectionMatrix = mat4.create();
  mat4.invert(inverseProjectionMatrix, camera.projectionMatrix);

  // 逆视图矩阵
  const inverseViewMatrix = mat4.create();
  mat4.invert(inverseViewMatrix, camera.viewMatrix);

  // NDC 坐标转换为裁剪空间坐标
  const clipCoords = [ndcX, ndcY, -1.0, 1.0];

  // 裁剪空间坐标转换为眼睛空间坐标
  const eyeCoords = vec4.transformMat4([], clipCoords, inverseProjectionMatrix);
  eyeCoords[2] = -1.0; // 设置方向为 -1
  eyeCoords[3] = 0.0;  // 设置为方向向量

  // 眼睛空间坐标转换为世界坐标
  const worldCoords = vec4.transformMat4([], eyeCoords, inverseViewMatrix);

  // 射线的起点和方向
  const rayOrigin = camera.position; // 摄像机位置
  const rayDirection = vec3.normalize([], [worldCoords[0], worldCoords[1], worldCoords[2]]);

  return { origin: rayOrigin, direction: rayDirection };
}
```

---

### 4. **检测射线与 3D 对象的碰撞**

射线投射的核心是判断射线是否与 3D 对象（如三角形、球体、立方体等）相交。以下是常见的碰撞检测方法：

#### 4.1 **射线与三角形相交**
- 使用 **Möller–Trumbore 算法** 判断射线是否与三角形相交。
- 该算法高效且适合 WebGL 中的三角形网格。

#### 示例代码：
```javascript
function rayIntersectsTriangle(ray, triangle) {
  const { origin, direction } = ray;
  const [v0, v1, v2] = triangle; // 三角形的三个顶点

  const edge1 = vec3.subtract([], v1, v0);
  const edge2 = vec3.subtract([], v2, v0);

  const h = vec3.cross([], direction, edge2);
  const a = vec3.dot(edge1, h);

  if (Math.abs(a) < 1e-6) return false; // 射线平行于三角形

  const f = 1.0 / a;
  const s = vec3.subtract([], origin, v0);
  const u = f * vec3.dot(s, h);

  if (u < 0.0 || u > 1.0) return false;

  const q = vec3.cross([], s, edge1);
  const v = f * vec3.dot(direction, q);

  if (v < 0.0 || u + v > 1.0) return false;

  const t = f * vec3.dot(edge2, q);
  return t > 1e-6; // t 是射线与三角形的距离
}
```

#### 4.2 **射线与包围盒相交**
为了提高性能，可以先用 **轴对齐包围盒（AABB）** 或 **包围球** 进行快速过滤，再精确检测射线与三角形的相交。

---

### 5. **处理点击事件**

当检测到射线与某个对象相交时，可以触发相应的点击事件。

#### 示例代码：
```javascript
function handleMouseClick(mouseX, mouseY) {
  // 1. 将屏幕坐标转换为 NDC
  const ndcX = (mouseX / canvas.width) * 2 - 1;
  const ndcY = -((mouseY / canvas.height) * 2 - 1);

  // 2. 生成射线
  const ray = generateRay(ndcX, ndcY, camera);

  // 3. 遍历场景中的对象，检测射线与对象的碰撞
  for (const object of scene.objects) {
    if (rayIntersectsTriangle(ray, object.triangle)) {
      console.log('Object clicked:', object);
      break;
    }
  }
}
```

---

## 优化与注意事项

1. **性能优化**：
   - 使用 **包围盒（AABB 或包围球）** 进行快速过滤，减少需要检测的三角形数量。
   - 对场景中的对象进行 **空间分区**（如八叉树、BVH），进一步提高检测效率。

2. **精度问题**：
   - 浮点数计算可能导致误差，需设置一个小的阈值（如 `1e-6`）来判断是否相交。

3. **复杂场景处理**：
   - 如果场景中有大量对象，可以使用 **GPU 加速** 或 **WebGL 的片段着色器** 实现点击检测（如颜色编码法）。

---

## 进阶：颜色编码法（GPU 实现）

颜色编码法是一种高效的点击检测方法，适合复杂场景。基本思路是：
1. 为每个对象分配一个唯一的颜色 ID。
2. 在隐藏的帧缓冲区中渲染场景，每个对象以其颜色 ID 渲染。
3. 捕获鼠标点击位置的像素颜色，反查对应的对象。

#### 示例代码：
```javascript
// 渲染到隐藏帧缓冲区
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
for (let i = 0; i < scene.objects.length; i++) {
  const object = scene.objects[i];
  const colorID = [i / 255, 0, 0, 1]; // 唯一颜色 ID
  renderObject(object, colorID);
}

// 读取点击位置的像素颜色
const pixel = new Uint8Array(4);
gl.readPixels(mouseX, canvas.height - mouseY, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixel);

// 根据颜色 ID 查找对象
const objectIndex = pixel[0];
console.log('Clicked object:', scene.objects[objectIndex]);
```

---

## 总结

在 WebGL 中实现鼠标点击检测的核心是 **射线投射（Raycasting）**，主要步骤包括：
1. 捕获鼠标点击事件。
2. 将屏幕坐标转换为 WebGL 的世界坐标。
3. 生成射线并检测与对象的碰撞。
4. 处理点击事件。

对于复杂场景，可以结合 **包围盒过滤** 或 **颜色编码法** 提高性能。通过这些方法，可以实现高效的鼠标点击交互功能。
