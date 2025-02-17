- React.forwardRef会创建一个React组件，这个组件能够将其接收的ref属性转发到自己的组件树
- f，我们完全可以通过父组件将ref参数传递给子组件的input，然后获取input触发获取焦点。不过，通过前面对forwardRef的概述可以知道，这种方式是错误的，因为自定义函数组件是没有实例的，所以ref显示获取不到的实例，React会直接报错。
- React.forwardRef来解决上述问题。首先导入需要的钩子。
- 编写一个父组件，在父组件中使用子组件，并且使用useRef创建ref实例，赋值给子组件。
```js
const child = forwardRef((props, ref) => {
  return <input ref={ref} 
  placeholder ={props.placeholder}
  type="text"
  />;
});

function App(){
    const ref= useRef(null);
    const [placeholder,setPlaceholder] =useState('请输入搜索内容')

    const inputRef = useRef();
    const onClick =() => {
        console.log(ref.current.value)
    }
    useEffect(()=> {
        ref.current.focus();

    },[]);
  return (
    <div>
      <child placeholder={placeholder} ref={ref} />
      <button onClick={onClick)}>获取焦点</button>
    </div>
  );
};

```
- 在子组件中接收的ref属性并不是通过props传递过来的，而是通过子组件函数的第二个参数传递过来的。
# ref必须指向DOM元素
# forwardRef可以应用到高阶组件中
- 下面我们看一个示例，该示例实现了如下功能：通过memo创建高阶组件，给高阶组件设置自定义props，然后被包裹的子组件即可使用props获取父组件传递过来的ref属性了。
```js
//定义最内部的被包装的组件
const Content = (props:any) => {
    return <input ref={props.forwardedRef/>}
}
//通过memo钩子创建高阶函数的
//forwardref的第二个参数可以接受ref,在hoc外层对ref做处理
const Wrapper =forwardRef((props,ref) => {
    const ContentWarp = memo(Content);
    //forwardRef包裹的是wrapper
    //需要在wrapper当中把ref向下传递给真实的组件
    //在wrapper当中增加一个props属性，把ref对象作为props传递给子组件
    return <ContentWarp {...props} forwardedRef={ref}/>;


})
//父组件创建ref对象，传递给高阶组件的实例对象。
function App() {
    const myRef = useRef(null);
    const onGetInfo=() => {
        console.log(myRef)
        myRef.current.focus()
    };
    return <div className ="App">
        <Wrapper ref={myRef}/>
        <button onClick={onGetInfo}>获取焦点</button>

    </div>
    
}
```