以下是整理后的文字内容，并根据原文本的结构、逻辑和图片内容进行了分段和概括：

**01-浏览器输入一个URL并enter时，到底发生了什么？**

当你输入一个URL并按下enter键，页面加载背后发生了一系列复杂的过程。
当你浏览器中输入一个URL比如`www.example.com`时,我们需要先找到它对应的IP地址,这个过程被称为DNS解析,即域名系统解析。
<img width="674" alt="image" src="https://github.com/user-attachments/assets/2c9c2dc9-1ad9-468a-8393-9607e25ed073" />

**(图片：WHAT HAPPENS WHEN YOU TYPE IN A URL IN AN ADDRESS BAR IN A BROWSER?)** 
(这张图展示了从输入URL到页面加载的整个流程，包括DNS查询、TCP连接、HTTP请求、服务器响应、浏览器渲染等步骤。)

**DNS (Domain Name System) 服务器解析**

DNS解析的目标是将域名转换为IP地址。这个过程通常涉及多个步骤和服务器：

*   **缓存查找过程:**
    *   **浏览器缓存：** 首先，浏览器会检查它自己的缓存中是否存有这个域名的记录，因为之前访问过的网址的解析结果可能会被存储在浏览器缓存中。
    *   **操作系统缓存：** 如果浏览器缓存中没有找到，浏览器会询问操作系统，因为操作系统也可能有自己的DNS缓存。
    *   **路由器缓存：** 如果操作系统中也没有找到，请求会发送到本地网络的路由器，它同样可能有自己的DNS缓存。
    *   **ISP（Internet service provider）缓存：** 如果以上都没有缓存记录，请求最终会发送到你的互联网服务提供商（ISP），它们通常会有更大范围的DNS缓存。

*   **DNS递归解析:**
    如果所有本地缓存查找都失败，DNS查询就变成了一个递归查询过程，涉及到多个DNS服务器：
    *   **根域名服务器：** 首先，你的DNS查询会被发送到根域名服务器。根服务器是最高级别的DNS服务器，负责重定向到负责管理顶级域名（如.com、.net等）的顶级域名服务器。
    *   **顶级域名服务器 (TLD服务器)：** 根服务器会告诉你的ISP的DNS服务器去查询哪个顶级域名服务器来找到.com域的信息。这个服务器掌握所有.com域名及其相应服务器的信息。
    *   **权威域名服务器：** 一旦你的DNS查询到达了正确的顶级域名服务器，它会进一步定向到负责`example.com`的权威服务器。权威服务器有该域名对应的具体IP地址。

*   **IP地址的获取:**
    最终，权威域名服务器会提供`www.example.com`域名对应的IP地址（如图中的93.184.216.34），这个信息会被发送回用户的电脑。

* **缓存结果**
一旦ip地址被找到,它通常会被存储在浏览器，操作系统，路由器或ISP的DNS缓存中, 以便未来的查询可以更快得到解析。

**TCP/HTTP请求**

获取到IP地址后，浏览器会与服务器建立连接并发送HTTP请求：

*   **TCP (Transmission Control Protocol，传输控制协议):** TCP是一种面向连接的协议，用于在网络中的两个端点之间建立可靠的会话。
    以下是TCP连接建立过程，通常称为三次握手（TCP 3-way handshake）：
    *   **SYN (Synchronize)：**
        *   客户端发送一个SYN包到服务器以初始化一个连接。
        *   客户端设置一个随机的序列号，告诉服务器已准备开始发送数据。
        *   序列号不仅仅是在握手期间使用的，后续传输数据也会用到，用来保证数据的完整性和顺序。
    *   **SYN-ACK (Synchronize-Acknowledgment)：**
        *   服务器接收到客户端的SYN包后，会发送一个SYN-ACK包作为响应。
        *   服务器同样设置一个随机的序列号，并将客户端的序列号加一，发送回给客户端，确认已经收到了客户端的同步请求（+1表示服务器确认收到）。
    *   **ACK (Acknowledgment)：**
        *   客户端收到服务器的SYN-ACK后，发送一个ACK包作为回应。
        *   这个ACK包将服务器的序列号加一，并可能包含客户端准备发送的数据的开始部分（比如HTTP请求行GET / HTTP/1.1和请求头，这个被称为TCP快速打开）。
        *   此时，TCP连接已经建立，双方可以开始数据传输。

*    **HTTP (Hypertext Transfer Protocol，超文本传输协议):** 它是建立在TCP连接之上的应用层协议。（这里不展开网络的分层架构）

*   **HTTP工作流程如下：**
客户端发起HTTP请求,一旦TCP连接建立,就可以通过这个连接发送一个HTTP请求到服务器。这个请求包含可方法(GET,POST等),URI和协议版本,以及可能包含的请求头和请求体。

* **服务器响应**
服务器接收到HTTP请求后,会处理这个请求并返回一个HTTP响应。
响应通常包含一个状态码(如200表示成功,404表示未找到),响应头以及任何响应内容(如请求的HTML文件)。

TCP为HTTP提供了一个可靠的通道,确保数据正确,完整地从服务器传输到客户端。

**浏览器渲染过程**

服务器下载资源的过程:
**(图片：下载CSS和JS文件的示意图)**
<img width="674" alt="image" src="https://github.com/user-attachments/assets/aefd539d-5654-4a38-81bd-809a5fbfd0cc" />
<img width="670" alt="image" src="https://github.com/user-attachments/assets/d65a074e-e4d8-45ae-b8d6-2afc01d36ca1" />

那么当一个页面被下载下来后它是如何被渲染的呢?这里我们需要学习一个重要的知识:浏览器内核。

我们经常说的浏览器内核指的浏览器排版引擎：

*   排版引擎（layout engine），也称为浏览器引擎（browser engine）、页面渲染引擎（rendering engine）或样版引擎。

*   也就是一个网页下载下来后，就是由我们的渲染引擎来帮助我们解析的。

**常见的浏览器内核有哪些呢？**

*   Trident（三叉戟）：IE、早期的360安全浏览器、早期的搜狗高速浏览器、早期的百度浏览器、早期的UC浏览器；（微软已经放弃）
*   Gecko（壁虎）：Mozilla Firefox；
*   Presto（急板乐曲）-> Blink（眨眼）：Opera
*   Webkit：Safari、移动端浏览器（Android、iOS）
*   Webkit -> Blink：Google Chrome，Edge，360极速浏览器，搜狗高速浏览器

渲染引擎在拿到一个页面后，如何解析整个页面并且最终呈现出我们的网页呢?
<img width="731" alt="image" src="https://github.com/user-attachments/assets/713b01f6-a62c-45b0-8f4e-ec04d2f0f5eb" />
<img width="705" alt="image" src="https://github.com/user-attachments/assets/131dd240-d414-48de-8e8a-c7e55f87b4c5" />

**(图片：浏览器渲染流程，HTML -> DOM Tree, CSS -> CSSOM, 结合生成Render Tree，然后进行Layout和Painting)**

更加详细的过程:
<img width="675" alt="image" src="https://github.com/user-attachments/assets/1e39d135-5406-408d-8abf-a02282644553" />

**(图片：更详细的浏览器渲染流程，包括HTML Parser, DOM Tree, Style, Attachment, Render Tree, Layout, Painting, Display)**
好的，以下是整理后的文字内容，按逻辑结构分段，并概括要点：

**浏览器渲染过程**
<img width="648" alt="image" src="https://github.com/user-attachments/assets/4638c5ce-fbf4-4eff-b0d2-81bee6e0ec07" />

*   **解析一：HTML解析过程**

    *   因为默认情况下服务器会给浏览器返回index.html文件，所以解析HTML是所有步骤的开始。
    *   解析HTML，会构建DOM Tree:
        *   (图片：HTML代码示例及其对应的DOM Tree)
<img width="682" alt="image" src="https://github.com/user-attachments/assets/253cf15d-4121-4f21-bb37-c40cf18caa16" />

*   **解析二：生成CSS规则**

    *   在解析的过程中，如果遇到CSS的link元素，那么会由浏览器负责下载对应的CSS文件：
        *   注意：下载CSS文件是不会影响DOM的解析的；
        *   浏览器下载完CSS文件后，就会对CSS文件进行解析，解析出对应的规则树；
        *   我们可以称之为 CSSOM（CSS Object Model，CSS对象模型）；
        *   (图片：CSS代码示例及其对应的CSSOM)
<img width="679" alt="image" src="https://github.com/user-attachments/assets/59c4f13d-dbe7-4672-82ed-9a4961c50a80" />

*   **解析三：构建Render Tree**

    *   注意一：link元素不会阻塞DOM Tree的构建过程，但是会阻塞Render Tree的构建过程
        *   这是因为Render Tree在构建时，需要对应的CSSOM Tree；
    *   注意二：Render Tree和DOM Tree并不是一一对应的关系，比如对于display为none的元素，压根不会出现在render tree中；
<img width="667" alt="image" src="https://github.com/user-attachments/assets/40a1a4e2-ebd4-43a2-8608-3591ba2e3a02" />

*   **解析四：布局（Layout）和绘制（Paint）**

    *   第四步是在渲染树（Render Tree）上运行布局（Layout）以计算每个节点的几何体。
        *   渲染树会表示哪些节点以及其他样式，但是不表示每个节点的尺寸、位置等信息;
        *   布局是确定呈现中所有节点的宽度、高度和位置信息；
    *   第五步是将每个节点绘制（Paint）到屏幕上
        *    在绘制阶段，浏览器将布局阶段计算的每个frame转为屏幕上实际的像素点；
        *   包括将元素的可见部分进行绘制，比如文本、颜色、边框、阴影、替换元素（比如img）
<img width="663" alt="image" src="https://github.com/user-attachments/assets/118705c8-0665-48ce-8510-fbd05c249a56" />

    *  **过程分解**
        * **Content:** 内容的起始点
        * **Match Selectors:** 浏览器遍历CSSOM，将选择器与DOM树中的元素匹配。这个过程决定了哪些CSS规则应用于哪些DOM元素。
        * **Compute Style:** 在选择器匹配后，浏览器计算每个元素的最终样式。这包括计算具体的样式值，处理继承的样式以及解决层叠产生的任何冲突。
        * **Construct Frames:** 这通常是指生成布局树，它是渲染树的一部分，仅包含要布局和绘制的元素。 这一步骤涉及确定文档的结构层次和包含块。
         * **Layout:** 确定每个可见元素的大小和位置
        * **Paint:** 将每个节点绘制到屏幕上
        * **Composite:** 合成

    *   **布局树和渲染树是有微小的差异，布局树是渲染树的子集，不包含渲染树中元素的颜色、背景、阴影等信息**

