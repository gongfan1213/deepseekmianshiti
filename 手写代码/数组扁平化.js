function getParentNodeByLevel(tree,targetId,level) {
    let result = [];
    const traverse = (tree,targetId,level) => {
        const newPath = [...Path,node];
        if(node.id===targetId){
            result = currentLevel >level ?newPath.slice(0,level +1):newPath;
            return true;
        }
        if(node.children){
            for(const child of node.children){
                if(traverse(child,currentLevel+1,newPath))return true;
            }
        }
