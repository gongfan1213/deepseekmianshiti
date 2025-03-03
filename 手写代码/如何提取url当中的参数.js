let url = 'htts://alibaba.com/a-18b-2c'
//提取url的参数
function queryURLParam(url) {
   let url = URL.split('?')[1];
   const urlSearchParams = new URLSearchParams(url);
   const params =Object.fromEntries(urlSearchParams.entries());
    return params;
//Object.fromEntries将键值对数组转换成为普通的对象的
}
console.log(queryURLParams(url));
//const urlSearchParams = new URLSearchParams(url);
//const params =Object.fromEntries(urlSeachParams.entires());
