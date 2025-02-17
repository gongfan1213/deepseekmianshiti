- 返回一个可变的ref对象的，只有一个current属性
- 初始值为传入的参数initialValue,返回的ref对象在整个生命周期当中都保持不变的
- 获取子组件和dom节点的实例对象
- 存储渲染周期之间的共享的数据
```js
function App() {
    const [count,setCount] = useState(0);
    const prevCountRef = useRef();
    const prevCount = prevCountRef.current;
    useEffect(()=>{
        prevCountRef.current = count;
    });
    return (

        <div>
            <h1>count:{count}</h1>
            <h1>prevCount:{prevCount}</h1>
            <button onClick={()=>{setCount(count+1)}}>加一</button>
        </div>
    )
}
ReactDOM.render(<App/>,document.getElementById('root'));

```
- 利用useRef获取不变定时器对象useRef返回的ref对象，该对象是一个current属性可变并且容纳任意值的容器，类似于一个class的实例属性，
- 组件每次渲染 useRef的返回值不变
- ref.current的值发生变化，不会造成重新渲染
- 不可以在render当中更新current的值
- 如果给一个组件设定了ref属性，但是对应的值却不是有useRef创建的，那么实际运行当中会收到react的报错，无法正常渲染的
- ref只能赋值由useRef创建的对象
- ref.current不可以作为其他的hooks的依赖项，因为ref时可变的，不会使得界面重新渲染
