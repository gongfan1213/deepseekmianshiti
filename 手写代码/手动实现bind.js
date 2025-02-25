Function.prototype.myBind = function( context ){
    // 1. 判断this是不是一个函数
    if(typeof this !== 'function'){
        // 不是函数，抛出错误
        throw new Error('不是一个函数');
    }
    // 2. 暂存this
    const self = this;

    // 3. 获取传入的参数
    // 拿到第一组参数，如果没传，是一个空数组
    const args1 = [...arguments].slice(1);

    // 第二次调用bindFn
    const bindFn = function(){
        // 获取第二个参数
        const args2 = [...arguments];
        // 将第一部分参数和第二部分参数合并到一起，进行返回
        return self.apply(context , args1.concat(args2));
    }
    return bindFn
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
let res = fn.myBind(obj)('HH' , 30);
console.log(res)
