### GAMES101 课程内容详细翻译  
**主讲人：Lingqi Yan，加州大学圣塔芭芭拉分校**  

---

### 双线性插值（Bilinear Interpolation）  

#### 基本公式  
- **线性插值公式（1D）**：  
  \[
  \text{lerp}(x, v_0, v_1) = v_0 + x(v_1 - v_0)
  \]  

- **双线性插值步骤**：  
  1. **水平插值**：  
     \[
     u_0 = \text{lerp}(s, u_{00}, u_{10})
     \]  
     \[
     u_1 = \text{lerp}(s, u_{01}, u_{11})
     \]  
  2. **垂直插值**：  
     \[
     f(x, y) = \text{lerp}(t, u_0, u_1)
     \]  

- **解释**：  
  - \(u_{00}, u_{01}, u_{10}, u_{11}\) 是纹理采样点的值。  
  - \(s, t\) 是采样点在纹理单元（texel）中的分数偏移量。  

#### 计算过程  
1. **水平插值**：  
   - 计算 \(u_0\) 和 \(u_1\)，分别是上下两行的插值结果。  
2. **垂直插值**：  
   - 使用 \(u_0\) 和 \(u_1\) 进行最终插值，得到采样点的值 \(f(x, y)\)。  

#### 优点  
- 双线性插值在计算成本合理的情况下，通常能提供较好的结果。  

---

### 纹理放大（Texture Magnification）  

#### 简单情况  
- **最近邻插值（Nearest Neighbor）**：  
  - 简单但可能导致锯齿状边缘（Jaggies）。  
- **双线性插值（Bilinear Interpolation）**：  
  - 平滑但计算稍复杂。  
- **双三次插值（Bicubic Interpolation）**：  
  - 更平滑但计算复杂度更高。  

#### 困难情况  
- 当纹理分辨率不足时，可能会出现以下问题：  
  - **锯齿（Jaggies）**。  
  - **莫尔条纹（Moire Patterns）**。  

---

### 屏幕像素在纹理中的“足迹”  

#### 纹理采样的两种情况  
1. **上采样（Upsampling / Magnification）**：  
   - 屏幕像素比纹理单元（texel）小。  
2. **下采样（Downsampling / Minification）**：  
   - 屏幕像素比纹理单元大。  

---

### 超采样抗锯齿（Supersampling Anti-Aliasing）  

#### 超采样的效果  
- **优点**：  
  - 提供高质量的抗锯齿效果。  
- **缺点**：  
  - 计算成本非常高，尤其是当像素覆盖多个纹理单元时。  

#### 问题分析  
- 当像素覆盖多个纹理单元时，信号频率过高，导致需要更高的采样频率。  
- **解决方法**：  
  - 不直接采样，而是计算像素范围内的平均值。  

---

### 点查询 vs. 范围查询  

#### 不同像素的不同“足迹”  
- 像素在纹理中的覆盖范围（足迹）可能大小不一。  
- **解决方法**：  
  - 使用 Mipmap 进行快速、近似的范围查询。  

---

### Mipmap（多级纹理）  

#### 定义  
- **Mipmap**：  
  - 由 L. Williams 于 1983 年提出。  
  - “Mip” 来源于拉丁语“multum in parvo”，意为“在小空间中包含大量信息”。  

#### Mipmap 层级  
- 每一层是原始纹理的缩小版本：  
  - Level 0：128x128  
  - Level 1：64x64  
  - Level 2：32x32  
  - Level 3：16x16  
  - Level 4：8x8  
  - Level 5：4x4  
  - Level 6：2x2  
  - Level 7：1x1  

#### 存储开销  
- 每一层的存储需求逐渐减少，总存储开销约为原始纹理的 1/3。  

---

### 计算 Mipmap 层级 \(D\)  

#### 估算纹理足迹  
- 使用屏幕空间中相邻采样点的纹理坐标：  
  - 屏幕空间：\((x, y)\)。  
  - 纹理空间：\((u, v)\)。  

#### 公式  
- 计算最大纹理足迹 \(L\)：  
  \[
  L = \max\left(\sqrt{\left(\frac{\partial u}{\partial x}\right)^2 + \left(\frac{\partial v}{\partial x}\right)^2}, \sqrt{\left(\frac{\partial u}{\partial y}\right)^2 + \left(\frac{\partial v}{\partial y}\right)^2}\right)
  \]  
- 计算 Mipmap 层级 \(D\)：  
  \[
  D = \log_2 L
  \]  

---

### 三线性插值（Trilinear Interpolation）  

#### 定义  
- 在两个相邻的 Mipmap 层级之间进行线性插值：  
  1. 在每个层级中使用双线性插值计算结果。  
  2. 对两个层级的结果进行线性插值。  

#### 优点  
- 提供平滑的过渡效果。  

---

### Mipmap 的局限性  

#### 问题  
1. **过度模糊（Overblur）**：  
   - 当像素覆盖范围较大时，Mipmap 的结果可能过于模糊。  
2. **各向异性问题**：  
   - Mipmap 假设像素足迹是正方形，但实际可能是长方形或其他形状。  

---

### 各向异性过滤（Anisotropic Filtering）  

#### 改进  
- **Ripmaps 和累加面积表（Summed Area Tables）**：  
  - 支持轴对齐的矩形区域查询。  
  - 但对对角线足迹仍有问题。  

- **EWA 过滤（Elliptical Weighted Average Filtering）**：  
  - 使用多个查询点进行加权平均。  
  - 支持不规则的像素足迹。  
  - 仍然依赖 Mipmap 层级。  

#### EWA 的实现  
- 使用椭圆测试来确定像素足迹：  
  \[
  Q(u, v) = A u^2 + B u v + C v^2
  \]  
  - \(Q(u, v) < F\) 表示点在椭圆内。  
  - 使用高斯核函数进行加权平均。  

---

### 致谢  
- **感谢**：  
  - Prof. Ravi Ramamoorthi 和 Prof. Ren Ng 提供了许多幻灯片内容。  

---

如果您还有其他问题或需要更详细的解释，请随时告诉我！
