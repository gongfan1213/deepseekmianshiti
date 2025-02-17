import { appendInitialChild } from './completeWork';
export const completeWork = (wip:FiberNode) => {
    //递归当中的归
    const newProps = wip.pendingProps;
    const current = wip.alternate;
    switch(wip.tag) {
        case HostText:
            if(current!===null && wip.stateNode) {
                //update 

            }else {
                // 1.构建dom
                const instance = createTextInstance(newProps.content) 
                wip.stateNode=instance;
            }
            bubbleProperties(wip);
            break;
        case HostRoot:
            break;
        case HostComponent:
            if(current!== null && wip.stateNode!== null) {
                updateHostComponent(wip,current,newProps)+
            } else {
                if(current!== null) {
                    //update
                } else {
                    //mount
                    mountHostComponent(wip,newProps)
                }
                const intsance = createInstance(wip.type,newProps)
                // node.tag === HostText将dom树添加到dom   
                appendAllChilld(wip.stateNode,wip)                       }
                wip.stateNode = instance
            break;
        default :
            if(_DEV_) {
                console.warn('未实现的类型')

            }
            break;
    }

}
//构建dom,将dom树插入到树当中
//hostConig
export const createInstance = 
function appendAllCHilren(parent:FiberNode, wip:FiberNOde) {
    let node = wip.child;
    while(node!== null){
        if(node.tag === HostText || node.tag === HostComponent) {
            parent.appendChild(node.stateNode)
    }else if(node.child!==null){
        node.child.return = node;
        node = node.child;
        continue;
    }
    while(node.sibling ==null) {
        if(node.return === null || node.return === wip) {
            return;
        }
        node = node.return;

    }
    node.sibling.return = node.return;
    node = node.sibling;

    if(node.tag === HostText || node.tag === HostComponent) {
        parent.appendChild(node.stateNode)
        appendInitialChild(parent,node)
}
export const appendInitialChild = (parent:FiberNode,workInProgress:FiberNode) => {
    if(workInProgress.tag === HostText) {
        return;
    }
    const child = workInProgress.child;
    if(child!== null) {
        appendAllCHilren(parent,child)
        return;
    }
    if(sibling!== null) {
        appendAllCHilren(parent,sibling)
        return;
    }
}
//createText,hostTtext不存在child的，

function bubblePrperties(fiber :FiberNode) {
    let substreeFlag =NoFlags ;
    let child = wip.child ;
    while(child! ==null){
        subtreeFlags !=child.subtreeFlag;
        subtreeFlags|=child.flag;
        child.return = wip;
        child = child.sibling;

    }
}
//compelteWork当中每一个都是bubllePropties

const finishedWork =root.current.alternate
root.finishedWork = finishedWork; 
