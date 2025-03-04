function isPalindrome(s: string): boolean {
    // 1. ==&zwnj;**预处理字符串**&zwnj;==：
    //    - 将字符串全部转为小写（统一字符大小写，避免大小写影响判断）
    //    - 使用正则表达式 `/[^a-z0-9]/g` 移除非字母数字字符：
    //      - `[^a-z0-9]`：匹配所有非小写字母（a-z）和非数字（0-9）的字符
    //      - `g` 表示全局匹配（替换所有符合条件的字符）
    //    - 例如，"A man, a plan" 会被处理为 "amanaplan"
    const processed = s.toLowerCase().replace(/[^a-z0-9]/g, '');

    // 2. ==&zwnj;**双指针判断回文**&zwnj;==：
    //    - 初始化两个指针，左指针从头部开始（0），右指针从尾部开始（长度-1）
    let left = 0, right = processed.length - 1;

    // 3. ==&zwnj;**循环比较字符**&zwnj;==：
    //    - 当左指针小于右指针时，继续比较（如果指针相遇或交叉，说明已经检查完所有字符）
    while (left < right) {
        // 如果左右指针指向的字符不相等，直接返回 false（非回文）
        if (processed[left] !== processed[right]) return false;

        // 移动指针：左指针右移，右指针左移，继续比较下一对字符
        left++;
        right--;
    }

    // 4. ==&zwnj;**循环结束后的处理**&zwnj;==：
    //    - 如果所有字符都匹配，则返回 true（是回文）
    //    - 空字符串（如输入为 " "）也会返回 true，符合题目要求
    return true;
}
