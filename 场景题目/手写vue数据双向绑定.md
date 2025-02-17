# 双向数据绑定
- 单项数据绑定，model->view ,js,model,data,view->model
### 三部分
- 1.数据层：model:存储数据和业务逻辑的
- 2.视图层: view展示效果的
- 3.业务逻辑层:viewModel:数据和视觉
- MVVM ，model,viewModal,view
- 数据，视图
- 1.Observer:对所有的数据属性进行监听
- 2.Compiler:更新
```js
new Vue()
1.data Observer响应式处理
2.template 动态绑定的数据:{()}=>data获取，view关联，compiler
3.update watcher
4.data Dep-> watcher->update

```

- 1.new MVVM()
- 2. Observer()：劫持监听所有的属性，通知变化Dep->watcher->视图更新updater
- 3.Compiler:订阅数据的变化watcher

```js
class Vue{ 
    constructor(options) {
        this.$options = options;
        this.$data = options.data;
        observer(this.$data);//对data进行响应式处理的
        proxy(this);//data数据代理到vm
        new Compile(options.el,this);//编译模板，处理指令
    }

}
function observer(obj) {
    if(typeof obj!=='obejct') {
        return ;
    }
    new Observer(obj);
}
class Observer {
    constructor(val) {
        this.val = val;
        this.walk(val);
    }
    walk(obj) {
        Object.keys(obj).forEach(key => {
            defineReactive(obj,key,obj[key]);

        })
    }
}
class Compiler {
    constructor(el,vm) {
        this.$vm = vm;
        this.$el =document.querySelector(el);
        if(this.$el) {
            this.compiler(this.$el);
        }
    }
}
compiler(el){
    const childNodes = el.childNodes;
    Array.from(childNodes).forEach(node => {
        if(this.isElement(node)){
            //compiler编译node节点

        } else if(this.isInterpolation(node))
            {
                //编译插值表达式
                //{{a}}
                //compiler编译插值表达式
            }
            if (node.childNodes && node.childNodes.length > 0) {
                this.compile(node)
            }


}
```
- 1.defineReactive/key/Dep
- 2.key  name1   node   watcher
- 3. name1-getter -watcher ,name1当中的Dep
- 4.name1 setter ,Dep->watcher
## 依赖收集
```js
<p>{{name1}}</p>
<p>{{name1}}</p>
<p>{{name1}}</p>
key =name1 watcher1
key= name2 watcher2
key =name3 watcher3
Dep1 deps= [watcher1,watcher3]
Dep2 deps =[watcher2]
```
- 1.defineReactive-为key创建Dep的实例
- 2.key = name1 watcher1
- 3.getter name1 watcher1添加到name1的Deps当中
- 4.setter Deps通知watcher更新
```js
class Watcher { 
    constructor(vm,key,updater) {
        this.vm = vm;
        this.key = key;
        this.updater = updater;
        //创建实例的时候把当前的实例指定到Dep.target
        Dep.target = this;
        vm[key]
        Dep.target = null;
    }
    // 如果更新dom
    update() {
        this.updateFn.call(this.vm,this.vm[this.key])
    }
}
//声明Dep 
class Dep {
    constructor() {
        this.deps = [];
    }
    addDep(watcher) {
        this.deps.push(watcher);
    }
    notify() {
        this.deps.forEach(watcher => watcher.update())
    }
}
function defineReactive(obj,key,val) {
    const dep = new Dep();
    Object.defineProperty(obj,key,{
        enumerable:true,
        configurable:true,
        get() {
            //依赖收集
            Dep.target && dep.addDep(Dep.target);
            // Dep.target就是watcher的实例
            return val;
        },
        set(newVal) {
            if(val === newVal) {
                return ;
            }
            val = newVal;
            //通知更新
            dep.notify();

}


```