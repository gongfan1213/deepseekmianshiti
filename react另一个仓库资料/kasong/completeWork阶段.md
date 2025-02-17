- 根据wip.tag区分对待
- 创建或者标记元素更新
- flags冒泡
- 步骤:        与beginWork类似，completeWork也会根据wip.tag区分对待，流程大体包括两个        
(1)创建或者标记元素更新;(2)flags冒泡。
- beginWork 的 reconcileChildFibers方法用来“标记fiberNode的插入、删除、移动”。
- completeWork方法的步骤（1)会完成“更新的标记”。当完成步骤(1)后，该fiberNode在本次更新中的增、删、改操作均已标记完成。
- 至此，Reconciler中“标记flags”相关工作基本完成。但是距离在Renderer中“解析flags”还有一项很重要的工作要做，这就是 flags 冒泡。

##  flags 冒泡。
-当重新流程经过 Reconciler 以后,会得到一颗 WipFiber Tree,其中部分 fiberNode .标记 flags. Renderer需要对被标记的 fiberNode 对应的的 DOM元素"执行 “flags 对应的
的 DOM 操作"如何找到这些散落在wip fiber tree各处的被标记的fiberNode的呢？flags冒泡的作用
- completeWork属于归阶段，从叶子元素开始整体流程是自下而上的，subtreeFlags记录了该fiberNode的所有的子孙fiberNode上被标记的flags每一个fiberNode经过如下的操作，可以把子孙fiberNode当中标记的flags向上冒泡一层
  
```js
let subrtreeFlags = NoFlags;
subtreeFlags |= child.subtreeFlags;//收集子fiberNode的子孙的fiberNode当中标记flags
subtreeFlags |= child.flags;//收集子fiberNode当中标记的flags
completedWork.subtreeFlags |= subtreeFlags//附加在当前fiberNOde的subtreeFlags上的

```
- 当hostRootFiber完成completeWWork整棵Wip Fiber Tree当中所有的被标记的flags都在HostRootFiber.subtreeFlags当中定义，在renderer当中，通过任意一级的fiberNode.subtreeFlags都可以快速确定该fiberNode所在的子树是否存在副作用需要执行
## mount概览
- 与beginWork相同，completeWork通过current!===null判断是否处于update流程，在mount流程当中首先通过createInstance创建fiberNode对应的dom元素
- 然后执行appendAllChildren方法，将下一层DOM元素插入“createInstance方法创建的DOM元素”中，具体逻辑为:
- (1)从当前fiberNode向下遍历，将遍历到的第一层DOM元素类型(HostComponent, HostText)通过appendChild方法插入parent末尾:
- (2)对兄弟fiberNode执行步骤(1):
- (3)如果没有兄弟fiberNode，则对父fiberNode的兄弟执行步骤(1):(4)当遍历流程回到最初执行步骤(1)所在层或者parent所在层时终止。

```js
appendAl1Children - function (parent, workinProgress，/省略参数/){
 let node - workInProgress.child;
while (node !== null){
// 步骤1，向下遍历，对第一层DOM元素执行appendChild
if (node.tag =-=HostComponent || node.tag ===HostText) {
// 对HostComponent、HostText执行appendChild
appendInitialChild(parent,node.stateNode);
} else if (node.child !== null){
// 继续向下遍历，直到找到第一层 DOM元素类型
node.child.return = node;
node = node.child;
continue;
// 终止情况1:遍历到parent对应FiberNode
if (node === workInProgress){
return;

// 如果没有兄弟fiberNode，则向父 fiberNode 遍历 w
hile (node.sibling === null){
// 终止情况2:回到最初执行步骤1所在层
if(node.return === null || node.return ===workInProgress){
return ;
}
node=node.return;
}
//对兄弟fiberNode执行步骤1
node.sibling.return =node.return;
node = node.sibling;
}};

```

- appendAllChilden和flags冒泡类似，处理某个元素下一级的元素的，flags冒泡处理的是下一级的flagsappendAllChildren处理的是下一级的dom元素的类型，fiberNode的层级和dom元素的层级可能不是意义对应的
```js
<div>
hello
<world/>
</div>

```
<World/></div>
- 从fiberNode的角度看，“Hello”fiberNode与World fiberNode同级。
- 但是从DOM元素的角度看，“Hello”TextNode与HTMLSpanElement同级。所以从 fiberNode中查找同级的DOM元素，可能需要跨fiberNode层级查找。
- completeWork流程接下来会执行finalizeInitialChildren方法完成属性的初始化，包括如下几类属性:
- styles，对应setValueForStyles方法:
- innerHTML，对应setInnerHTML方法;
- 文本类型children，对应setTextContent方法:
- 不会在DOM中冒泡的事件，包括cancel、close、invalid、load、scroll、toggle,对应listenToNonDelegatedEvent方法:
- 其他属性，对应setValueForProperty方法。
- 最后，执行bubbleProperties方法将flags冒泡。completeWork在mount时的流程总结如下:
- (1)根据wip.tag进入不同处理分支;
- (2)根据current !=- null 区分 mount与update 流程;
- (3)对于HostComponent，首先执行createInstance方法创建对应的DOM元素;
- (4)执行appendAllChildren将下一级DOM元素挂载在步骤(3)创建的DOM元素下;
- (5)执行finalizeInitialChildren完成属性初始化;
- (6)执行bubbleProperties 完成flags冒泡。
- 现在来回答在3.2.1节中提出的问题:如果mountChildFibers不标记flags,mount时如何完成UI渲染?
- 由于appendAllChildren方法的存在，当completeWork 执行到HostRootFiber时，已经形成一棵完整的离屏DOMTree。再观察图2-9，mount时构建Wip Fiber Tree，并不是所有 fiberNode都不存在alternate。由于HostRootFiber存在alternate(即 HostRootFiber.current!=null )，因此HostRootFiber在beginWork时会进入reconcileChildFibers而不是mountChidFibers，他的子fiberNode会被标记Placement
- render会发现本次更新流程当中存在一个placement flag,执行一次parentNode.appendChild或者parent.insertBefore就可以将已经构建好的离屏的DOM tree插入到页面当中，如果mountChildFibers也会标记Flags那么对于首屏渲染这样的初始化的场景，就需要执行大量parentNode.appendChild或者parentNode.insertBefore方法，相比之下，离屏构建后再执行一次插入性能更佳
## update概览
- 基于hostComponent的completeWork的update流程
- mount属性的初始化，update完成标记属性的更新,updateHostCompoennt主要逻辑在diffProperties方法当中，包括两次遍历
- 第一次便利:标记删除更新前有更新后没有的属性
- 第二次遍历：标记更新，update流程前后发生改变的属性
- 根据新的属性值更新 DOM 元素的属性，
```js
chatgt生成的
function diffProperties(
  domElement, // 要更新的 DOM 元素
  tag, // 元素的标签名
  lastRawProps, // 上一个属性对象
  nextRawProps, // 下一个属性对象
  rootContainmentElement // 根容器元素
) {
  // 1. 获取上一个和下一个属性的键
  const lastPropsKeys = Object.keys(lastRawProps);
  const nextPropsKeys = Object.keys(nextRawProps);

  // 2. 创建一个集合来存储需要更新的属性
  const updatePayload = [];

  // 3. 遍历上一个属性对象，检查哪些属性需要被移除或更新
  for (const key of lastPropsKeys) {
    const lastValue = lastRawProps[key];
    const nextValue = nextRawProps[key];

    // 4. 如果下一个属性中没有这个键，说明需要移除这个属性
    if (nextValue == null) {
      updatePayload.push({ type: 'REMOVE', key });
    } else if (lastValue !== nextValue) {
      // 5. 如果值不同，说明需要更新这个属性
      updatePayload.push({ type: 'UPDATE', key, value: nextValue });
    }
  }

  // 6. 遍历下一个属性对象，检查哪些属性是新增的
  for (const key of nextPropsKeys) {
    if (!(key in lastRawProps)) {
      // 7. 如果上一个属性中没有这个键，说明是新增的属性
      updatePayload.push({ type: 'ADD', key, value: nextRawProps[key] });
    }
  }

  // 8. 根据更新的 payload 更新 DOM 元素
  for (const update of updatePayload) {
    switch (update.type) {
      case 'REMOVE':
        // 9. 移除属性
        domElement.removeAttribute(update.key);
        break;
      case 'UPDATE':
        // 10. 更新属性
        domElement.setAttribute(update.key, update.value);
        break;
      case 'ADD':
        // 11. 添加新属性
        domElement.setAttribute(update.key, update.value);
        break;
    }
  }
}
```

```js
function diffProperties (domeElement,tag,lastRawProps,nextRawProps,rootContainerElement) {
  let updatePayload= null;
  //保存变化的属性key,value
  let lastProps;
  //更新前的属性
  let nextProps;
  //标记删除更新前有，更新后没有的属性
  for(let key in lastRawProps) {
    if (nextRawProps.hasOwnProperty(key)) {
      if (nextProps.hasOwnProperty(propKey) || !lastProps.hasOwnProperty(propKey) || lastProps[propKey] =null) {
        // 属性值不同
        continue;
      }
      //处理style
      if(propKey ==== STYLE) {

      }else {
        //其他属性
        (updatePayload= updatePayload || []).push(propKey,null);
      }
    } 
    // 标记更新update流程前后发生改变的属性
    for(propKey in nextProps ) {
      let nextProp = nextProps[propKey];
      let lastProp = lastProps!= null ?lastProps[propKey] : undefined;
      if (!nextProps.hasOwnProperty(propKey) || nextProp === lastProp || nextProp === null&& lastProp === null) {
        continue;
      }
      //处理style
      if(propKey ==== STYLE) {
    }else if (propKey ==== CHILDREN){

    }else if(propKey ===DANGEROUSLY_SET_INNER_HTML){
      //省略处理innerHTMl
    }else if(registrationNameDependencies.hasOwnProperty(propKey)) {
      if(nextProp!=null) {
        //省略处理onScroll事件
      }else{
        //省略处理其他属性
      }
    }
    //省略代码
    return updatePayload;
}

```

- 所有的变化属性的key,value会保存在fiberNode.updateQueue当中,同时该fiberNode会标记update
- - workInProgress.flags |=update
  - 
