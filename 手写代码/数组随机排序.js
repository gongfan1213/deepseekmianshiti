//数组随机排序
var arr = [1,2,3,4,5,6,7,8,9,10];
function result(arr) {
    for(let i=0;i<arr.length;i++){
        let randomIndex = parseInt(Math.random()*arr.length);
        let curNum =arr[i];
        //存下当前正常下表的值
        arr[i] = arr[randomIndex];
        arr[randomIndex] = curNum;

    }
    return arr;

}
//借助sort
arr.sort(() =>Math.random()-0.5);
