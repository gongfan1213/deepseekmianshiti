好的，这是你提供的文本内容：

coderwhy前端⼋股⽂（⼀）

SEO相关的题⽬在⾯试被问的较多，⼀⽅⾯是SEO对于Web站点很重要，另⼀⽅⾯很多同学的简历中都会写 到SEO相关的表述。 另外SEO是⼀个相对宽泛的话题，所以回答的好坏差别会很⼤。

# 01-什么是SEO（搜索引擎优化）？为什么SEO对于⼀个⽹站⾄关重要？

SEO是搜索引擎优化，它的英⽂全称是Search Engine Optimization 因为现在很多我们开发的⽹站，类似于⻔户⽹站或者功能⽹站（⽐如我之前在企业⾥⾯开发的弘源旅途、星客 SC、⽹易云⾳乐），⼀⽅⾯我们需要通过营销宣传来提升我们产品的知名度，另⼀⽅⾯靠⾃然搜索结果获取 流量也是⼀个⾮常重要的过程。 所以我们需要在了解⼀定的搜索引擎⾃然排名机制的基础上，对我们的⽹站进⾏内部和外部的调整优化，让⽤ 户在使⽤关键字搜索时我们的⽹站可以尽量⾼的提升⾃然排名，获取更多的流量，从⽽达到我们预期的销量以 及品牌的知名度。

关键点：

关键⼀：回答出问题本身，⽐如说问到你SEO优化是什么了，你就要回答出来 关键⼆：结合真实的项⽬或者案例来回答，越回答对应的项⽬，越真实，⽽不是你背诵的⼋股⽂ 关键三：可以做⼀定的引导，会引导到你做的项⽬上，我们提前针对项⽬准备的很多问题就能派上⽤场了

# 02-SEO有哪些关键点？你在⽇常开发中，都采取了哪些措施来进⾏SEO 呢？

从重要到次要依次来说明，如果中间⾯试官开始根据你的回答问其他问题，那么就可以暂时停下来回答其他 问题。 当然⽬前在国内针对百度有⼀个很直接的SEO⽅式就是给钱，其实有可以通过不给钱的⽅式来提升⽹站关键字排名 的⽅案。

⽅式⼀：SSR服务器端渲染

因为我之前企业的项⽬，包括现在很多现在新的项⽬，都是基于现代的框架，⽐如Vue、React来开发的，⼤部分⻚ ⾯元素是由客户端JavaScript动态⽣成的。很多的搜索引擎，在爬⾍时只能抓取静态的HTML源代码，⽽不会执⾏ JavaScript，因此动态⽣成的内容⽆法被爬⾍索引。另外很多的搜索情况不会等待⼀部数据加载完成后再进⾏抓 取，也会导致我们⽹站的很多关键信息不能被完整的收录。 为了确保⽹站的SEO优化，我们之前的项⽬需要SEO优化的都采⽤了SSR技术。SSR能够在服务器上执⾏JavaScript 并渲染出完整的HTML⻚⾯，然后将其发送到客户端。这样，爬⾍在抓取⽹站时就能获取到完整的⻚⾯内容，从⽽ 提升SEO效果。 如果是开发初期就计算进⾏SEO优化的话，我们⼀般会直接选择⼀些⽐较成熟的SSR框架，⽐如对于Vue来说选择 Nuxt.js，对于React来说选择Next.js。 后续就是⼀些开发中的细节了

⽅式⼆：准确的TDK描述

TDK就是我们常说的（⾯试）title、description、keywords Title（标题）：也就是⽹站显示的标题，不仅仅⽤户会看到，搜索引擎通常会⾸先检索和收录title信息，所以 title⾄关重要。title⼀般不需要过⻓，多个关键词之间使⽤“|”或者“-”分割，会被搜索引擎提取和收录。 Description（描述）：这是对⽹⻚内容的简短描述，通常在搜索引擎结果⻚中标题下⽅显示。描述应概述⻚ ⾯内容，包含相关关键词，并吸引⽤户点击。 Keywords（关键词）：这是⽹⻚内容中重要的词汇，反映了⻚⾯的主题和内容，每个关键字都要有对应的内 容匹配。虽然现代搜索引擎（如Google）对关键词标签的重视程度已经降低，但在某些情况下，合理使⽤关 键词仍然有助于SEO。

⽅式三：语义化的 HTML元素、图⽚alt、h1、h2的合理使⽤

语义化的HTML代码和符合W3C规范是SEO的关键要素之⼀。 语义化是指使⽤具有明确含义的HTML元素，搜索引擎在爬取⽹站时，也会更容易理解⽹站的内容以便进⾏收 录，从侧⾯也能印证我们的⽹⻚更加的规范。⽽且这不仅有助于搜索引擎理解⽹⻚内容，还能提⾼⽹⻚的可读 性和可维护性。 包括Header, Nav，Aside，Article，Footer元素，这些都能帮助爬⾍更好的获取⻚⾯内容，理解⽹⻚。

图⽚要求必须加alt规范

我们要求每个前端在使⽤图⽚时，必须加上和图⽚相关的alt，⼀⽅⾯是图⽚⽆法显示时⽤户可以看到提示， 另⼀⽅⾯也有利于SEO优化。

重要的标签h1/h2/h3等的使⽤

H1、H2、H3等HTML标题标签在SEO中起着⾮常重要的作⽤。这些标签有助于搜索引擎理解⽹⻚内容的结构 和层次，从⽽更准确地索引和评估⻚⾯的相关性。

⽅式四：编写合理的robots.txt⽂件

robots.txt 是⼀个存放在⽹站根⽬录中的⽂本⽂件，其主要作⽤是告诉搜索引擎爬⾍哪些部分的⽹站可以被抓取 （爬取）以及哪些部分不应该被抓取。 为什么需要使⽤'robots.txt' 通过指示搜索引擎忽略不重要的⽂件或⽬录，可以让搜索引擎更专注于重要内容的抓取和索引。 当然也可以避免⼀些敏感或私有内容被⽆意中索引。 所以如果⽹站不编写robots.txt，可能会降低⽹站的SEO效率，因为搜索引擎花费更多时间和资源在不重要的⻚⾯ 上。 举⼏个例⼦： 知乎 爱彼迎

⽅式五：HTTPS

⾃2014年以来，Google已将HTTPS作为其搜索排名的信号之⼀。这意味着，使⽤HTTPS的⽹站在搜索结果中可能 会获得⽐⾮HTTPS⽹站更好的排名。 ⽽且HTTPS也有利于⽤户的安全，在⽤户使⽤⽹站时也会增加信任度。

⽅式六：内部链接和外部链接

内部链接是指从⼀个⻚⾯到同⼀⽹站内另⼀个⻚⾯的链接。它可以提⾼提⾼⽹站导航、增强⽹站的权重、提升⽹站 的索引。 外部链接是指从⼀个⽹站指向另⼀个⽹站的链接。在⽹⻚中放合适的外部链接，也有利⽤于提升⽹站的权重指数， 容易被搜索引擎收录。

其他⽅式

当然还有⼀些其他的细节，⽐如sitmap⽂件、⽹站导航、响应式的处理，都在某种程度上能提⾼⽹站的权重。另外 有⼀些企业还会专⻔请⼀些SEO的专员来进⾏SEO优化的操作，每个企业情况不太⼀样。

# 03-defer和async属性在script标签中分别有什么作⽤？

浏览器在解析HTML的过程中，遇到了script元素是不能继续构建DOM树的 它会停⽌继续构建，⾸先下载JavaScript代码，并且执⾏JavaScript的脚本； 只有等到JavaScript脚本执⾏结束后，才会继续解析HTML，构建DOM树； 为什么要这样做呢？ 这是因为JavaScript的作⽤之⼀就是操作DOM，并且可以修改DOM； 如果我们等到DOM树构建完成并且渲染再执⾏JavaScript，会造成严重的回流和重绘，影响⻚⾯的性能； 所以会在遇到script元素时，优先下载和执⾏JavaScript代码，再继续构建DOM树； 但是这个也往往会带来新的问题，特别是现代⻚⾯开发中： 在⽬前的开发模式中（⽐如Vue、React），脚本往往⽐HTML⻚⾯更“重”，处理时间需要更⻓； 所以会造成⻚⾯的解析阻塞，在脚本下载、执⾏完成之前，⽤户在界⾯上什么都看不到； 为了解决这个问题，script元素给我们提供了两个属性（attribute）：defer和async。

defer的作⽤
<img width="608" alt="image" src="https://github.com/user-attachments/assets/7da9d692-6c09-4b0a-b97a-83b5528bca54" />

defer 属性告诉浏览器不要等待脚本下载，⽽继续解析HTML，构建DOM Tree。 脚本会由浏览器来进⾏下载，但是不会阻塞DOM Tree的构建过程； 如果脚本提前下载好了，它会等待DOM Tree构建完成，在DOMContentLoaded事件之前先执⾏defer中的代 码； 所以DOMContentLoaded总是会等待defer中的代码先执⾏完成。 另外多个带defer的脚本是可以保持正确的顺序执⾏的。 从某种⻆度来说，defer可以提⾼⻚⾯的性能，并且推荐放到head元素中；

async的作⽤
<img width="566" alt="image" src="https://github.com/user-attachments/assets/9ec510ac-ceee-41fb-bae0-39cfbc6d8111" />

async 特性与 defer 有些类似，它也能够让脚本不阻塞⻚⾯。 async是让⼀个脚本的下载和执⾏是独⽴的： 浏览器不会因 async 脚本的下载⽽阻塞（与 defer 类似）； async脚本会在下载好后⽴即执⾏，不能保证在DOMContentLoaded之前或者之后执⾏（执⾏时会阻塞DOM Tree的构建）； async脚本不能保证顺序，它是独⽴下载、独⽴运⾏，不会等待其他脚本； 具体的执⾏时机
<img width="696" alt="image" src="https://github.com/user-attachments/assets/9660282b-163b-4d3a-a4ca-a76b069c19a7" />

⾯试回答

<script> 标签的 defer 和 async 属性⽤来控制外部脚本⽂件的加载和执⾏⽅式，它们对于改善⻚⾯加载速度⾮ 常有帮助。 但是它们的机制并不相同： defer的下载不会阻⽌DOM的构建，但是在DOM Tree构建完成后，在DOMContentLoaded事件之前，先执 ⾏脚本的内容，并且defer脚本的执⾏是有有序的。 async的下载也不会阻⽌DOM的加载，⽽且不会保证在DOMContentLoaded之前或者之后执⾏，也不能保证 顺序，它的每个脚本是独⽴进⾏的。 所以它们的应⽤场景是这样的： defer通常⽤于需要在⽂档解析后操作DOM的JavaScript代码，并且对多个script⽂件有顺序要求的； async通常⽤于独⽴的脚本，对其他脚本，甚⾄对DOM没有依赖的脚本； 在现代化框架开发过程中，往往不需要我们⾃⼰来配置async或者defer，在使⽤脚⼿架或者⾃⼰搭建的webapck或 者vite项⽬进⾏打包时，它会根据需要帮我们加上defer属性，某些情况下我们想要进⾏性能优化时，也可以⼿动的 加上async属性（例如⼀些第三⽅的分析⼯具或者⼴告追踪脚本）。

# 04-你能描述⼀下CSS3引⼊的⼀些主要新特性吗？

⽐较好的回答是：其实并不存在真正意义上的CSS3，因为我有阅读W3C的⽂档。从CSS3并不是⼀个单⼀的规范， ⽽是⼀系列独⽴模块的集合，这些模块扩展了CSS的功能。 这种模块化的⽅法允许不同的特性以不同的速度发展，可以更快的标准化⼀些特性，⽽不必等待整个规范的完成。 ⽐如说：

选择器（Selectors）：

新的属性选择器，如 \[attr^=value] （属性值以特定字符串开始）； 结构性伪类，如 :nth-child 、 :nth-last-child 、 :first-of-type ；

背景和边框（Backgrounds and Borders）：

边框圆⻆（ border-radius ），简化了创建圆⻆效果的过程。 边框图⽚（ border-image ），允许使⽤图⽚来创建边框。 多重背景，⽀持在单个元素上使⽤多个背景图⽚。

⽂本效果（Text Effects）：

⽂本阴影（ text-shadow ），可以在⽂字后⾯添加阴影效果。 ⽂本溢出（ text-overflow ），控制⽂本溢出容器时的显示⽅式。

转换和动画（CSS Transforms Module, CSS Animations）：

2D 和 3D 转换（ transform ），包括旋转（ rotate ）、缩放（ scale ）、倾斜（ skew ）和平移 （ translate ）。 CSS 动画（ animation ），允许定义关键帧动画，控制动画序列。

等等

# 05-物理像素-逻辑像素-CSS像素-像素密度-DPR-PPI-DPI

当我们聊pixel时，到底在聊些什么？ 像素是影响显示的基本单位。（⽐如屏幕上看到的画⾯、⼀幅图⽚）； pix是英语单词picture的常⽤简写，加上英语单词“元素”element，就得到pixel； “像素”表示“画像元素”之意，有时亦被称为pel（picture element）； 但是我们⼜听说过各种像素的名称，物理像素、逻辑像素、CSS像素，它们分别是什么？⼜有什么关系呢？ 我们这⾥先区分物理像素和逻辑像素

物理像素（Physical Pixel）也称为设备像素，是显示屏幕的最⼩ 物理 单位。

每个物理像素可以发光并显示特定的颜⾊。 物理像素的⼤⼩是固定的，由设备的硬件决定。 ⽐如iPhone X的分辨率 1125x2436，指的就是物理像素； 物理像素的密度（像素每英⼨，即PPI，英语：Pixels Per Inch，缩写：PPI）PPI越⾼，屏幕显示的内容就越细腻。 1英⼨=2.54厘⽶，在⼯业领域被⼴泛应⽤；

逻辑像素（Logical Pixel），有时也被称为设备独⽴像素（Device Independent Pixel，简称DIP） 是⼀个抽象的单位，⽤于在编程中统⼀不同设备的显示标准。 逻辑像素是⽤来衡量在不同设备上如何统⼀显示内容的尺⼨单位。 例如，在⾼分辨率设备上，可能有多个物理像素组成⼀个逻辑像素。 这样，⽆论设备的物理像素密度如何，使⽤逻辑像素单位开发的界⾯都能保持相对⼀致的⼤⼩和视觉效果。

DPR：device pixel ratio
<img width="399" alt="image" src="https://github.com/user-attachments/assets/01421b4e-f758-415d-aa7b-853581ce1388" />

2010年，iPhone4问世，不仅仅带来了移动互联⽹，还带来了Retina屏幕； Retina屏幕翻译为视⽹膜显示屏，可以为⽤户带来更好的显示； 在Retina屏幕中，⼀个逻辑像素在⻓度上对应两个物理像素，这个⽐例称之为设备像素⽐（device pixel ratio）； 我们可以通过window.devicePixelRatio获取到当前屏幕上的DPR值；

CSS像素（CSS Pixel），CSS像素可以被看作是逻辑像素的⼀种形式，⽤在Web端的。

它们被设计⽤来简化Web开发者的⼯作，使⽹⻚在不同显示设备上都能保持设计的⼀致性。 随着设备屏幕密度的增加，浏览器会⾃动处理CSS像素与物理像素之间的⽐例关系，确保⽹⻚元素在视觉上的 ⼤⼩保持⼀致。

DPI（Dots Per Inch）:每英⼨的打印点数

DPI主要⽤于描述打印机输出的精细度。 例如，⼀个⾼DPI值的打印机可以打印出更细致、更少⻅瑕疵的图像。

PPI和DPI的区别是什么？

DPI主要⽤于打印领域，⽽PPI则主要⽤于屏幕显示领域。 DPI衡量的是墨⽔点的数量，PPI衡量的是像素的数量。

⾯试如何回答呢？

物理像素也称为设备像素，是显示屏幕的最⼩ 物理 单位，也就是说它是实际的物理存在的单位，是由设备的 硬件决定。 但是我们知道现在的显示器也好，⼿机也好，它们的分辨率也就是物理像素差别⾮常⼤，我们开发者如果⾯向 物理像素开发就需要先考虑每个设备的真实分别率，开发的难度就会⼤⼤提升。 所以操作系统和浏览器就抽象出另外的⼀种像素，我们称之为逻辑像素，也被称之为设备独⽴像素。 逻辑像素是⼀个抽象的单位，⽤于在编程中统⼀不同设备的显示标准。这样，⽆论设备的物理像素密度如何， 使⽤逻辑像素单位开发的界⾯都能保持相对⼀致的⼤⼩和视觉效果。 当然这个过程中还衍⽣出来很多不同的概念，⽐如PPI（物理像素的密度，每英⼨的物理像素数量）， DPR（设备像素⽐，也就是⼀个逻辑像素对应的物理像素数量），DPI（每英⼨打印点数，它主要应⽤于打印 领域）。

# 06-为什么在移动端使⽤@2x、@3x的图⽚？
<img width="548" alt="image" src="https://github.com/user-attachments/assets/081dda5b-0941-4740-8a75-a388005abf37" />
<img width="625" alt="image" src="https://github.com/user-attachments/assets/a3101af7-b62c-45c3-9885-e291a04a0a0d" />
<img width="402" alt="image" src="https://github.com/user-attachments/assets/dfa53d37-3631-4614-9d48-e78124536466" />
<img width="726" alt="image" src="https://github.com/user-attachments/assets/c225ee80-2e11-46ea-97a5-46c5981d0214" />

⽬前在移动端设备中，有⾮常多⾼分辨率的设备。为了适应不同的像素密度，UI设计师通常需要为开发者提供多个 版本的图像资源。 通常标记为@1x、@2x、@3x： @1x图像：基本尺⼨，适⽤于低分辨率设备。 @2x图像：是基本图像尺⼨的两倍，适⽤于中等分辨率设备，device-pixel-ratio为2的设备。 @3x图像：是基本图像尺⼨的三倍，适⽤于⾼分辨率设备，device-pixel-ratio为3的设备。 如果都使⽤的@1x的图⽚，在⾼分辨率下就会图像⾮常模糊，模糊的图像可能会使产品显得粗糙，影响⽤户对应⽤ 品质的整体感觉。 我们开发Web可以通过媒体查询来设置不同的图像：

< !DOCTYPE html>
< html lang="en">
< head>

  < meta charset="UTF-8">

  < meta name="viewport" content="width=device-width, initial-scale=1.0">

  < title>Document< /title>

  < style>

  .box {

  width: 132px;

  height: 171px;

  background-color: red;

  background-image: url(./img/zznh.png);

  background-size: cover;

  }

  /\* 针对2x屏幕 \*/

  @media only screen and (min-resolution: 2dppx) {

  .box {

  background-image: url('./img/zznh@2x.png');

  }

  }

  /\* 针对3x屏幕 \*/

  @media only screen and (min-resolution: 3dppx) {

  .box {

  background-image: url('./img/zznh@3x.png');

  }

  }

  < /style>

1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30

但是其实你在MDN上⾯查看会发现-webkit-min-device-pixel-radio其实是⼀个⾮标准的特性，也就意味着不建议 在⽣产环境使⽤： 它推荐我们使⽤另外⼀个特性：resolution resolution 媒体特性是CSS标准中⽤于查询设备显示密度的推荐⽅式。 它⽀持多种单位，包括 dpi （dots per inch，每英⼨点数）、 dpcm （dots per centimeter，每厘⽶点 数）、和 dppx （dots per pixel unit，每像素点数单位，相当于设备像素⽐）。 使⽤ddpx即可：1dppx 相当于⼀个设备独⽴像素对应于⼀个屏幕物理像素。

< /head>
< body>

  < div class="box">< /div>

< /body>
< /html>

31 32 33 34 35 36 37 38 39

< !DOCTYPE html>
< html lang="en">
< head>

  < meta charset="UTF-8">

  < meta name="viewport" content="width=device-width, initial-scale=1.0">

  < title>Document< /title>

  < style>

1 2 3 4 5 6 7 8
<img width="724" alt="image" src="https://github.com/user-attachments/assets/4e0418ae-af02-4588-92a4-6e25d472d4b6" />
<img width="592" alt="image" src="https://github.com/user-attachments/assets/2bdb35bc-ceb4-4cc9-8681-5764acfda0a7" />

# 07-什么是1px问题，前端如何去解决它，如何画出0.5px边框？
<img width="745" alt="image" src="https://github.com/user-attachments/assets/80ce6b1a-6596-48cc-b096-8f295b95e73f" />
<img width="708" alt="image" src="https://github.com/user-attachments/assets/85eaa5c3-f134-48d3-8400-5c56f83e46ec" />

我们知道在移动端的设计稿中，往往UI给的设计稿宽度为 750px ，图中设计的边框宽度为 1px ，在我们 375px 的设备下，我们应该将宽度写为 0.5px 。 但是如果直接设置0.5的话，⼀些设备（特别是旧的移动设备和浏览器）并且不⽀持0.5px，这个就是我们常说的 1px问题以及如何画出0.5px边框的问题。 那么这种问题应该如何去处理呢？⽬前常⻅的⽅案有两种： ⽅案⼀：viewport + rem + div （淘宝，⼤家可以⾃⾏了解） ⽅案⼆：伪类 + transform（京东）

  .box {

  width: 132px;

  height: 171px;

  background-color: red;

  background-image: url(./img/zznh.png);

  background-size: cover;

  }

  /\* 针对2x屏幕 \*/

  @media only screen and (min-resolution: 2dppx) {

  .box {

  background-image: url('./img/zznh@2x.png');

  }

  }

  /\* 针对3x屏幕 \*/

  @media only screen and (min-resolution: 3dppx) {

  .box {

  background-image: url('./img/zznh@3x.png');

  }

  }

  < /style>
< /head>
< body>

  < div class="box">< /div>

< /body>
< /html>

9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39

< !DOCTYPE html>
< html lang="en">
< head>

  < meta charset="UTF-8">

  < meta name="viewport" content="width=device-width, initial-scale=1.0">

  < title>Document< /title>

  < style>

  .border-test {

  position: relative;

  padding: 10px;

  margin: 20px;

  display: inline-block;

  }

  .border-test::before {

  content: "";

  position: absolute;

  left: 0;

  top: 0;

  width: 200%;

  height: 200%;

  border: 1px solid red;

  transform-origin: 0 0;

  transform: scale(0.5);

  }

  < /style>
< /head>
< body>

  < div class="border-test">1px border< /div>

1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31

# 08-你如何理解块级上下⽂（BFC），并且创建BFC的⽅法有哪些？

什么是FC呢？ FC的全称是Formatting Context，元素在标准流⾥⾯都是属于⼀个FC的； 块级元素的布局属于Block Formatting Context（BFC） 也就是block level box都是在BFC中布局的； ⾏内级元素的布局属于Inline Formatting Context（IFC） ⽽inline level box都是在IFC中布局的； block level box都是在BFC中布局的，那么这个BFC在哪⾥呢？拿出来给我看看。

MDN上有整理出在哪些具体的情况下会创建BFC：

根元素（< html>） 浮动元素（元素的 float 不是 none） 绝对定位元素（元素的 position 为 absolute 或 fixed） ⾏内块元素（元素的 display 为 inline-block） 表格单元格（元素的 display 为 table-cell，HTML表格单元格默认为该值），表格标题（元素的 display 为

< /body>
< /html>

32 33 34

table-caption，HTML表格标题默认为该值） 匿名表格单元格元素（元素的 display 为 table、table-row、 table-row-group、table-header-group、 table-footer-group（分别是HTML table、row、tbody、thead、tfoot 的默认属性）或 inline-table） overflow 计算值(Computed)不为 visible 的块元素 弹性元素（display 为 flex 或 inline-flex 元素的直接⼦元素） ⽹格元素（display 为 grid 或 inline-grid 元素的直接⼦元素） display 值为 flow-root 的元素

我们来看⼀下官⽅⽂档对BFC作⽤的描述：

简单概况如下：

在BFC中，box会在垂直⽅向上⼀个挨着⼀个的排布； 垂直⽅向的间距由margin属性决定； 在同⼀个BFC中，相邻两个box之间的margin会折叠（collapse）； 在BFC中，每个元素的左边缘是紧挨着包含块的左边缘的；

问题⼀⾯试回答：

针对BFC⽹上有特别多的说法，但是都没有解释的很清楚，所以我是专⻔查过MDN⽂档的 在标准流中，我们所有的盒⼦，不管是块级盒⼦还是⾏内盒⼦，它们都属于某⼀个FC（格式化上下⽂），块 级盒⼦属于BFC（块级格式化上下⽂），⾏内级元素属于IFC（⾏内格式化上下⽂）。 BFC就是⽤来决定块级盒⼦是如何排布的 在BFC中，块级盒⼦是⼀个挨着⼀个在垂直⽅向排布的，垂直⽅向的间距由margin属性决定，并且在同⼀个 BFC中，两个相邻的box之间margin会折叠。 这个就是BFC的官⽅解释。

问题⼆⾯试回答：

创建BFC的⽅式⾮常多，要根据不同的场景使⽤不同的⽅式。 ⽐如HTML元素本身就是创建了⼀个BFC，浮动元素、绝对定位元素、inline-block、表格元素以及很多⼦元素 都会创建BFC。 在开发中我们想要在很多情况下不影响布局创建BFC，⽐较常⽤的是将overflow设置为⾮visible，⽐如auto就 可以创建BFC。

09-开发中会使⽤BFC解决哪些问题？它是如何解决的？

BFC在开发中主要解决两个问题：

解决margin的折叠问题； 解决浮动⾼度塌陷问题；

作⽤⼀：解决margin的折叠问题

从上⾯的内容我们可以知道，BFC可以解决BFC的margin折叠的问题，如果两个块级盒⼦不处于同⼀个BFC中，那 么它们的margin就不会折叠了。 官⽅⽂档明确的有说： The vertical distance between two sibling boxes is determined by the 'margin' properties. Vertical margins between adjacent block-level boxes in a block formatting context collapse. 那么如果我们让两个box是不同的BFC呢？那么就可以解决折叠问题。

< !DOCTYPE html>
< html lang="en">
< head>

  < meta charset="UTF-8">

  < meta name="viewport" content="width=device-width, initial-scale=1.0">

  < title>Document< /title>

  < style>

  .box1,

  .box2 {

  height: 200px;

  }

  .container {

  overflow: auto;

  }

  .box1 {

  background-color: #789;

  margin-bottom: 30px;

  }

  .box2 {

  margin-top: 60px;

  background-color: #18f;

  }

  < /style>

1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27

作⽤⼆：解决浮动⾼度塌陷问题

⽹上有很多说法，BFC可以解决浮动⾼度塌陷，可以实现清除浮动的效果。 但是从来没有给出过BFC可以解决⾼度塌陷的原理或者权威的⽂档说明； 他们也压根没有办法解释，为什么可以解决浮动⾼度的塌陷问题，但是不能解决绝对定位元素的⾼度塌陷问题 呢？ 事实上，BFC解决⾼度塌陷需要满⾜两个条件： 浮动元素的⽗元素触发BFC，形成独⽴的块级格式化上下⽂（Block Formatting Context）； 浮动元素的⽗元素的⾼度是auto的； BFC的⾼度是auto的情况下，是如下⽅法计算⾼度的

1.  如果只有inline-level，是⾏⾼的顶部和底部的距离；
2.  如果有block-level，是由最顶层的块上边缘和最底层块盒⼦的下边缘之间的距离
3.  如果有绝对定位元素，将被忽略；
4.  如果有浮动元素，那么会增加⾼度以包括这些浮动元素的下边缘

那么也就意味着我们如果让某⼀个⾼度为auto的元素，变成⼀个BFC，那么它会增加⾼度包裹浮动元素的下边缘。

< /head>
< body>

  < div class="container">

  < div class="box1">< /div>

  < /div>

  < div class="box2">< /div>

< /body>
< /html>

28 29 30 31 32 33 34 35 36 37 38

⾯试问题回答：

BFC在开发中主要可以⽤来解决两个问题：解决margin的折叠问题和解决浮动元素⾼度塌陷问题。 解决margin的折叠问题是通过让两个垂直⽅向的盒⼦处于不同的BFC中，因为在同⼀个BFC会折叠，那么处于 不同的BFC时就不会折叠了 解决浮动元素⾼度塌陷问题是源于⼀个盒⼦是BFC时，它⾼度的计算规则，当⼀个盒⼦是BFC并且⾼度设置为 auto时，它会在计算⾼度时要求增加⾼度以包裹浮动元素的下边缘，那么为了包裹浮动元素的下边缘增加了 ⾼度，就不会出现⾼度塌陷的问题了。

< !DOCTYPE html>
< html lang="en">
< head>

  < meta charset="UTF-8">

  < meta name="viewport" content="width=device-width, initial-scale=1.0">

  < title>Document< /title>

  < style>

  .container {

  background-color: #17f;

  overflow: auto;

  }

  .item {

  width: 300px;

  height: 200px;

  background-color: #f71;

  float: left;

  border: 1px solid slateblue;

  }

  < /style>
< /head>
< body>

  < div class="container">

  < div class="item">item1< /div>

  < div class="item">item2< /div>

  < div class="item">item3< /div>

  < /div>
< /body>
< /html>

1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30

10-通常会采取哪些措施来确保⽹站或者应⽤在不同的浏览器上的兼容性？

我认为可以从这⼏个⻆度来回答。 其实在现代⼯程化的开发架构下，⼤多数的浏览器兼容性问题是可以通过⼯程化中的配置选项来解决的。

1.  ⽐如browserslist可以配置⽬标的浏览器或者Node环境，然后在不同的⼯具中起作⽤，⽐如 autoprefixer/babel/postcss-preset-env等，在进⾏了正确的配置后，开发的Vue或者React项⽬在进⾏打包 时，会⾃动根据⽬标环境来添加CSS前缀、Babel代码转换等。
2.  如果我们想要额外的适配，通常在项⽬中我们还会引⼊normal.css和polyfills来添加特定的CSS、JS的适配问 题
3.  还有⼀些事针对移动端的，⽐如移动端点击300ms的延迟、移动端1px边框的问题，都可以在特定的环境或 者需求下来解决
4.  当遇到问题时，很重要的事我们需要多查询caniuse的⽹站来确定某些特性的兼容性
5.  另外如果针对特定的⽤户使⽤的事不同的浏览器和设备时，我们需要使⽤特定的⼯具，⽐如BrowserStack 这样的⼯具来进⾏测试，遇到特定问题时，及时的解决和处理。

举⼀个具体的例⼦：

⽐如之前我们在开发中借助于transform实现动画效果，使⽤的是复合属性，transform: translate(10px, 20px) scale(1.5);。 但是这种复合属性在IE11上是有问题，因为它并不⽀持，所以我们就必须对它拆分属性，⾸先设置 translate，在它的外层再包裹⼀个容器，⽤来设置scale属性。 如果还是不能解决，也可以通过JavaScript代码来处理，可以更加精准的根据不同的浏览器来
