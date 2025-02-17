- flags都在reactFiberFlags.js当中定义的
- 以Int3232位的有符号整数，
- 标记flags的本质就是二进制数的位运算
- mountedChildFiber不标记flags，reconcileChildFiber当中会标记的flags主要和元素的位置有关的包括childDeletion删除和placement插入或者移动操作
- 状态，优先级的操作
- Svelte在标记dirty

### 位运算在标记状态当中的应用
- 内部有多个上下文，在执行方法的时候经常需要判断当前处于哪个上下文环境当中
- NoContext,BatchedContext,RenderContext,,0b0000,0b0100;
- 当流程将进入到render阶段的时候会使用按位或标记进入对应的上下文当中，
- 按位与或非

  
```js
const NoContext = /*  */0b0000;
const BatchedContext = /*    */0b0001;
const RenderContext= /*  */ 0b01000;
let executionContext = NoContext;
executionContext |=RenderContext;
executionContext &= ~RenderContext;
(executionContext&RenderContext)~==NoContext;

```

