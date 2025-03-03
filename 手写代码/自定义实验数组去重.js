var arr =[
    {},
    {},
    233,
    444,
    555,
    666,
    777,
    888,
    [2],
    [3],
];
Array.prototype.myUnque = function() {
    //方法1
    //return Array.from(new Set(this));
    //方法2
    let arr =[];
    for (let i = 0; i < this.length; i++) {
        if(!arr.includes(this[i])){
            arr.push(this[i]);
        }
    }
    return arr;
    //方法3
    return this.filter((v,idx) => {
        return this.indexOf(v) === idx;
    })
}
console.log(arr.myUnque());
//这个方法是通过数组实例调用的
//在原型方法当中，this自动绑定到调用该方法的实例对象，this就指向了arr这个数组，可以访问他的所有的属性和元素的
