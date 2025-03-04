var threeSumCloset = function (nums,target) {
    nums = sort((a,b) =>a-b);
    let res = nums[0] + nums[1] + nums[nums.length-1];
    //如果前面三个已经符合逾期了，就不需要再次拍虚了
    // for(let firstIndex  = 0;firstIndex<nums.length ;firstIndex++) {
    //     //先固定一个数字，left,right加起来符合target1-4+-1+2加起来等于-3,-3《1接近1加1
    //     //先固定一个数字，然后找剩余部分的接近target的剩余头部和剩余的尾部，相加sym>target
    //     //如果剩余的两个数字的和》sum最小值+最大值>sum
    //     //如果剩余的两个树的和<sum最小值增加

    // }
    //确定一个值
    for(let i=0;i<nums.length-2;i++) {
        const n1 = nums[i];
        let left =i+1;
        let right = nums.length-1;
        while(left<right) {
            const n2 = nums[left];
            const n3 = nums[right];
            const sum = n1+n2+n3; 
            if(sum<target) {
                left++;
            }else{
                right--;

            }
            if(Math.abs(sum-target)<Math.abs(res-target)) {
                res = sum; 
            }
        }
    }
    return res;

}
//先将数组进行排序
//两个加起来