function isPalindrome(s: string): boolean {
    // 预处理：转小写并移除非字母数字字符
    const processed = s.toLowerCase().replace(/[^a-z0-9]/g, '');
    // 双指针判断回文
    let left = 0, right = processed.length - 1;
    while (left < right) {
        if (processed[left] !== processed[right]) return false;
        left++;
        right--;
    }
    return true;
};
