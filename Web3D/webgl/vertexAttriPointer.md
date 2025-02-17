以下是整理后的代码，添加了详细的注释，便于理解和维护：

```javascript
// 顶点着色器源码
var VERTEX_SHADER = `
    attribute vec4 a_pos;          // 顶点属性变量 a_pos，接收顶点坐标
    attribute float a_size;        // 顶点属性变量 a_size，接收点的大小
    void main() {
        gl_Position = a_pos;       // 设置顶点位置
        gl_PointSize = a_size;     // 设置点的大小
    }
`;

// 片元着色器源码
var FRAG_SHADER = `
    void main() {
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); // 设置片元颜色为红色 (RGBA)
    }
`;

// 初始化着色器程序
var program = initShader(gl, VERTEX_SHADER, FRAG_SHADER);

// 定义顶点数据，包含坐标 (x, y) 和大小
var dataVertices = new Float32Array([
    0.0,  0.0,  30.0,  // 顶点 1：坐标 (x, y) 和大小
    0.5,  0.5,  40.0,  // 顶点 2：坐标 (x, y) 和大小
   -0.5, -0.5,  10.0   // 顶点 3：坐标 (x, y) 和大小
]);

// 每个浮点数占用的字节数
var FSIZE = dataVertices.BYTES_PER_ELEMENT;

// 创建缓冲区对象
var buffer = gl.createBuffer();

// 绑定缓冲区对象到目标
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

// 将顶点数据写入缓冲区
gl.bufferData(gl.ARRAY_BUFFER, dataVertices, gl.STATIC_DRAW);

// 获取顶点着色器中 a_pos 和 a_size 的位置
var a_pos = gl.getAttribLocation(program, "a_pos");   // 顶点坐标
var a_size = gl.getAttribLocation(program, "a_size"); // 顶点大小

// 配置顶点坐标属性
gl.vertexAttribPointer(
    a_pos,                                // 属性变量位置
    2,                                    // 每个顶点包含 2 个分量 (x, y)
    gl.FLOAT,                             // 数据类型
    false,                                // 不归一化
    FSIZE * 3,                            // 每个顶点占用的字节数
    0                                     // 数据起始位置的偏移量
);

// 配置顶点大小属性
gl.vertexAttribPointer(
    a_size,                               // 属性变量位置
    1,                                    // 每个顶点包含 1 个分量 (大小)
    gl.FLOAT,                             // 数据类型
    false,                                // 不归一化
    FSIZE * 3,                            // 每个顶点占用的字节数
    FSIZE * 2                             // 数据起始位置的偏移量
);

// 启用顶点属性数组
gl.enableVertexAttribArray(a_pos);        // 启用顶点坐标属性
gl.enableVertexAttribArray(a_size);       // 启用顶点大小属性
```

---

### **代码详细说明**

#### **1. 顶点着色器源码**
```javascript
var VERTEX_SHADER = `
    attribute vec4 a_pos;
    attribute float a_size;
    void main() {
        gl_Position = a_pos;
        gl_PointSize = a_size;
    }
`;
```
- **`attribute vec4 a_pos;`**：声明顶点属性变量 `a_pos`，用于接收每个顶点的坐标数据。
- **`attribute float a_size;`**：声明顶点属性变量 `a_size`，用于接收每个顶点的大小。
- **`gl_Position = a_pos;`**：将顶点坐标赋值给内置变量 `gl_Position`，表示顶点在裁剪空间中的位置。
- **`gl_PointSize = a_size;`**：将点的大小赋值给内置变量 `gl_PointSize`。

---

#### **2. 片元着色器源码**
```javascript
var FRAG_SHADER = `
    void main() {
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    }
`;
```
- **`gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);`**：设置片元的颜色为红色，RGBA 值分别为 `(1.0, 0.0, 0.0, 1.0)`。

---

#### **3. 定义顶点数据**
```javascript
var dataVertices = new Float32Array([
    0.0,  0.0,  30.0,
    0.5,  0.5,  40.0,
   -0.5, -0.5,  10.0
]);
```
- 使用 `Float32Array` 定义顶点数据，每个顶点包含 3 个分量：
  - **前两个分量**：顶点的坐标 `(x, y)`。
  - **第三个分量**：顶点的大小。

---

#### **4. 每个浮点数占用的字节数**
```javascript
var FSIZE = dataVertices.BYTES_PER_ELEMENT;
```
- **`dataVertices.BYTES_PER_ELEMENT`**：表示每个浮点数占用的字节数（通常为 4 字节）。

---

#### **5. 创建缓冲区对象并绑定**
```javascript
var buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
```
- **`gl.createBuffer()`**：创建一个缓冲区对象，用于存储顶点数据。
- **`gl.bindBuffer(target, buffer)`**：将缓冲区对象绑定到指定的目标。
  - **`gl.ARRAY_BUFFER`**：表示缓冲区将存储顶点数据。

---

#### **6. 将顶点数据写入缓冲区**
```javascript
gl.bufferData(gl.ARRAY_BUFFER, dataVertices, gl.STATIC_DRAW);
```
- **`gl.bufferData(target, data, usage)`**：
  - 将顶点数据传递到绑定的缓冲区。
  - **`gl.STATIC_DRAW`**：表示数据不会频繁更新。

---

#### **7. 获取顶点着色器中 `a_pos` 和 `a_size` 的位置**
```javascript
var a_pos = gl.getAttribLocation(program, "a_pos");
var a_size = gl.getAttribLocation(program, "a_size");
```
- **`gl.getAttribLocation(program, name)`**：获取顶点着色器中 `attribute` 变量的地址。

---

#### **8. 配置顶点属性**
```javascript
gl.vertexAttribPointer(
    a_pos,
    2,
    gl.FLOAT,
    false,
    FSIZE * 3,
    0
);
gl.vertexAttribPointer(
    a_size,
    1,
    gl.FLOAT,
    false,
    FSIZE * 3,
    FSIZE * 2
);
```
- **`gl.vertexAttribPointer(location, size, type, normalized, stride, offset)`**：
  - 配置顶点属性的解析方式。
  - **参数说明**：
    - **`location`**：属性变量的位置。
    - **`size`**：每个顶点包含的分量数。
    - **`type`**：数据类型。
    - **`normalized`**：是否归一化。
    - **`stride`**：每个顶点占用的字节数。
    - **`offset`**：数据起始位置的字节偏移量。

---

#### **9. 启用顶点属性数组**
```javascript
gl.enableVertexAttribArray(a_pos);
gl.enableVertexAttribArray(a_size);
```
- **`gl.enableVertexAttribArray(location)`**：启用顶点属性数组，使其生效。

---

### **代码的整体功能**
1. **初始化 WebGL 上下文和着色器程序**：
   - 获取顶点着色器和片元着色器，完成着色器的编译和链接。
2. **传递顶点数据**：
   - 使用缓冲区将顶点的坐标和大小数据传递到 GPU。
3. **配置顶点属性**：
   - 配置顶点坐标和大小的解析方式。
4. **绘制点**：
   - 在画布上绘制多个大小不同的点。
