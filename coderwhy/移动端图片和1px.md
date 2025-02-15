以下是图片中内容的文字整理：

---

### 06-为什么在移动端使用@2x、@3x的图片？

目前在移动端设备中，有非常多高分辨率的设备。为了适应不同的像素密度，UI设计师通常需要为开发者提供多个版本的图像资源。

通常标记为@1x、@2x、@3x：

- **@1x图片**：基本尺寸，适用于低分辨率设备。
- **@2x图片**：是基本图像尺寸的两倍，适用于中等分辨率设备，`device-pixel-ratio`为2的设备。
- **@3x图片**：是基本图像尺寸的三倍，适用于高分辨率设备，`device-pixel-ratio`为3的设备。
<img width="714" alt="image" src="https://github.com/user-attachments/assets/371265e7-7c9e-4328-8a75-1f80629f21a3" />
<img width="607" alt="image" src="https://github.com/user-attachments/assets/4bb31014-2805-43db-8955-38130c67d409" />
<img width="306" alt="image" src="https://github.com/user-attachments/assets/904fc6be-ef9b-4ffd-992b-25fa4665402d" />

**如果都使用的@1x的图片，在高分辨率下就会图像非常模糊，模糊的图像可能会使产品显得粗糙，影响用户对应用品质的整体感受。**

我们开发Web可以通过媒体查询来设置不同的图像：

---

**但是实际上你在MDN上面查看会发现`-webkit-min-device-pixel-ratio`其实是一个非标准的特性，也就意味着不建议在生产环境使用：**

**MDN截图说明：**
- `-webkit-device-pixel-ratio`是一个非标准的布尔类型CSS媒体类型，是标准`resolution`媒体类型的一个替代方案。
<img width="719" alt="image" src="https://github.com/user-attachments/assets/d9fcb031-3f7b-47b3-a202-3a17a4923bb4" />

---

**它推荐我们使用另外一个特性：`resolution`**

- `resolution`媒体特性是CSS标准中用于查询设备显示密度的推荐方式。
- 它支持多种单位，包括：
  - `dpi`（dots per inch，每英寸点数）；
  - `dpcm`（dots per centimeter，每厘米点数）；
  - `dppx`（dots per pixel unit，每像素点数单位，相当于设备像素比）。

**使用dppx即可：**  
1dppx相当于一个设备独立像素对应一个屏幕物理像素。
<img width="738" alt="image" src="https://github.com/user-attachments/assets/b632a54b-a59a-41fc-8c53-e05202c881f4" />
<img width="571" alt="image" src="https://github.com/user-attachments/assets/fc8c236e-0f90-4623-b24e-f682e4399765" />

---

### 07-什么是1px问题，前端如何去解决它，如何画出0.5px边框？

我们知道在移动端的设计稿中，往往UI给的设计稿宽度为750px，图中设计的边框宽度为1px，在我们375px的设备下，我们应该将宽度写为**0.5px**。

但是如果直接设置0.5的话，一些设备（特别是旧的移动设备和浏览器）并且不支持0.5px，这个就是我们常说的1px问题以及如何画出0.5px边框的问题。

---

**那么这种问题应该如何去处理呢？目前常见的方案有两种：**

- **方案一**：viewport + rem + div（淘宝，大家可以自行了解）
- **方案二**：伪类 + transform（京东）

---
<img width="725" alt="image" src="https://github.com/user-attachments/assets/2949fa9e-3494-4db7-960b-30cca61b48ed" />
<img width="633" alt="image" src="https://github.com/user-attachments/assets/672da5ba-86c2-4a4e-8a11-c789e5fee9f5" />

以上是整理后的完整内容。
