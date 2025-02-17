// 递归当中的递的阶段
export const beginWork = (wip: FiberNode) => {
    //比较，返回子的fiberNode 
    switch(wip.tag) {
        case HostRoot:
// 计算状态的最新值创建子的fierbNode
            return updateHostRoot(wip)
        case HostComponent :
            return updateHostComponment(wip);
        case HostText:
            return;

        default:
            if(_DEV_) {
                console.warn('beginWork未实现的类型')
            }
            break;
    }
}
// updateWueue计算状态的最新值，base State,pendingUpdate,memoziedSTate
// 创建update的时候传递的是element
reactDom.createRoot(root).render(<App/>)

function updateHostRoot(wip: FiberNode) {
    const baseState = wip.memoizedState
    const updateQueue = wip.updateQueue as UpdateQueue<Element>;
    const pending = updateQueue.shared.pending;
    updateQueue.shared.pending = null;
    const {memoizedState} = processupdateState(baseState,pendingUpdate)
    wip.memoizedState = memoizedState;
    const nextChildren = wip.memoizedState;
    reconcoleChildren(wip,nextChildren)
    return wip.child;


}
function updateHostComponment( wip:FiberNode) {
    const NextProps = wip.pendingProps;
    const nextChildren = nextProps.children;
    reconcileChildren(wip,nextChildren)
    return wip.child;

}
 function reconcileChildren(wip: FiberNode,nextChildren: any) {
    const current = wip.alternate;
    reconcilerChildrenFibers(wip,current?.child,Children)
    if(current!== null) {
        // update
    } else {
        // mount
        wip.child = mountChildren(wip,nextChildren)
    }
 }

 //childFiber.ts
 function ChildReconciler(shoudTrackEffects: boolean) {
    function reconcileSingleElement( 
        return Fiber:FiberNode,
        currentFiber:FiberNode | null;
        element :ReactElementType
    ){
        //根据reactelement创建fiber并且返回
    }
    return function reconcilerChildrenFibers
    (returnFiber:FiberNode,currentFiber:
        FiberNode|null,
        newChild?:  ReactElementType  ) {
            //判断当前fiber的类型
            if(typeof newChild === 'object' &&  newChild!==null) {
                switch(newChild.$$typeof) {
                    case REACT_ELEMENT_TYPE:
                        return reconcileSignElement();

                    default:
                        if(_DEV_) {
                            console.warn('未实现的类型')
                        }
                        break;
                }
            } 
            //多节点情况ul>li*3
            //文本节点
            if(typeof newChild === 'string' || typeof newChild === 'single'){
                return reconcileSingleTextNode()
            }
            if(current !==null){
                //update流程
                wip.child = reconcileChild(wip,current?.child,children)
            }else {
                //mount流程
                wip.child = mountChildFibers(wip,null,children)

            }
        if(nextChildren === current)
 }
export const reconcileChildFiber = ChildReconciler(true)
export const mountChildFibers = ChildReconciler(false);
// mount不追踪副作用了，没有节点编辑，但是实际上对根节点一次placement
export default function createFiberFromElement(element: ReactElementType) {
    const {type,key,props} = element;
    let fiberTag :WorkTYag = FunctionComponent;
    if(typeof type === 'string') {
        // 一个divtype就是'div'
        fiberTag = HostComponent;

    }else if (typeof type ==='function') {
       console.warn('[为定义的type类型',element)

        
    }
    //当前fiberNode类型
    const fiber = new FiberNode(fiberTag,type,key)
    fiber.type = type;
    return fiber;

    const fiber = new FiberNode(HostComponent,element.type || null,element.key)
    fiber.pendingProps = element.props;
    return fiber;
}