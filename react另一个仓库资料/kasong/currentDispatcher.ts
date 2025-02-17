const currentDispatcher :{current:Dispatcher | null}= {

    current: null
}
export interface Dispacther {
    useState :<T>(initialState:(()=>T |T)=>(T,Dispatche));
}
export type Dispatch<State>=(action:Action<State>) =>void;

export const resolveDispatcher=() => {
    const dispatcher =currentDispatcher.current;
    if(dispatcher ===null){
        throw new Error(" hooks只能在函数组件当中执行")

    }
    
}
export default currentDispatcher;
//index.ts
export const useState :Dispatcher['useState'] =(initialState) => {
    const dispatcher = resolveDispacther();
    return dispatcher.useState(initialState);

}
export const _SCRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRE = () => {
    currentDispatcher 
}
// internals.ts
const internals = React._SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRE();
export default internals;
