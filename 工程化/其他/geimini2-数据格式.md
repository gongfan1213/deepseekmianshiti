`FormData` 是一种用于构建 `multipart/form-data` 格式数据的接口，通常用于在 Web 应用中上传文件或提交表单数据。它的存储形式是键值对（`key-value`），其中每个键对应一个字段名，每个值可以是字符串或文件。

以下是 `FormData` 的数据存储形式和特点：

---

### **1. 数据存储形式**
`FormData` 的数据存储形式是一个键值对的集合，类似于一个字典或哈希表。每个键值对的结构如下：

- **键（Key）**: 表单字段的名称（字符串）。
- **值（Value）**: 表单字段的值，可以是以下两种类型：
  - **字符串**: 普通的文本数据。
  - **文件对象**: 包括 `File` 或 `Blob` 类型，用于表示文件数据。

---

### **2. 示例**
以下是一个 `FormData` 的示例：

```javascript
const formData = new FormData();

// 添加普通字段
formData.append('username', 'john_doe');
formData.append('email', 'john@example.com');

// 添加文件字段
const fileInput = document.querySelector('input[type="file"]');
formData.append('profile_picture', fileInput.files[0]);

// 添加 Blob 数据
const blob = new Blob(['Hello, world!'], { type: 'text/plain' });
formData.append('text_file', blob, 'hello.txt');
```

在上面的代码中，`FormData` 的存储形式如下：

| Key               | Value                     | 类型       |
|--------------------|---------------------------|------------|
| `username`         | `john_doe`               | 字符串     |
| `email`            | `john@example.com`       | 字符串     |
| `profile_picture`  | 文件对象（`File`）        | 文件       |
| `text_file`        | Blob 对象（`Blob`）       | 文件       |

---

### **3. 数据的序列化形式**
当 `FormData` 被发送到服务器时，它会被序列化为 `multipart/form-data` 格式。以下是序列化后的数据形式：

```
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW

------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="username"

john_doe
------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="email"

john@example.com
------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="profile_picture"; filename="profile.jpg"
Content-Type: image/jpeg

(binary data)
------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="text_file"; filename="hello.txt"
Content-Type: text/plain

Hello, world!
------WebKitFormBoundary7MA4YWxkTrZu0gW--
```

- **Boundary**: 每个字段之间用一个 `boundary` 分隔，`boundary` 是由浏览器自动生成的。
- **Content-Disposition**: 描述字段的名称和文件名（如果是文件）。
- **Content-Type**: 指定字段的 MIME 类型（如果是文件或 Blob）。

---

### **4. 特点**
1. **键值对存储**:
   - `FormData` 的数据以键值对的形式存储，键是字段名，值是字段值。
   - 值可以是字符串、文件或 Blob。

2. **支持文件上传**:
   - 可以直接存储文件对象（`File`）或二进制数据（`Blob`），非常适合文件上传场景。

3. **动态添加和删除字段**:
   - 可以使用 `append()` 方法动态添加字段。
   - 可以使用 `delete()` 方法删除字段。

4. **不可直接查看内容**:
   - `FormData` 的内容不能直接通过 `console.log()` 查看。
   - 可以使用 `FormData.entries()` 或 `FormData.forEach()` 遍历内容。

---

### **5. 遍历 FormData**
可以通过以下方法查看 `FormData` 的内容：

#### **方法 1: 使用 `forEach`**
```javascript
formData.forEach((value, key) => {
  console.log(key, value);
});
```

#### **方法 2: 使用 `entries`**
```javascript
for (const [key, value] of formData.entries()) {
  console.log(key, value);
}
```

---

### **6. 存储到 IndexedDB**
如果需要将 `FormData` 存储到 `IndexedDB`，需要先将其序列化为 JSON 格式，因为 `FormData` 本身不能直接存储。

#### **示例: 序列化 FormData**
```javascript
function serializeFormData(formData) {
  const obj = {};
  formData.forEach((value, key) => {
    if (value instanceof File) {
      obj[key] = {
        type: 'file',
        name: value.name,
        size: value.size,
        type: value.type,
        content: value, // 可以存储文件内容或 Blob
      };
    } else {
      obj[key] = value;
    }
  });
  return obj;
}

const serializedData = serializeFormData(formData);
console.log(serializedData);
```

#### **存储到 IndexedDB**
```javascript
const db = new IndexedDBAk('FormDataDB');
await db.open();
await db.put('formDataKey', serializedData);
```

---

### **7. 读取和恢复 FormData**
从 `IndexedDB` 读取数据后，可以将其恢复为 `FormData` 对象：

#### **恢复 FormData**
```javascript
function deserializeFormData(serializedData) {
  const formData = new FormData();
  for (const key in serializedData) {
    const value = serializedData[key];
    if (value.type === 'file') {
      const blob = new Blob([value.content], { type: value.type });
      formData.append(key, blob, value.name);
    } else {
      formData.append(key, value);
    }
  }
  return formData;
}

const restoredFormData = deserializeFormData(serializedData);
```

---

### **总结**
- `FormData` 的存储形式是键值对，值可以是字符串或文件。
- 在网络传输中，`FormData` 会被序列化为 `multipart/form-data` 格式。
- 如果需要将 `FormData` 存储到 `IndexedDB`，需要先将其序列化为 JSON 格式，并在读取时反序列化为 `FormData` 对象。
