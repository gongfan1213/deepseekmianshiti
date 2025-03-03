Math.round(num)//四舍五入
Math.floor(num)//向下取整
Math.ceil(num)//向上取整
// //获取指定范围内的随机数
// function fn(min,max){
//     //(min,max)
//     return Math.round(Math.random()*(max-min-2)+min+1)//不包含两端的值
//     //[min,max]
//     //return Math.round(Math.random()*(max-min)+min)//包含两端的值
//     return Math.ceil(Math.random()*(max-min))
// }
//打印100以内的质数
//质数是只能被1和自身整除的数字
var count =0;
for (let i=2;i<=100;i++) {
    for(let j=1;j< i;j++) {
        if(i%j === 0) {
            count++;
        }
    }
    if(count ===2){
        console.log(i)
    }
    count = 0;
}