```js
let nextEffect :FiberNode | null = null;
eexport const commit MutationEffects = (finishedWork:FiberNode){
    nextEffect = finishedWork;
    while(nextEffect!== null) {
        //向下遍历
        if((nextEffect.subtreeFlags & MutationMask)!== NoFlags && nextEffect.child!== null) {
            nextEffect = nextEffect.child;
            //继续向下遍历的
        }else if(nextEffect.sibling!== null) {
            nextEffect = nextEffect.sibling;
        }else {
            //向上遍历
            up:while(nextEffect!== null) {
                const sibling:FiberNode | null = nextEffect.sibling;
                if(sibling!== null) {
                    nextEffect = sibling;
                    break up;
                }
                const returnFiber:FiberNode | null = nextEffect.return;
                if(returnFiber === null || returnFiber.tag === HostRoot) {
                    nextEffect = null;
                    break up;
                }
                nextEffect = returnFiber;
            }
        }
    }

};
const commitMutationEffectsOnFiber = (finishedWork:FiberNode) {
    const flags =  finishedWork.flags
    if((flags & MutationMask)!== NoFlags) {
        commitPlacemenet(finishedWork);
        finihsedWork.flags &= ~ Placement;

}
const commitPlacement = (finishedWork:FiberNode) => {
    // parent DOM
    const hostParent = getHostParent(finishedWork);
    // finishedWork -DOM append parent Dom
    if(hostParent !== null){
        appendPlacementNodeIntoContainer(finishedWork,hostParent)
    }



    //finihsedWork->
    if(__DEV__){
        console.warn('执行Placement操作')
    }
};
function getHostParent(f:FiberNode){
    let parent = f.return;
    while(parent!== null) {
        const parentTag = parent.tag;
        if(parentTag === HostComponent) {
            return parent.stateNode as Container;
        }
        if(parentTag === HostRoot) {
            return (parent.stateNode as FiberRootNode).container;

        }
        parent = parent.return;
    }
}
export class FiberRootNode {
    containerInfo:Container;
    current:FiberNode;
    finishedWork:FiberNode | null;
    constructor(containerInfo:Container,current:FiberNode) {
        this.container = container;
        this.current = hostRootFiber;
        hostRootFiber.stateNode = tthis;

        this.finishedWork = null;

    }

}
function appendPlacementNodeIntoContainer(fiberNode:FiberNode) {
    finishedWork:FiberNode;
    hostParent:Container

}{
    // fiber host
    if(finishedWork.tag === HostComponent||finshied.tag === HostText){
        appendChildContainer(finishedWork.stateNode,hostParent)
        return ;

    }
    const child = finishedWork.child;
    if(child!== null){
        appendPlacementNodeIntoContainer(child,hostParent);
        let sibling = child.sibling;
        while(sibling!== null) {
            appendPlacementNodeIntoContainer(sibling,hostParent);
            sibling = sibling.sibling;

        }

    }
}
// react -recon;ciler
// dependencies:shared,react-reconciler当前环境的生产环境依赖
// peerDependencies:react:workspace*并不会随着当前环境的依赖安装而安装的
export type Container  =Element;
export const createInstance = (type:string,props:any){
    // 处理props
    const element = document.createElement(type)
    return element;
};；
export const appendInitialChild = (parent：Instance，child：Instance)=>{
    appendChild（node；Element）:Element
    parent。appendChild(child);

}
export const createTextInstance = (content:string)=>{
    return document.createTextNode(content);
};
//React DOM.createRoot(root).render(App/)
export function createRoot(container:Container){
    const root = new FiberRootNode(conatainer);
    return {
        render(element:ReactElementType){
            updateConatiner(element,root)
        }

    }
}

// 打包reactDOM
// 兼容原版的react的导出
// 处理hostConfig的指向
// webpack resolve alis
alias ({
    entries:{
        hostConfig:"./hostConfig"

    }
})
generatePackageJson({
    inputFolder:pkgPath,
    outputFolder:distPath,
    baseContent:({name,description,version})=>({
        name,
        description,
        version,
        main:"index.js",
        module:"index.js",
        types:"index.d.ts",
        sideEffects:false,
        peerDependencies:{
            react:"^18.0.0"

        },
        files:["esm","cjs","types"]

    })

})
export function getBaseRollupPlugins({
    alias= {
        _DEV_:true,
        preventAssignment:true,
    },
    tyescript = {}
}={}){
    return [replace(alias),cjs(),ts(tyepscript)];
}
ReactDOM.createRoot(root).render(<App/>)

```
- //react ,index.js,jsx-dev-runtime.js
- // jsx-dev-runtime.js
- //react-dom,client.js,index.js