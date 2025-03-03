//给你abc三个请求，希望c在ab获取以后再请求
//1.promiseall
const fs = require('fs')
let arr = [];
function fn(data) {
    arr.push(data);
    if(arr.length===2){
        console.log(arr);
    }
}
fs.readFile("./a.text","utf-8",(err,data) =>{
    fn(data)
})
fs.readFile("./b.text","utf-8",(err,data) =>{
    fn(data)
})