// 写一个js函数实现数组扁平化，只减少一层的嵌套

export function flatten1(arr: any[]): any[] {
    const res: any[] = []


    arr.forEach(item => {
        if (Array.isArray(item)) {
            item.forEach(n => res.push(n))
        } else {
            res.push(item)
        }
    })


    return res
}


/**
 * 数组扁平化，使用 concat
 * @param arr arr
 */
export function flatten2(arr: any[]): any[] {
    let res: any[] = []


    arr.forEach(item => {
        res = res.concat(item)
    })


    return res
}


// // 功能测试
const arr = [1, [2, [3], 4], 5]
console.log( flatten2(arr) )
console.log( 1 )
flatten2(arr)
//foreach
export function flatten1(arr:any[]):any[]{
    const res:any[]=[]
    arr.forEach(item=>{
        if(Array.isArray(item)){
            item.forEach(n=>res.push(item))
        }else {
            res.push(item)
        }
    })
    return res
}
const arr=[1,[2,[3],4,5]
console.log(flatten1(arr))
//concat
export function flatten2(arr:any[]):any[]{
    let res:any[]=[]
    arr.forEach(item=>{
        res=res.concat(item)
    })
    return res
}
//push 修改数组，concat不修改数组
//连环问：Aray Flatten彻底拍平
//写一个js函数，实现数组的扁平化，减少所有的嵌套层级
//先实现一级扁平化，然后递归调用，直到全部扁平
export function flattenDeep1(arr:any[]):any[]{
    const res:any[]=[]
    arr.forEach(item=>{
        if(Array.isArray(item)){
            const flatItem=flattenDeep1(item)
            flatItem.forEach(n=>res.push(n))
        }else{
            res.push(item)
        }
    })
    return res
}
//使用concat
export function flattenDeep2(arr:any[]):any[]{
    let res:any[]=[]
    arr.forEach(item=>{
        if(Array.isArray(item)){
            const flatItem=flattenDeep2(item)//递归
            res=res.concat(flatItem)
        }else{
            res=res.concat(item)
        }
    })
}
//功能测试
const arr=[1,[2,[3,4],5],6]
console.log(flattenDeep1(arr))
const nums=[1,2,[3,4,[100,200],5],6]
nums.toString()//1,2,3,4,100,200,5,6
//如果数组元素是对象{x:100}等引用类型的就不可以了


/**
 * 数组深度扁平化，使用 push
 * @param arr arr
 */
export function flattenDeep1(arr: any[]): any[] {
    const res: any[] = []


    arr.forEach(item => {
        if (Array.isArray(item)) {
            const flatItem = flattenDeep1(item) // 递归
            flatItem.forEach(n => res.push(n))
        } else {
            res.push(item)
        }
    })


    return res
}


/**
 * 数组深度扁平化，使用 concat
 * @param arr arr
 */
export function flattenDeep2(arr: any[]): any[] {
    let res: any[] = []


    arr.forEach(item => {
        if (Array.isArray(item)) {
            const flatItem = flattenDeep2(item) // 递归
            res = res.concat(flatItem)
        } else {
            res = res.concat(item)
        }
    })


    return res
}



// // 功能测试
// const arr = [1, [2, [3, ['a', [true], 'b'], 4], 5], 6]
// console.info( flattenDeep2(arr) )
const nums=[1,2,[3,4,[100,200],5],6]
nums.toString()//1,2,3,4,100,200,5,6
//如果数组元素是对象{x:100}等引用类型的就不可以了

/**
 * 数组深度扁平化，使用 push
 * @param arr arr
 */
export function flattenDeep1(arr: any[]): any[] {
    const res: any[] = []


    arr.forEach(item => {
        if (Array.isArray(item)) {
            const flatItem = flattenDeep1(item) // 递归
            flatItem.forEach(n => res.push(n))
        } else {
            res.push(item)
        }
    })


    return res
}


/**
 * 数组深度扁平化，使用 concat
 * @param arr arr
 */
export function flattenDeep2(arr: any[]): any[] {
    let res: any[] = []


    arr.forEach(item => {
        if (Array.isArray(item)) {
            const flatItem = flattenDeep2(item) // 递归
            res = res.concat(flatItem)
        } else {
            res = res.concat(item)
        }
    })


    return res
}



// // 功能测试
// const arr = [1, [2, [3, ['a', [true], 'b'], 4], 5], 6]
// console.info( flattenDeep2(arr) )
// es6 flat方法
//指定的深度递归遍历数组，并且将所有的元素和遍历的子数组当中的元素合并到一个新的数组当中
const arr = [1,[2,[3,[4,5]]],6]
//  方法一：数组自带的扁平化方法,flat的参数代表的是需要展开几层，如果是Infinity的话，就是不管嵌套几层，全部都展开
console.log(arr.flat(Infinity))
// 2.使用正则
//json。stringfy把arr转化成为字符串
//使用正则把字符串里面的【】去掉
//然后再拼接数组括号转换成为数组对象
const arr = [1,[2,[3,[4,5]]],6]
const res = JSON.stringify(arr).replace(/\[|\]/g,'')
const res2 = JSON.parse('[' + res + ']')
console.log(res2)
const res =JSON.stringify(arr).replace(/\[||]/g,'')
//3.使用递归
const array = []
const  fn = (arr)=>{
    for(let i = 0;i<arr.length; i++){
        if(Array.isArray(arr[i])){
            fn(arr[i])
        }
        else {
            array.push(arr[i])
        }
    }
}
fn(arr)
console.log(array)
// 使用reduce
//reduce可以给数组求和的
//conca链接两个或者多个数组的
//concat不会更改现有的数组，而是返回一个新的数组，其中包含已经链接的数组的值
const newArr = (arr)=>{
    return arr.reduce((pre,cur)=>{
        return pre.concat(Array.isArray(cur) ? newArr(cur) : cur)
    },[])
}
console.log(newArr(arr),"reduce方法")
//方法五：使用栈的思想实现 flat 函数
//栈（stack）又名堆栈，它是一种运算受限的线性表。限定仅在表尾进行插入和删除操作的线性表
// 栈思想function flat(arr) {
    const newArr = [];
    const stack = [].concat(arr);  // 将数组元素拷贝至栈，直接赋值会改变原数组//如果栈不为空，则循环遍历while (stack.length !== 0) {
      const val = stack.pop(); // 删除数组最后一个元素，并获取它if (Array.isArray(val)) {
        stack.push(...val); // 如果是数组再次入栈，并且展开了一层
      } else {
        newArr.unshift(val); // 如果不是数组就将其取出来放入结果数组中
      }
    }
    return newArr;
  }
  let arr = [12, 23, [34, 56, [78, 90, 100, [110, 120, 130, 140]]]];
  console.log(flat(arr));
  // [12, 23, 34, 56, 78, 90, 100, 110, 120, 130, 140]