function ChildReconciler(shoudTrackEffects:boolean) {
    function reconcileSignElement(
        returnFiber: FiberNode,
        currentFiber: FiberNode | null,
        element: ReactElementType


    ){
        //根据element创建对应的fiber
        const fiber = createFiberFromElement(element)
        fiber.return = returnFiber;
        return fiber;
    }
}
function reconcileSingleTextNode(
    returnFiber: FiberNode,
    currentFiber: FiberNode | null,
    element: string | element

) {
    const fiber = new FiberNode(HostText,{content},null)
    fiber.return =returnFiber;
    return fiber;
}
function placeSingleChild(fiber:FiberNode) {
    if(shoudlTrackEffects && fiber.alternate === null) {
        fiber.effectTag = Placement;

    }
    return fiber;
}