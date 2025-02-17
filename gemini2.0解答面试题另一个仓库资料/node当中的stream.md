好的，面试官。下面我将详细阐述 Node.js 中常见的 Stream（流）类型及其特点：

**1. 什么是 Stream？**

*   **定义：** Stream 是 Node.js 中用于处理流式数据的抽象接口。它允许你以一种高效、非阻塞的方式读取和写入数据，而不需要将整个数据加载到内存中。
*   **特点：**
    *   **高效性：** Stream 逐块处理数据，而不是一次性加载整个数据，因此可以处理大量数据，而不会占用太多内存。
    *   **非阻塞：** Stream 的操作是非阻塞的，这意味着在等待数据读取或写入时，Node.js 可以继续执行其他任务。
    *   **可组合性：** Stream 可以通过管道（pipe）连接起来，形成一个数据处理链，实现复杂的数据转换和处理。
*   **应用场景：**
    *   **文件 I/O：** 读取和写入大文件。
    *   **网络 I/O：** 处理 HTTP 请求和响应、TCP/UDP 数据传输等。
    *   **数据压缩和解压缩：** 使用 zlib 模块进行数据压缩和解压缩。
    *   **数据转换：** 对数据进行格式转换、过滤、加密等操作。

**2. Stream 的四种基本类型**

Node.js 中有四种基本的 Stream 类型：

*   **Readable（可读流）：** 用于读取数据的流。
    *   **事件：**
        *   `data`：当有数据可读时触发。
        *   `end`：当数据读取完毕时触发。
        *   `error`：当发生错误时触发。
        *   `close`：当流关闭时触发。
    *   **方法：**
        *   `read([size])`：读取指定大小的数据，如果未指定大小，则读取所有可用数据。
        *   `pipe(destination, [options])`：将可读流连接到可写流。
        *   `pause()`：暂停数据流。
        *   `resume()`：恢复数据流。
    *   **示例：** `fs.createReadStream()`（读取文件）、`process.stdin`（标准输入）。

*   **Writable（可写流）：** 用于写入数据的流。
    *   **事件：**
        *   `drain`：当可以继续写入数据时触发（缓冲区已排空）。
        *   `finish`：当所有数据都已写入底层系统时触发。
        *   `error`：当发生错误时触发。
        *   `close`：当流关闭时触发。
    *   **方法：**
        *   `write(chunk, [encoding], [callback])`：写入数据块。
        *   `end([chunk], [encoding], [callback])`：结束写入，可以写入最后一个数据块。
    *   **示例：** `fs.createWriteStream()`（写入文件）、`process.stdout`（标准输出）、`process.stderr`（标准错误）。

*   **Duplex（双工流）：** 同时可读可写的流。
    *   **特点：** 继承自 Readable 和 Writable，可以同时进行读取和写入操作。
    *   **示例：** `net.Socket`（TCP 套接字）、`zlib.createGzip()`（Gzip 压缩）。

*   **Transform（转换流）：** 一种特殊的 Duplex 流，用于在读取和写入数据之间进行转换。
    *   **特点：** 继承自 Duplex，但在读取和写入数据之间会执行一个转换函数。
    *   **示例：** `zlib.createDeflate()`（Deflate 压缩）、`crypto.createCipher()`（加密）。

**3. Stream 的两种模式**

Readable Stream 有两种模式：

*   **Flowing Mode（流动模式）：**
    *   数据会自动从底层系统读取，并通过 `data` 事件提供给消费者。
    *   可以通过 `pipe()` 方法或监听 `data` 事件来进入流动模式。
*   **Paused Mode（暂停模式）：**
    *   数据不会自动读取，需要显式调用 `read()` 方法来读取数据。
    *   默认情况下，Readable Stream 处于暂停模式。

**4. Stream 的管道（Pipe）**

*   **作用：** 管道可以将一个 Readable Stream 连接到一个 Writable Stream，自动将数据从可读流传输到可写流。
*   **优点：**
    *   **简化代码：** 不需要手动监听 `data` 事件和调用 `write()` 方法。
    *   **自动流量控制：** 管道会自动处理背压（backpressure），防止可写流缓冲区溢出。
    *   **错误处理：** 如果管道中的任何一个流发生错误，会自动关闭所有流。
*   **示例：**

    ```javascript
    const fs = require('fs');

    const readableStream = fs.createReadStream('input.txt');
    const writableStream = fs.createWriteStream('output.txt');

    readableStream.pipe(writableStream); // 将 input.txt 的内容复制到 output.txt
    ```

**5. Stream 的背压（Backpressure）**

*   **定义：** 背压是指当可写流的写入速度慢于可读流的读取速度时，可写流的缓冲区可能会溢出。为了避免这种情况，Stream 提供了背压机制，可以暂停可读流的读取，直到可写流的缓冲区有足够的空间。
*   **工作原理：**
    *   当可写流的 `write()` 方法返回 `false` 时，表示缓冲区已满，应该暂停读取。
    *   当可写流的缓冲区排空后，会触发 `drain` 事件，表示可以继续写入数据。
    *   可读流可以通过监听 `drain` 事件来恢复读取。
*   **管道自动处理背压：** 当使用 `pipe()` 方法连接流时，管道会自动处理背压，无需手动处理。

**6. Stream 的错误处理**

*   **事件：** 所有 Stream 都会触发 `error` 事件，表示发生了错误。
*   **处理方式：**
    *   监听 `error` 事件，并进行相应的处理，如记录错误日志、关闭流等。
    *   如果使用管道，管道会自动处理错误，并关闭所有流。

**7. 常见的 Stream 示例**

*   **文件流：**
    *   `fs.createReadStream(path, [options])`：创建可读文件流。
    *   `fs.createWriteStream(path, [options])`：创建可写文件流。
*   **HTTP 流：**
    *   `http.IncomingMessage`：HTTP 请求的可读流。
    *   `http.ServerResponse`：HTTP 响应的可写流。
*   **TCP 流：**
    *   `net.Socket`：TCP 套接字，双工流。
*   **压缩/解压缩流：**
    *   `zlib.createGzip()`：Gzip 压缩，转换流。
    *   `zlib.createGunzip()`：Gzip 解压缩，转换流。
    *   `zlib.createDeflate()`：Deflate 压缩，转换流。
    *   `zlib.createInflate()`：Deflate 解压缩，转换流。
*   **加密/解密流：**
    *   `crypto.createCipher()`：加密，转换流。
    *   `crypto.createDecipher()`：解密，转换流。
*   **进程标准输入输出流:**
    *   `process.stdin`: 标准输入流，可读流。
    *   `process.stdout`: 标准输出流，可写流。
    *   `process.stderr`: 标准错误流，可写流。

**总结：**

Stream 是 Node.js 中一个非常重要的概念，它提供了一种高效、非阻塞的方式来处理流式数据。理解 Stream 的四种基本类型（Readable、Writable、Duplex、Transform）、两种模式（Flowing、Paused）、管道、背压和错误处理，对于编写高性能的 Node.js 应用至关重要。掌握常见的 Stream 示例（如文件流、HTTP 流、TCP 流、压缩/解压缩流）可以帮助我们更好地应用 Stream 来解决实际问题。
