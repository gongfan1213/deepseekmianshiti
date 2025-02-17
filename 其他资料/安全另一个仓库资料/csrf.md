> 💭 好的，用户现在问如何防御CSRF，也就是跨站请求伪造。我应该回忆之前学过的相关知识，确保覆盖所有常见的防御方法。首先，我得解释什么是CSRF攻击，然后分点列出各种防御措施。比如常见的同步令牌、SameSite Cookie、验证Referer这些方法。需要注意不要混淆CSRF和XSS的区别。
>
> 接下来要确定每种方法的实现细节。比如Token应该怎样生成和存储，如何与请求一起发送。另外，SameSite Cookie的三个属性值Lax、Strict、None，以及它们的适用场景。Referer验证虽然有效，但可能存在被禁用的情况，所以不能完全依赖。
>
> 还有可能需要提到用户操作时的二次验证，比如重新输入密码，但这可能会影响用户体验。此外，检查请求头中的Origin字段是否合法也是一个步骤，但需考虑兼容性问题。
>
> 然后要思考有没有其他方法，比如使用双提交Cookie，或者加密令牌之类的。可能需要举例子，让用户更明白如何实际操作，比如在表单中添加隐藏的Token字段，或者在HTTP头中携带Token。
>
> 需要注意是否每一种防御措施都有潜在的问题，比如令牌如果存储不当可能会被窃取，SameSite在旧版本浏览器中不支持，这时候是否需要回退方案。此外，是否应该综合多种方法使用，而不是单一依赖其中一种。
>
> 可能用户是开发者，想要具体的代码示例，比如如何在服务端生成Token，如何验证，或者在中间件中实现检查。这可能需要给出伪代码或者具体的框架示例，比如在Express或者Django中的实现方式。
>
> 还需要注意一些现代的框架是否内置了CSRF防护，比如Ruby on Rails、Spring Security等，这样用户可以直接启用而不需要从头实现。此外，跨域策略如CORS设置是否正确也可能间接影响CSRF防护，需要说明两者的关系，但不要混淆。
>
> 安全性方面，强调即使使用了HTTPS，CSRF仍然可能发生，因此不能省略防护。最后，总结最佳实践，比如使用同步令牌+SameSite Cookie的组合，或者其他的组合方式来增强安全性。
>
> 



防御 CSRF（跨站请求伪造）的关键在于**验证请求来源合法性**，常用方法如下：

---

### **核心防御方案**
#### **1. 同步令牌（Synchronizer Token Pattern）**
- **原理**：服务端生成唯一 Token，嵌入表单或请求头，验证请求是否携带有效 Token。
- **实现步骤**：
  1. **生成 Token**：
     ```javascript
     // 示例（Node.js + Express）
     const csrf = require('csurf');
     app.use(csrf({ cookie: true }));
     ```
  2. **发送 Token 到客户端**：
     ```html
     <!-- 表单隐藏域 -->
     <input type="hidden" name="_csrf" value="<%= csrfToken %>">
     ```
     ```javascript
     // API 请求头（如 Axios）
     axios.defaults.headers.common['X-CSRF-Token'] = getCSRFToken();
     ```
  3. **服务端校验**：
     ```javascript
     // 中间件自动校验（csurf 默认开启）
     ```

#### **2. SameSite Cookie 属性**
- **原理**：限制 Cookie 仅在同站请求中发送，阻止第三方网站携带用户 Cookie。
- **配置方式**：
  ```javascript
  // 设置关键认证 Cookie（如登录凭证）的 SameSite 属性
  Set-Cookie: sessionId=xxxx; SameSite=Lax; Secure; HttpOnly
  ```
  - `SameSite=Strict`：完全禁止跨站发送（适用于银行等高敏感操作）。
  - `SameSite=Lax`：允许安全方法（GET）的跨站导航请求（默认现代浏览器行为）。
- **适用场景**：需兼容旧浏览器时，需结合 Token 使用。

#### **3. 验证请求来源（Referer/Origin 校验）**
- **原理**：校验请求头中的 `Referer` 或 `Origin` 是否为可信域名。
- **实现代码**：
  ```javascript
  function checkReferer(req) {
    const referer = req.get('Referer');
    const origin = req.get('Origin');
    const allowedDomains = ['https://example.com', 'https://api.example.com'];
    
    if (!allowedDomains.includes(referer) && !allowedDomains.includes(origin)) {
      throw new Error('非法请求来源');
    }
  }
  ```
- **注意**：部分浏览器禁用 `Referer`，需配合其他方法使用。

#### **4. 双重提交验证（Double Submit Cookie）**
- **原理**：客户端生成 Token 存入 Cookie 和请求体，服务端校验两者是否一致。
  - **步骤**：
    1. 前端登录时生成随机 Token，如 `const token = uuid.v4()`。
    2. 前端写入 Cookie：`document.cookie = "csrfToken=" + token`。
    3. 每次请求携带该 Token 到请求头或表单。
    4. 服务端比对 Cookie 和请求中的 Token 是否匹配。

---

### **增强策略**
#### **1. 关键操作二次验证**
- **场景**：支付、改密等高敏感性操作。
- **方法**：要求用户二次输入密码、短信验证码或生物认证。

#### **2. 自定义请求头**
- **原理**：AJAX 请求添加自定义头（如 `X-Requested-With: XMLHttpRequest`），服务端仅接受含此头的请求。
  ```javascript
  // 前端设置
  fetch('/api/data', {
    headers: { 'X-Requested-With': 'XMLHttpRequest' }
  });
  ```
  ```nginx
  # Nginx 拒绝未携带自定义头的请求
  if ($http_x_requested_with != 'XMLHttpRequest') {
    return 403;
  }
  ```
- **注意**：需结合其他方法（攻击者可伪造头部，但需跨域权限）。

#### **3. 禁用第三方 Cookie**
- **配置**：HTTP 响应头设置 `Set-Cookie: thirdParty=block; SameSite=Lax`，减少攻击面。

---

### **框架集成方案**
#### **1. Spring Security**
  ```xml
  <!-- 启用 CSRF 防护 -->
  <http>
    <csrf />
  </http>
  ```
  - 表单自动插入 Token：`<input type="hidden" name="${_csrf.parameterName}" value="${_csrf.token}">`.

#### **2. Django**
  ```python
  # 中间件默认启用 CSRF
  MIDDLEWARE = [
    'django.middleware.csrf.CsrfViewMiddleware',
  ]
  ```
  - 模板中插入 Token：
    ```html
    <form>{% csrf_token %}</form>
    ```

#### **3. Express.js (csurf 中间件)**
  ```javascript
  const csrf = require('csurf');
  app.use(csurf({ cookie: true }));
  app.use((req, res, next) => {
    res.locals.csrfToken = req.csrfToken(); // 传递 Token 到视图
    next();
  });
  ```

---

### **避免常见误区**
1. **GET 请求不要用于状态修改**：遵循 RESTful 规范（GET 仅用于查询）。
2. **不要依赖仅 Cookie 认证**：必须结合 Token 或验证码。
3. **禁用 CORS 通配符**：避免 `Access-Control-Allow-Origin: *` 导致跨域漏洞。

---

### **组合防御最佳实践**
1. **基础防御**：`SameSite=Lax` Cookie + 同步 Token。
2. **敏感操作**：SameSite=Strict + 双重验证（如密码确认）。
3. **API 接口**：校验 `Origin` + 自定义头 + JSON 格式请求（非表单提交）。

---

遵循以上策略可显著降低 CSRF 风险，设计系统时建议 **自动防御优先**（如框架内置方案），再根据业务需求叠加增强措施。
