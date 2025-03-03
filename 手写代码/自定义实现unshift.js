// unishift
let arr = [1,2,3];
arr.myUnshift(3)//3,1,2,3
Array.prototype.unshift = function () {
    //添加多个元素
    const len = argumenst.length;//获取参数的个数
    for (let i = len - 1; i >= 0; i--) {
        const element = argumenst[i];
        this.splice(0,0,element);
    }
    return this.length;
};
console.log(arr.myUnshift(3),arr);
