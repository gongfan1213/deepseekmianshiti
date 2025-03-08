// //new 操作符在javascript当中创建一个用户定义的对象类型的实例或者已经有的内置对象类型的实例
// //1.创建一个空对象，新实例的基础
// //2.设置原型链，新创建的对象会被链接到构造函数的prototype属性所指向的对象，新对象将会继承构造函数原型上的所有的属性和方法
// function Person(name){
//     this.name = name;
// }
// const person1 = new Person('Akuce');
// console.log(person1._proto_==Person.prototype);
// //构造函数被调用，并且this被绑定到新创建的对象上，构造函数可以为新对象添加属性和方法
// function Person(name){
//     this.name = name;
//     this.getName = function(){
//         return this.name;
//     }
// }
// //4.返回新的对象，如果构造函数没有显示返回对象，则new操作符会自动返回新创建的对象，
function Person(name,age) {
    this.name= name;
    this.age = age;
}
Person.prototype.getName = function(){
    return this.name;
}
function objectFactory(){
    const obj ={};//空对象创建
    const Constructor = [].shift.call(arguments);//获取构造函数
    obj._proto_ = Constructor.prototype;//设置原型链
    const result = Constructor.apply(obj,arguments);//绑定this并执行构造函数
    return typeof result === 'object'?result:obj;
}
//new做了什么，在构造器当中创建了一个新的对象
//在这个对象的内部的隐式原型指向该构造函数的显示原型
//让构造器当中的this指向这个对象
//执行构造器当中的代码
//如果构造器当中没有返回对象，则返回上面创建出来的对象
function objectFactory() {
    const obj ={};
    const Constructor = [].shift.call(arguments);
    obj._proto_ = Constructor.prototype;
    const result = Constructor.apply(obj,arguments);
    return typeof result === 'object'?result:obj;
}