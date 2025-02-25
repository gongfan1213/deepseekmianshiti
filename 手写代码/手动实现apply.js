Function.prototype.myApply = function( context , args ){
    var context = Object(context) || window;
    context.fn = this;
    let result = '';

    // 4. 判断有没有传入第二个参数 args，如果传入就将第二个参数展开
    if(!args){
        // 没有传入，直接返回该函数
        result = context.fn();
    }else{
        // 传入了，将参数展开
        result = context.fn(...args);
    }

    delete context.fn;
    return result;
}

// 测试用例
const obj = {
    value :'hello'
}
function fn(name , age){
    return {
        value :this.value ,
        name , 
        age
    }
}
let res = fn.myApply(obj ,[ 'LL' , 25]);
console.log(res) // { value: 'hello', name: 'LL', age: 25 }
           