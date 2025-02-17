`<input type="file">` 元素在用户与其交互时会触发多种事件。以下是一些常见的事件及其用途：

### 1. `onChange` 事件
当用户选择文件时触发。这个事件是最常用的，因为它允许你访问用户选择的文件。

```javascript
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files) {
    const file = e.target.files[0];
    console.log(file.name);
  }
};

<input type="file" onChange={handleChange} />;
```

### 2. `onInput` 事件
当用户在文件输入框中输入内容时触发。尽管文件输入框通常不允许用户手动输入内容，但某些情况下可能会触发此事件。

```javascript
const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
  console.log('Input event triggered');
};

<input type="file" onInput={handleInput} />;
```

### 3. `onFocus` 事件
当文件输入框获得焦点时触发。

```javascript
const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
  console.log('Input focused');
};

<input type="file" onFocus={handleFocus} />;
```

### 4. `onBlur` 事件
当文件输入框失去焦点时触发。

```javascript
const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
  console.log('Input blurred');
};

<input type="file" onBlur={handleBlur} />;
```

### 5. `onClick` 事件
当用户点击文件输入框时触发。

```javascript
const handleClick = (e: React.MouseEvent<HTMLInputElement>) => {
  console.log('Input clicked');
};

<input type="file" onClick={handleClick} />;
```

### 6. `onDoubleClick` 事件
当用户双击文件输入框时触发。

```javascript
const handleDoubleClick = (e: React.MouseEvent<HTMLInputElement>) => {
  console.log('Input double-clicked');
};

<input type="file" onDoubleClick={handleDoubleClick} />;
```

### 7. `onKeyDown` 事件
当用户按下键盘上的某个键时触发。

```javascript
const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  console.log(`Key down: ${e.key}`);
};

<input type="file" onKeyDown={handleKeyDown} />;
```

### 8. `onKeyUp` 事件
当用户释放键盘上的某个键时触发。

```javascript
const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
  console.log(`Key up: ${e.key}`);
};

<input type="file" onKeyUp={handleKeyUp} />;
```

### 9. `onDragOver` 事件
当文件被拖动到文件输入框上方时触发。

```javascript
const handleDragOver = (e: React.DragEvent<HTMLInputElement>) => {
  e.preventDefault();
  console.log('File dragged over input');
};

<input type="file" onDragOver={handleDragOver} />;
```

### 10. `onDrop` 事件
当文件被拖放到文件输入框时触发。

```javascript
const handleDrop = (e: React.DragEvent<HTMLInputElement>) => {
  e.preventDefault();
  if (e.dataTransfer.files) {
    const file = e.dataTransfer.files[0];
    console.log(file.name);
  }
};

<input type="file" onDrop={handleDrop} />;
```

这些事件可以帮助你在用户与文件输入框交互时执行相应的逻辑，从而实现丰富的用户体验。通过使用这些事件处理程序，你可以处理文件选择、拖放、键盘操作等各种交互。
