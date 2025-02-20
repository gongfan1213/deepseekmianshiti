// 扁平化多维数组
function flattenArray(arr) {
    let result = [];
    for (let i = 0; i < arr.length; i++) {
        if (Array.isArray(arr[i])) {
            result = result.concat(flattenArray(arr[i]));
        } else {
            result.push(arr[i]);
        }
    }
    return result;
}

// 去重
function uniqueArray(arr) {
    let seen = {};
    let result = [];
    for (let i = 0; i < arr.length; i++) {
        if (!seen[arr[i]]) {
            seen[arr[i]] = true;
            result.push(arr[i]);
        }
    }
    return result;
}

// 快速排序
function quickSort(arr) {
    if (arr.length <= 1) {
        return arr;
    }
    let pivot = arr[Math.floor(arr.length / 2)];
    let left = [];
    let right = [];
    for (let i = 0; i < arr.length; i++) {
        if (i === Math.floor(arr.length / 2)) continue;
        if (arr[i] < pivot) {
            left.push(arr[i]);
        } else {
            right.push(arr[i]);
        }
    }
    return quickSort(left).concat(pivot, quickSort(right));
}

// 综合函数
function processArray(arr) {
    let flattened = flattenArray(arr);
    let unique = uniqueArray(flattened);
    return quickSort(unique);
}

// 示例
let arr = [1, [2, 3, [4, 5, [6, 7, 8, 1, 2, 3]]], 9, [10, 11, [12, 13, 14]]];
console.log(processArray(arr)); // 输出 [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]