// 题目
// 一个字符串内部可能包含 { } ( ) [ ] 三种括号，判断该字符串是否是括号匹配的。
// 如 (a{b}c) 就是匹配的， {a(b 和 {a(b}c) 就是不匹配的。
// 栈 Stack
// 栈，先进后出，基本的 API
// - push
// - pop
// - length
// 和栈相关的数据结构（后面讲）
// - 队列，先进先出
// - 堆，如常说的“堆栈模型”
// 逻辑结构和物理结构
// 栈和数组有什么区别？—— 没有可比性，两者不一个级别。就像：房子和石头有什么区别？
// 栈是一种逻辑结构，一种理论模型，它可以脱离编程语言单独讲。
// 数组是一种物理结构，代码的实现，不同的语言，数组语法是不一样的。
// 栈可以用数组来表达，也可以用链表来表达，也可以自定义 class MyStack {...} 自己实现…
// 在 JS 中，栈一般情况下用数组实现。
// 思路
// - 遇到左括号 { ( [ 则压栈
// - 遇到右括号 } ) ] 则判断栈顶，相同的则出栈
// - 最后判断栈 length 是否为 0
// functipn isMatch(left:string,right:string):boolean {
//     if(left === '{' && right === '}') return true;
//     if(left === '[' && right === ']') return true;
//     if(left === '(' && right === ')') return true;
//     return false;

// }
export function matchBracket(str: string): boolean {
    const length = str.length
    if (length === 0) return true

    const stack = []

    const leftSymbols = '{[('
    const rightSymbols = '}])'

    for (let i = 0; i < length; i++) {
        const s = str[i]

        if (leftSymbols.includes(s)) {
            // 左括号，压栈
            stack.push(s)
        } else if (rightSymbols.includes(s)) {
            // 右括号，判断栈顶（是否出栈）
            const top = stack[stack.length - 1]
            if (isMatch(top, s)) {
                stack.pop()
            } else {
                return false
            }
        }
    }

    return stack.length === 0
}

// // 功能测试
// const str = '{a(b[c]d)e}f'
// console.info(123123, matchBracket(str))
// 给定一个只包括 ‘(’，’)’，’{’，’}’，’[’，’]’ 的字符串 string，判断字符串是否有效。
// 有效字符串需满足:
// 1. 左括号必须用相同类型的右括号闭合。
// 2. 左括号必须以正确的顺序闭合。
// 输出示例:
// 示例 1:
// 输入:s = “()”
// 输出：true
// 示例 2:
// 输入：s = “()[]{}”
// 输出：true
// 示例 3:
// 输入：s = “(]”
// 输出：false
// 示例 4:
// 输入:s = “([)]”
// 输出:false
// 示例 5:
// 输入:s = “{[]}”
// 输出:true
// 解题思路:
// 根据题意，我们可以推断出以下要点:
// 3. 有效括号字符串的长度，一定是偶数！
// 4. 右括号前面，必须是相对应的左括号，才能抵消！
// 5. 右括号前面，不是对应的左括号，那么该字符串，一定不是有效的括号！
// 解题:
 var isValid =function(string) {
    let stack = [];
    let length = string.length;
    if(length % 2 === 1)return false;
    // 使用map查询速度还有内存消耗比数组低的
    let map = new Map([
        [')','('],
        [']','['],
        ['}','{']
    ])
    let len = string.length;
    for( let i=0;i<len;i++) {
        if(map.has(string[i])){
            stack.push(string[i]);
        }else {
            if(stack.length===0)}
            return false;

        }else {
            if(map.get(stack.pop())!===string[i]){
                return false;
                //弹出栈顶元素，
            }
        }
    }

 }
 // 栈为空的时候返回true,否则返回false
 return !stack.length;
);