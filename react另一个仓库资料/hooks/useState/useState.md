# useState
- 让函数组件可以维护自己的状态
- 改变状态的开关，能够完全对状态的初始化，读取和更新的
- 返沪一个函数，一个是状态值，一个是更新状态的函数
- 第一项状态值的参数页支持函数的形式，
- 以函数的形式赋值的时候，引擎每次都会解析初始值，写成箭头函数的形式，该函数不会立即执行的，里面的内容不会每次都加载的，
只有在第一次初始化的时候解析返回值，减少计算过程
```js
import React,{useState} from 'react'
function App() {
  const [count,setCount] = useState(()=>{
    console.log('初始化')
    return 0
  })
  const onSetCount = () => {
    setCount(count+1)

  }
  return (
    <div>
      <h1>count:{count}</h1>
      <button onClick={onSetCount}>加一</button>
    </div>
  )
}

```
# useState 异步
- 修改状态时通过useState返回的函数实现的，类似于setState。都是异步的，this.setState时有回调函数的，你需要获取更新后的最新值，可以在回调函数当中获取，
- useState 没有回调函数的，你获取到的是修改前的值。无法获取最新的值，use Effect、监听状态更新，触发状态更新后的回调函数
### 和class组件当中的setState方法不同，useState不会自动合并更新对象，展开运算符或者Object.assign来达到合并更新对象的效果
### useState更新值以后经常会出现更新不及时的bug
- useState源码当中遇到两次相同的状态，会阻止组件再次更新
- 但是类组件当中的setState遇到两次相同的状态也会更新的
- useSttae写在函数的起始位置，
- 严谨出现在代码块当中，判断和循环等等
- 返回的函数第二项，引用时不会变化的
- 使用函数改变数据的时候，如果数据和之前的数据完全相等的，Object.is则不会重新渲染，状态时对象的时候小心操作
- 使用函数改变数据的时候，传入的值不会和原来的数据合并而是直接将其替换，和setState完全不一样
- 要实现强制刷新组件的情况，如果时类组件,forceUpdate如果时函数组件的时候，可以使用useState只需要重新给当前的state赋值一次就可以了
- 因为每次传入的对象的地址不一样，所以一定会使得组件刷新的
- 类组件一样的，函数组件的状态更改在某些时候，比如dom事件下，时异步的，如果是异步更改，则多个状态的更改会合并的，不能信任之前的状态，而是使用回调函数更改状态，
