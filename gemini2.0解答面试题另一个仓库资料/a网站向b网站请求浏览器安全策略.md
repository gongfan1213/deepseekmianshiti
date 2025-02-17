- A 网站向 B 网站请求，网络请求中会有两个请求，为什么，谈到浏览器安全策略，预请求，跨域问题
好的，面试官，关于 A 网站向 B 网站发起的网络请求可能出现两个请求的情况，以及这背后的浏览器安全策略、预请求（Preflight）和跨域问题，我将进行详细的解释：

**1. 场景描述**

假设 A 网站（`https://a.example.com`）通过 JavaScript（例如 `fetch` 或 `XMLHttpRequest`）向 B 网站（`https://b.example.com`）发起一个网络请求。在某些情况下，我们可能会在浏览器的开发者工具中观察到两个请求：

1.  **预检请求 (Preflight Request):**
    *   方法：`OPTIONS`
    *   URL：与实际请求的 URL 相同
    *   无请求体
2.  **实际请求 (Actual Request):**
    *   方法：可能是 `GET`、`POST`、`PUT`、`DELETE` 等
    *   URL：与实际请求的 URL 相同
    *   可能有请求体

**2. 为什么会出现两个请求？**

这种情况通常发生在**跨域**场景下，并且请求满足某些特定条件时。浏览器为了安全起见，会先发送一个预检请求（`OPTIONS` 请求），以确认服务器是否允许跨域请求。

**3. 跨域 (Cross-Origin)**

*   **同源策略 (Same-Origin Policy):** 浏览器的一项安全机制，限制了来自不同源的文档或脚本之间的交互。
*   **源 (Origin):** 由协议、域名和端口组成。只有当两个 URL 的协议、域名和端口都完全相同时，才被认为是同源的。
*   **跨域：** 当一个请求的 URL 与当前页面的 URL 不满足同源策略时，就发生了跨域。

**4. 跨域资源共享 (CORS)**

CORS (Cross-Origin Resource Sharing) 是一种 W3C 标准，它允许 Web 应用服务器进行跨域访问控制，从而使跨域数据传输得以安全进行。浏览器和服务器之间通过特定的 HTTP 头来进行 CORS 协商。

**5. 简单请求 vs 预检请求**

CORS 将跨域请求分为两种类型：

*   **简单请求 (Simple Request):**
    *   满足以下所有条件：
        *   请求方法是 `GET`、`HEAD` 或 `POST`。
        *   HTTP 头信息不超过以下几种字段：
            *   `Accept`
            *   `Accept-Language`
            *   `Content-Language`
            *   `Content-Type`（仅限于 `application/x-www-form-urlencoded`、`multipart/form-data`、`text/plain`）
            *   `Viewport-Width`
            *   `DPR`
            *   `Downlink`
            *   `Save-Data`
            *   `Width`
    *   对于简单请求，浏览器会直接发送实际请求，并在请求头中添加 `Origin` 字段。
    *   服务器根据 `Origin` 字段判断是否允许跨域请求，并通过 `Access-Control-Allow-Origin` 等响应头来告知浏览器。

*   **预检请求 (Preflight Request):**
    *   不满足简单请求条件的请求被称为预检请求。
    *   浏览器在发送实际请求之前，会先发送一个 `OPTIONS` 请求到服务器，以询问服务器是否允许跨域请求。
    *   **触发预检请求的常见情况：**
        *   使用了 `PUT`、`DELETE`、`CONNECT`、`OPTIONS`、`TRACE`、`PATCH` 等方法。
        *   使用了自定义请求头（如 `X-Requested-With`、`Authorization` 等）。
        *   `Content-Type` 的值不是 `application/x-www-form-urlencoded`、`multipart/form-data` 或 `text/plain`（如 `application/json`）。
        *  请求中设置了 withCredentials: true
        * 请求中包含了 ReadableStream 对象

**6. 预检请求的流程**

1.  **浏览器发送预检请求：**
    *   方法：`OPTIONS`
    *   URL：与实际请求的 URL 相同
    *   请求头：
        *   `Origin`: 当前页面的源。
        *   `Access-Control-Request-Method`: 实际请求将使用的方法。
        *   `Access-Control-Request-Headers`: 实际请求将使用的自定义请求头。
2.  **服务器响应预检请求：**
    *   如果服务器允许跨域请求，它会返回以下响应头：
        *   `Access-Control-Allow-Origin`: 允许访问的源（可以是 `*` 表示允许所有源，或指定具体的源）。
        *   `Access-Control-Allow-Methods`: 允许的请求方法。
        *   `Access-Control-Allow-Headers`: 允许的自定义请求头。
        *   `Access-Control-Max-Age`: 预检请求结果的缓存时间（秒）。
    *   如果服务器不允许跨域请求，它可能会返回一个错误状态码（如 403），或者不返回上述的 CORS 响应头。
3.  **浏览器处理预检请求的响应：**
    *   如果预检请求成功（服务器返回了正确的 CORS 响应头），浏览器会发送实际请求。
    *   如果预检请求失败（服务器返回错误或缺少 CORS 响应头），浏览器会阻止实际请求的发送，并在控制台中报错。

**7. 实际请求**

如果预检请求成功，或者请求是简单请求，浏览器会发送实际请求。实际请求与普通的同源请求类似，但会包含 `Origin` 请求头。服务器可以根据 `Origin` 请求头来判断请求是否来自可信任的源。

**8. 代码示例**

```javascript
// 假设这是在 https://a.example.com 页面上的 JavaScript 代码

// 简单请求 (GET)
fetch('https://b.example.com/data')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error));

// 预检请求 (POST + 自定义请求头)
fetch('https://b.example.com/data', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Custom-Header': 'foobar',
  },
  body: JSON.stringify({ message: 'Hello' }),
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error));
```

在第二个例子中，由于使用了 `POST` 方法、`Content-Type: application/json` 和自定义请求头 `X-Custom-Header`，浏览器会先发送一个 `OPTIONS` 预检请求，然后再发送实际的 `POST` 请求。

**9. 总结与建议**

*   当 A 网站向 B 网站发起跨域请求时，如果请求不是简单请求，浏览器会先发送一个 `OPTIONS` 预检请求，以确认服务器是否允许跨域请求。
*   预检请求是由浏览器的同源策略和 CORS 机制触发的。
*   服务器需要正确配置 CORS 响应头，以允许跨域请求。
*   了解预检请求的触发条件和流程，可以帮助我们更好地处理跨域问题。
*   在开发过程中，可以使用浏览器的开发者工具来查看网络请求，分析是否发送了预检请求以及预检请求的响应。
* 避免触发预检请求： 尽量使用简单请求，避免自定义复杂的请求头
*  设置 Access-Control-Max-Age： 合理的设置可以减少预检请求的次数

通过以上分析，我们可以清楚地了解为什么在某些跨域场景下会出现两个请求，以及这背后的浏览器安全策略和 CORS 机制。
