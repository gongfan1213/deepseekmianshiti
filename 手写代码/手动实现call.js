Function.prototype.myCall = function( context ){
    // 1. 判断有没有传入要绑定的对象，没有默认为window；如果是基本类型的话通过Object()方法进行转换
    var context = Object(context) || window;

    // 2. 给context添加一个fn属性，值为this，也就是fn()
    context.fn = this;

    // 3. 保存返回值
    let result = '';

    // 4. 取出传递的参数，第一个参数是this
    // 截取除第一个参数外剩余参数的方法
    const args = [...arguments].slice(1);
    // const args = Array.prototype.slice.call(arguments , 1);
    // const args = Array.from(arguments).slice(1);

    // 5. 执行方法，传入参数
    // ... 是es6的展开数组
    result = context.fn(...args);

    // 6. 删除该属性
    delete context.fn;

    // 7. 返回结果
    return result;
}

// 测试用例
const obj = {
    value :'hello'
}
function fn(name , age){
    return {
        value : this.value ,
        name , 
        age
    }
}
let res = fn.myCall(obj , 'LL' , 25);
console.log(res) // { value: 'hello', name: 'LL', age: 25 }
