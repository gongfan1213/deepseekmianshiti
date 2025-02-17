# HOC High Order Component
- HOC高阶组件，使用技巧，纯函数，没有副作用
```js
function (componentA) {
    return componentB
}
```
- 原因
- 1.抽离重复的代码，实现组件的复用
- 2.条件渲染，渲染拦截
- 3.拦截，组件的生命周期
## 属性代理
```js
function HOC (WrappedComponent) {
    const newProps = {type:"HOC"}
    return props => <WrappedComponent {...props} {...newProps}/>

}
function HOC(WrappedComponent) {
    return class extends React.Component{
        render() {
            const newProps ={type:'HOC'}
            return props => <WrappedComponent {...props} {...newProps}/>

        }
    }
}

```
## 2.state 
```js
function HOC(WrappedComponent) {
    return class extends React.Component{
        constructor(props) {
            super(props)
            this.state = {
                name:'HOC'
            };
            this.onChange = this.onChange.bind(this)

        }
        onChange() {
            this.setState({
                name:e.target.value
            })
        }

        render() {
            const newProps ={
                name: {
                    value:this.state.name,
                    onChange:this.onChange

                }}
            return props => <WrappedComponent {...props} {...newProps} />


        }
    }



}


```