// 2.上来就先一道算法，对象转换。
// ```js
// var entry = {
//     'a.b.c.dd': 'abcdd',
//     'a.d.xx': 'adxx',
//     'a.e': 'ae',
// };

// // 要求转换成如下对象
// var output = {
//     a: {
//         b: {
//             c: {
//                 dd: 'abcdd',
//             },
//         },
//         d: {
//             xx: 'adxx',
//         },
//         e: 'ae',
//     },
// };
// ```
var entry = {
    'a.b.c.dd': 'abcdd',
    'a.d.xx': 'adxx',
    'a.e': 'ae',
};

function transformObject(entry) {
    const output = {};
    // 遍历 entry 对象的每个键值对
    for (const [key, value] of Object.entries(entry)) {
        // 将键按点号分割成数组
        const keys = key.split('.');
        let current = output;
        // 遍历分割后的键数组
        for (let i = 0; i < keys.length; i++) {
            const k = keys[i];
            // 如果是最后一个键，直接赋值
            if (i === keys.length - 1) {
                current[k] = value;
            } else {
                // 如果当前层级的对象不存在，则创建一个新对象
                if (!current[k]) {
                    current[k] = {};
                }
                // 移动到下一层级
                current = current[k];
            }
        }
    }
    return output;
}

var output = transformObject(entry);
console.log(output);