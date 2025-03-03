//两数之和
// nums target
// nums =[2,7,11,15] target = 9
const nums  = [2,7,11,15];
const target = 9;
function twoSum(nums,atrget) {
    for(let i=0;i<nums.length;i++) {
        const num = nums[i];
        const targetIndex = nums.indexOf(target - num);
        if(targetIndex >-1 && targetIndex !==i){
            return [i,targetIndex];
        }
    }
}