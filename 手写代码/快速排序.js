// 测试乱序数组
console.log(quickSort([3,1,4,1,5,9,2,6])); // [1,1,2,3,4,5,6,9]

// 测试已排序数组
console.log(quickSort([1,2,3,4,5])); // [1,2,3,4,5]

// 测试重复元素
console.log(quickSort([5,5,5,5])); // [5,5,5,5]
//基准选择中间元素分层左右两个数组，最后合并
//选择基准，分区和递归排序左右，基准选择中间元素，用splice取出，然后遍历数组，小的放在左边，大的放在右边
//递归版本的
function quickSort(arr){
    if(arr.length<=1){
        return arr; 
    }
    const pivotIndex = Math.floor(arr.length/2);
    const pivot = arr.splice(pivotIndex,1);
    const left = [];
    const right = [];
    for (const num of arr) {
        if (num <pivot) 
            left.push(num);
        else
            right.push(num);

    }
    return quickSort(left).concat(pivot,quickSort(right));

}
//基础递归版本的
function quickSort(arr) {
    if (arr.length <= 1) return arr;  // 递归终止条件‌:ml-citation{ref="1,2" data="citationList"}
    const pivot = arr.splice(Math.floor(arr.length / 2), 1); // 选中间元素为基准‌:ml-citation{ref="1,3" data="citationList"}
    const left = [], right = [];
    
    arr.forEach(num => {  // 分区操作
      num < pivot ? left.push(num) : right.push(num); 
    });
    
    return [...quickSort(left), pivot, ...quickSort(right)];  // 递归合并‌:ml-citation{ref="1,2" data="citationList"}
  }
  
  function quickSort(arr, left=0, right=arr.length-1) {
    while (left < right) {
      const pivotIdx = partition(arr, left, right);
      if (pivotIdx - left < right - pivotIdx) {
        quickSort(arr, left, pivotIdx-1);
        left = pivotIdx + 1;
      } else {
        quickSort(arr, pivotIdx+1, right);
        right = pivotIdx - 1;
      }
    }
    return arr;
  }
  