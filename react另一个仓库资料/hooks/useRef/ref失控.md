- 保存对dom对象的引用
- 任何需要被引用的数据都可以保存在ref当中
- 在mount和update的时候对应两个不同的dispatcher

```js
function mountRef(initialvalue){
const hook = mountworkInProgressHook();
const ref ={curreny:initialvalue);
const memoizedState = ref;
return ref;
}
function updateRef（initialValue）{
const hook = updatWorkInProgressHook（）；
//返回保存的ref
return hook。memoizedState;
}
```
- react。createRef方法也会创建同样的数据结构的ref

```js
function createRef(){
const refObject = {
current:null;}
return refObject;}
```

- 有多种组建类型可以赋值ref props,比如HostComponent,ClasscOmponent,ForwardRef,
- ref的工作流程分为两个阶段
- render阶段标记ref flag
- commit阶段，根据ref flag执行ref相关的操作
- markrRef的方法用于标记ref flag

```js
function markRef(current,workInProgress){
const ref = workInProgress.ref;
if((current === null && ref!==null)|| (current !==null )&&current.ref !==ref)){
//标记ref tag
workInProgress。flags ｜= ref;
}
}
```


- 以下这两种情况会标记ref flag
- mount的时候，current ===null ref props存在的时候
- update的时候并且ref,props发生了变化
- 对于标记了ref flags的fibernode在commit阶段的mutation子阶段，首先会移除旧的ref


```js
function commitMutationEffectedOnFiber（finishedWork，root）{
if(flags &Ref){
const current = finishedWork.alternate;
if(current!==null){
//移除旧的ref
commitDetachRef（current）；
}}}
```

```js
function App() {
const inputRef = useRef(null);
useEffect(()=> {
inputRef.current.focus();
inputRef.current.getBoundingClientRect();
inputRef.current.style.width = '500px';
},[]);
return <input ref ={inputRef}/>;
}
```
- 操作3不推荐使用的，不确定是不是开发者直接操作dom的结果，当开发者直接通过
- ref操作本应该是react进行的dom操作的时候，ref就会失控
- 当前渲染的视图不符合预期的时候。开发者只需要在试图对应的组件逻辑和ui
- 当中寻找原因，当ref失控的时候，除了正常情况下，还要排查是不是开发者直接操作的dom导致的，以及是不是开发者直接操作dom与react操作dom之间的冲突导致的
- 由于开发者通过ref操作dom进行本应该由react进行的dom操作造成的，但是react不能阻止开发者直接操作dom，也无法接管所有的dom操作，使得开发者完全没有直接操作dom的需求，
- 如何在这种情况下减少ref的失控
# ref失控的防止
- 防：控制ref失控影响的范围，使得ref失控造成的影响更容易被定位的
- 治：从ref引用的数据结构入手，尽力避免可能引起的失控的操作
- 防：
- 高阶组件
- 低阶组件
- 低阶组件是基于dom封装的组件，比如下面的组件，直接基于input元素封装的

```js
function MyInput(props) {
return <inpur {...props}/>
}
```

- 高阶组件是基于低阶组件封装的组件，
- 高阶组件无法直接将ref指向dom，这个限制将ref失控的范围控制在单个组件内，不会出现跨域组件的ref的失控，

  ```js
  function MyInput(props) {
  return <input {...props}/>;
  }
  function MyForm() {
  const inputRef = useRef(null);
  function onClick(){
  inputRef.current.focus();
  }
  return (
  <>
  <MyInput ref= {inputRef/>
  <button oonClick ={onClick}>聚焦input</button>
  </>
  );
  }
  ```

  
  - 点击button按钮程序会出现报错。因为myform组件当中向MyInput传递ref失败，inputRef.current并没有指向input元素，原因是上文提到的为了将ref失控的范围控制在单个组件内，react默认情况下不支持跨组件传递ref
  - 默认情况下不支持跨组件传递ref
  - 取消这个限制可以使用forwardref
  - useImperativeHandle使用ref的时候向父组件传递自定义的引用值
  - useImperativeHandle(ref,createHandle,[deps]);
  - 经过·useImpoerativeHandle处理过的ref可以人为的移除可能造成的ref失控的属性或者方法

```js
const MyInput = forwardRef((props,ref)=>{
const reaulInputRef = useRef(null);
useImpoeratveHnalde(ref,()=>({
focus() {
realInputRef.current.focus();
},
}));
return <input {...props} ref={realInputRef}/>;
});
```



