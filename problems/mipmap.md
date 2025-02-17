### 什么是 Mipmap？

Mipmap（全称为 **"Multum in parvo maps"**，意为“包含多个缩小版本的贴图”）是一种用于纹理映射的技术。它通过预先生成一系列不同分辨率的纹理图像（从原始分辨率到最小的 1x1 像素），在渲染时根据需要选择合适的分辨率进行采样，从而提高渲染性能并减少纹理失真。

Mipmap 是一种优化技术，主要用于解决以下问题：
1. **提高渲染性能**：减少 GPU 在渲染时的计算量。
2. **减少纹理失真**：避免由于纹理缩小（minification）导致的锯齿或模糊问题。

---

### Mipmap 的工作原理

Mipmap 是一组预先生成的纹理图像，每一层的分辨率是上一层的一半（宽度和高度都减半），直到达到 1x1 像素为止。Mipmap 的每一层被称为 **Mipmap Level**，通常用 `level` 表示。

例如，假设原始纹理的分辨率是 256x256 像素，那么它的 Mipmap 层级可能是：
- Level 0: 256x256（原始纹理）
- Level 1: 128x128
- Level 2: 64x64
- Level 3: 32x32
- Level 4: 16x16
- Level 5: 8x8
- Level 6: 4x4
- Level 7: 2x2
- Level 8: 1x1

在渲染时，OpenGL 或其他图形 API 会根据纹理在屏幕上的大小，自动选择最合适的 Mipmap 层级进行采样。

---

### 为什么需要 Mipmap？

在 3D 渲染中，纹理通常会被缩小或放大以适应物体的大小。如果直接使用原始纹理进行采样，可能会出现以下问题：

1. **纹理缩小（Minification）问题**  
   当纹理被缩小时（例如，远处的物体），多个像素会映射到纹理的同一个 texel（纹理像素）。这会导致锯齿或闪烁的伪影。

2. **性能问题**  
   如果始终使用高分辨率的纹理，即使物体在屏幕上很小，GPU 仍然需要处理大量的纹理数据，浪费了计算资源。

Mipmap 通过为每个纹理生成多个分辨率的版本，解决了上述问题：
- **减少失真**：通过选择合适的 Mipmap 层级，避免了纹理缩小时的锯齿和伪影。
- **提高性能**：使用低分辨率的纹理层级，减少了 GPU 的计算量。

---

### Mipmap 的生成

在 OpenGL 中，可以通过以下方式生成 Mipmap：

1. **自动生成 Mipmap**  
   使用 `glGenerateMipmap` 函数，OpenGL 会根据原始纹理自动生成所有 Mipmap 层级。

   ```cpp
   glBindTexture(GL_TEXTURE_2D, textureID);
   glTexImage2D(GL_TEXTURE_2D, 0, GL_RGBA, width, height, 0, GL_RGBA, GL_UNSIGNED_BYTE, data);
   glGenerateMipmap(GL_TEXTURE_2D);
   ```

2. **手动生成 Mipmap**  
   如果需要自定义每一层的 Mipmap，可以使用 `glTexImage2D` 为每一层指定纹理数据。

   ```cpp
   glTexImage2D(GL_TEXTURE_2D, 0, GL_RGBA, 256, 256, 0, GL_RGBA, GL_UNSIGNED_BYTE, dataLevel0); // Level 0
   glTexImage2D(GL_TEXTURE_2D, 1, GL_RGBA, 128, 128, 0, GL_RGBA, GL_UNSIGNED_BYTE, dataLevel1); // Level 1
   glTexImage2D(GL_TEXTURE_2D, 2, GL_RGBA, 64, 64, 0, GL_RGBA, GL_UNSIGNED_BYTE, dataLevel2);   // Level 2
   ```

---

### Mipmap 的采样

在使用 Mipmap 时，纹理采样器会根据纹理的缩放比例，选择合适的 Mipmap 层级进行采样。采样方式可以通过 `glTexParameteri` 设置：

1. **Minification（缩小）过滤**  
   设置当纹理被缩小时的采样方式：
   - `GL_NEAREST_MIPMAP_NEAREST`：使用最接近的 Mipmap 层级，并使用最近邻插值。
   - `GL_LINEAR_MIPMAP_NEAREST`：使用最接近的 Mipmap 层级，并使用线性插值。
   - `GL_NEAREST_MIPMAP_LINEAR`：在两个相邻的 Mipmap 层级之间进行线性插值，并使用最近邻插值。
   - `GL_LINEAR_MIPMAP_LINEAR`：在两个相邻的 Mipmap 层级之间进行线性插值，并使用线性插值（也称为三线性过滤）。

   示例：
   ```cpp
   glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR_MIPMAP_LINEAR);
   ```

2. **Magnification（放大）过滤**  
   设置当纹理被放大时的采样方式（Mipmap 对放大无效）：
   - `GL_NEAREST`：最近邻插值。
   - `GL_LINEAR`：线性插值。

   示例：
   ```cpp
   glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);
   ```

---

### Mipmap 的优缺点

#### 优点
1. **提高渲染性能**：使用低分辨率的纹理层级，减少了 GPU 的计算量。
2. **减少失真**：避免了纹理缩小时的锯齿和伪影。
3. **平滑过渡**：通过线性插值（如三线性过滤），可以实现不同 Mipmap 层级之间的平滑过渡。

#### 缺点
1. **占用内存**：Mipmap 会占用额外的显存。完整的 Mipmap 需要大约 1/3 的额外内存（原始纹理大小的 1/3）。
2. **生成开销**：生成 Mipmap 需要额外的计算时间，尤其是动态生成时。

---

### 示例代码

以下是一个完整的 OpenGL 示例，展示如何使用 Mipmap：

```cpp
// 加载纹理数据
GLuint textureID;
glGenTextures(1, &textureID);
glBindTexture(GL_TEXTURE_2D, textureID);

// 加载原始纹理数据
glTexImage2D(GL_TEXTURE_2D, 0, GL_RGBA, width, height, 0, GL_RGBA, GL_UNSIGNED_BYTE, data);

// 自动生成 Mipmap
glGenerateMipmap(GL_TEXTURE_2D);

// 设置过滤方式
glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR_MIPMAP_LINEAR); // 三线性过滤
glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);               // 放大时线性过滤

// 设置纹理环绕方式
glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_REPEAT);
glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_REPEAT);
```

---

### 总结

Mipmap 是一种非常重要的纹理优化技术，广泛应用于 3D 渲染中。它通过预先生成多层不同分辨率的纹理图像，解决了纹理缩小时的失真问题，并提高了渲染性能。尽管它会占用额外的显存，但其带来的性能提升和视觉效果的改善使其成为现代图形渲染中的标准技术。

如果你还有其他问题，欢迎继续提问！
