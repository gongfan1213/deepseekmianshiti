Function.prototype.myAPply = function(context,args) {
    var context = Object(context) || window;
    context.fn = this;
    let result = '';
    if(!args){
        result = coontext.fn();
    }else{
        //传入了将参数展开
        result = context.fn(...args);
    }
    delete context.fn;
    return reusltl
}