### **什么是 Base64？**

**Base64** 是一种用于将二进制数据（如图片、音频、视频等）编码为文本格式的编码方式。它的主要目的是将二进制数据转换为 ASCII 字符串，以便在需要文本传输的场景中使用（如 HTTP、JSON、XML 等）。

- **Base64 的特点**：
  1. 将二进制数据编码为由 64 个字符组成的字符串（A-Z、a-z、0-9、+、/）。
  2. 编码后的数据比原始数据大约多 33% 的体积。
  3. 适合在文本协议中传输二进制数据。

---

### **为什么图片需要转成 Base64？**

在某些场景下，图片需要转成 Base64 格式，主要原因包括：

1. **嵌入 HTML 或 CSS**：
   - 在 HTML 或 CSS 中，可以直接将 Base64 编码的图片嵌入为 `data URI`，无需单独的图片文件。
   - 例如：
     ```html
     <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA...">
     ```
   - 这样可以减少 HTTP 请求的数量，提升页面加载速度（适用于小图片）。

2. **传输二进制数据**：
   - 在 JSON 或 XML 中，无法直接传输二进制数据（如图片文件），需要将其转换为 Base64 格式的字符串。
   - 例如，API 返回的 JSON 数据中可能包含图片的 Base64 编码。

3. **跨平台兼容性**：
   - 某些协议或系统只支持文本数据，Base64 提供了一种通用的方式来传输二进制数据。

---

### **Base64 的工作原理**

1. **将二进制数据分组**：
   - 将二进制数据按 3 字节（24 位）一组分割。
   - 每组 24 位被分为 4 个 6 位的块。

2. **映射到 Base64 字符表**：
   - 每个 6 位的块被映射到一个 Base64 字符表中的字符。
   - Base64 字符表：`A-Z`、`a-z`、`0-9`、`+`、`/`。

3. **填充**：
   - 如果数据长度不是 3 的倍数，会在末尾用 `=` 填充，确保编码后的长度是 4 的倍数。

---

### **Base64 示例**

#### **原始数据**：
假设我们有一个字符串 `Man`，其 ASCII 编码为：
- `M` -> 77
- `a` -> 97
- `n` -> 110

#### **转换为二进制**：
将 ASCII 转换为二进制：
- `M` -> `01001101`
- `a` -> `01100001`
- `n` -> `01101110`

合并为 24 位二进制数据：
```
01001101 01100001 01101110
```

#### **分组为 6 位**：
将 24 位分为 4 个 6 位的块：
```
010011 010110 000101 101110
```

#### **映射到 Base64 字符表**：
根据 Base64 字符表：
- `010011` -> `T`
- `010110` -> `W`
- `000101` -> `F`
- `101110` -> `u`

#### **结果**：
字符串 `Man` 的 Base64 编码为：
```
TWFu
```

---

### **图片转成 Base64 的示例**

#### **原始图片**：
假设我们有一张图片 `example.png`。

#### **将图片转为 Base64**：
在 JavaScript 中，可以使用 `FileReader` 将图片文件转换为 Base64。

```javascript
const fileInput = document.querySelector('input[type="file"]');
fileInput.addEventListener('change', (event) => {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = () => {
    const base64String = reader.result;
    console.log(base64String); // 输出 Base64 编码的字符串
  };

  reader.readAsDataURL(file); // 将文件读取为 Base64 格式
});
```

#### **Base64 的结果**：
图片会被编码为一个很长的字符串，例如：
```
data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA...
```

---

### **什么是 Blob？**

**Blob**（Binary Large Object）是 JavaScript 中用于表示二进制数据的对象。它可以存储图片、视频、音频等文件数据。

- **Blob 的特点**：
  1. 是二进制数据的封装，可以直接操作文件数据。
  2. 可以通过 URL 创建一个临时的文件链接，用于显示或下载。

---

### **Blob 的使用场景**

1. **显示图片**：
   - 使用 `URL.createObjectURL` 将 Blob 转换为临时的 URL。
   - 例如：
     ```javascript
     const blob = new Blob([binaryData], { type: 'image/png' });
     const url = URL.createObjectURL(blob);
     document.querySelector('img').src = url;
     ```

2. **文件下载**：
   - 将 Blob 转换为下载链接。
   - 例如：
     ```javascript
     const blob = new Blob(['Hello, world!'], { type: 'text/plain' });
     const url = URL.createObjectURL(blob);

     const a = document.createElement('a');
     a.href = url;
     a.download = 'example.txt';
     a.click();

     URL.revokeObjectURL(url); // 释放 URL
     ```

3. **文件上传**：
   - Blob 可以直接作为文件上传的内容。

---

### **Blob 和 Base64 的区别**

| **特性**         | **Blob**                                   | **Base64**                                |
|------------------|-------------------------------------------|------------------------------------------|
| **数据类型**     | 二进制数据                                | 文本数据                                 |
| **体积**         | 与原始数据大小相同                        | 比原始数据大约多 33%                     |
| **用途**         | 文件操作、显示图片、上传文件              | 嵌入 HTML、JSON 或传输文本协议           |
| **性能**         | 更高效，适合大文件                        | 占用更多内存，适合小文件                 |
| **转换**         | 可通过 `FileReader` 转为 Base64           | 可通过 `atob` 和 `btoa` 转为二进制数据  |

---

### **为什么选择 Base64 或 Blob？**

1. **选择 Base64 的场景**：
   - 需要将图片嵌入到 HTML 或 CSS 中。
   - 需要通过 JSON 或 XML 传输图片数据。
   - 图片文件较小，Base64 的体积增加可以接受。

2. **选择 Blob 的场景**：
   - 需要操作大文件（如视频、音频）。
   - 需要高效地显示图片或下载文件。
   - 不需要将二进制数据转换为文本。

---

### **总结**

- **Base64** 是一种将二进制数据编码为文本的方式，适合嵌入 HTML 或传输文本协议。
- **Blob** 是 JavaScript 中的二进制数据对象，适合操作文件或高效显示图片。
- **选择 Base64 或 Blob** 取决于具体的使用场景：
  - 小文件嵌入：Base64。
  - 大文件操作：Blob。

通过理解 Base64 和 Blob 的特点，可以更好地处理图片、文件等二进制数据！
