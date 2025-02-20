function findMaxNumber(str) {
    // 使用正则表达式匹配所有数字
    const numbers = str.match(/\d+/g);
    
    // 如果没有找到数字，返回null
    if (!numbers) return null;
    
    // 将字符串数字转换为数字类型，并找出最大值
    return Math.max(...numbers.map(Number));
}

// 示例用法
const str = "abc123def456ghi789";
console.log(findMaxNumber(str)); // 输出: 789
//给一串字符串（有字母有数字）要求输出里面最大的数字

function deepClone (obj,map = new WeakMap ()) {
    if (obj === null || typeof obj !=='object') return obj;
    if(map.has(obj))return map.get()
}
function deepClonse