- 基于useState和lane优先级机制，实现的内置的hooks
- 以比较低的优先级调度一个更新的，
- 实现原理
- useState和startTranistion方法组合构成的

```
//mount的时候
function mountTransition() {
const [isPending ,setPending] = mountState(false);
const start = startTransition.bind(null,setPneidng);
const hook = mountWorkInProgressHook();
hook.memoizedState = start;
return [isPending,start];
}
//update的时候
function updateTransition() {
const [isPeding ] =updateState(false);
const hoook = updateWorkInprgressHook ();
const start = hook.memoizedState ;
return [isPending ,start];
}
```

- dstartTransition方法和batchedUpdates方法类似的，只是将操作对象从batchedContext变成了treactCurrentBatchConfig.transition

```js
function startTransition(setPneding,callback) {
//保存之前的更新的优先级
const previousPriprity = getCurrentUpdatePriiority();
//设置当前更新的优先级
setCurrentUpdatePriority(
higherEventPriority(previousPrioprity,ContinuousEventPriority);
);
//触发isPending状态更新，trye
setPneding(true);
//保存之前的transition上下文
const prevTranistion = ReactCurrentBatchConfig.transition
//设置当前的transition上下文
ReactCurrentBatchConfig.transition =1;
try {
//触发isPneding状态更新
setPending(false);
//执行回调函数
callback();
}finally{
//重置更新优先级和transition上下文
setCurrentUpdatePriority(previousPriority);
ReactCurrentBatchConfig.transition = prevTransition;
}
}
```
- ReactCurrentBatchConfig用于标记本次批处理是否属于transition上下文
- SyncLan优先级高于TransitionLanes优先级的

```js
function requestUpdateLane(fiber) {
//NoTransition ===0
const isTransition = requestCurrentTransition()!==NoTranaistion;
if(isTransition) {
//本次更新处于transition上下文
if(currentEventTransitionLane ===NoLane） {
currentEventTransitionLane = claimNextTranstionLnae();
}
//返回tranistion相关的lane
return currentEventTransitionLane;
}}
```


- 由于startTranistion方法会设置当前的transition的上下文，当处于transition上下文的时候,requestUpdateLane方法会返回ransition相关的lane

```js
function startTransition(setPneding,callback) {
//保存之前的transition
const prevTransition = ReactCurrentBatchConfig.transition ;
//设置当前的transition
ReactCurrentBatchConfig.transition =1;
//省略代码
}
```

- transition相关的·lane的优先级是略低于默认优先级的DefaultLane
- urgent updates需要立即得到相应的，并且需要看到更新后的效果的
- transition updates不需要立即得到相应的只需要看到状态过度前后的效果
- startTransition类似于debounce的防抖的效果
- lane模型的entangle纠缠实现的

# entangle机制
- entangle是指的是lane之间的一种关系的,如果laneA和laneB entangle，代表laneA和laneB不能单独进行调度，他们必须处于一个lanes当中才能进行调度的
- 两个lane纠缠在一起的，必须同生公司，除此之外，如果laneC和laneA纠缠，接下来laneA和laneB纠缠，，那么laneC同样和laneB纠缠的
- root。entangledLanes用于保存纠缠的lanes
- root.entanglements长度为31位的数组，每一个索引的位置保存一个lanes,用于保存root.entangledLanes当中每一个lane都和那些lanes发生的纠缠































