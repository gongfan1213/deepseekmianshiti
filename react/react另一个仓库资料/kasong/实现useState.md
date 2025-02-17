- hooks不可以脱离 function component的上下文的
- 不同上下文调用的hooks不是同一个函数的
- 不同上下文有不同的实现的
- 创建了内部数据共享层，当前使用的hooks的集合
- 实现内部数据共享层的时候注意事项
- 以浏览器举例，reconciler+hostConfig =ReactDOM 
- 增加内部数据共享层，意味着Reconciler和react产生关联，，进而意味着reactDOM和react产生关联
- 如果两个包产生关联，在打包的时候需要考虑，两者的代码是打包在一起还是分开的，如果打包在一起的话，意味着打包后的ReactDOM当中包含React代码，那么ReactDOM当中会包含一个内部数据共享层，react当中会包含一个内部数据共享层，react也会包含一个内部数据共享层，这两者不是同步一个内部数据共享层，我们希望共享数据，所以不希望ReactDOM当中包含React的代码
- extneral不会打包进去的
- hook如何知道自身数据保存在哪里的呢？
```js
function App() {
    const [num] = useState(0);
}
let currentlyRenderingFiber : FiberNode | null = null;
let workInProgressHook : Hook | null = null;

interface Hook {
    //满足所有的Hooks的使用的
    memoizedState: any;
    updateQueue: unknown;
    baseState: any;
    baseUpdate: Update<any> | null;
    queue: UpdateQueue<any> | null;
    next: Hook | null;
}
export function renderWithHooks (wip:FiberNode) {
    //赋值操作 
    currentlyRenderingFiber = wip;
    wip.memoizedState = null;
    const Component = wip.type;
    const props = wip.pendingProps;
    const children = Component(props);
    // 重置操作
    curentlyRenderingFiber = null;
    //memoizedState保存状态的FiberNode,memoizedState - >useState->useEffect->useState
    const current = wip.alternate;
    if(current!== null){
        wip.memoizedState = current.memoizedState;
        //update
    }else{
        //mount
        currentDIspatch.current =HooksDispatcherOnMount;

    }


    return children;
}
const HooksDisapctherOnMount :Dispatcher ={
    useState:mountState,

}
function mountState<State> (
    initialState:(()=>State) |State
):[State,Dispatch<BasicStateAction<State>>]{
    //找到当前useState对应的hook对应的数据
    const hook = mountWorkInProgressHook();
    let memoizedState ;
    if(initialState instanceof Function) {
        memoizedState = initialState();
    }else {
        memoizedState = initialState;

    }
    const queue = createUpdateQueue<State>();
    hook.memoizedState = memoizedState;
    hook.queue = queue;
    const dispatch = dispatchAction.bind(null,currentlyRenderingFiber,queue);

    return [memoizedState,dispatch];


}
function dispatchSetState<State>(fiber:FiberNode,updateQueue:UpdateQueue<State>) {
    const update =createUpdate(action);
    enQueueUpdate(updateQueue,update)
    scheduleUpdateOnFiber(fiber);
    //创建update,enqueueUpdate,schedeleUpdateONFiber

}
function mountWorkInProgressHook():Hook {
    //workInPorgress:Hook
    const hook :Hook = {
        memoizedState:null,
        updateQueue :null,
        next:null 
    }
    if(workInProgressHook = null) {
        // MOUNT的时候第一个hook
        if(currentlyRenderingFiber === null){
            throw new Error('请在函数组件内调用hoook')

        }else {
            workInProgressHook = hook;
            currentlyRenderingFiber.memoizedState = workInProgressHook;

        }

    }else {
        //mount的时候后续的hook
        workInProgress.next=hook;
        workInProgressHook = hook;

    }
    return workInProgressHook;
}
function App() {
    useState()
    const [x,dispatch] = useState();
    window.dispatch =dispatch;
    //参数在暴露在的dispatch的函数当中的，调用dispatch方法,
    dispatch方法预支了

}
window.useState()
//useState 

```
- 可以记录当前正在render的FC对应的fiberNode,在fiberNode当中保存数据
- 实现useState
- 1.实现mount的时候useState的实现
- 2.实现dispatcher的方法，并用来接入现有的个更新流畅内
