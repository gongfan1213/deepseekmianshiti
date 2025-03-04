var findAnagrams = function(s,p) {
    //a,map记录其中的值，a,b,c分别存在多少次的
    let sLength = s.length;
    let pLength = p.length;
    if(sLength < pLength) return [];
    //创建两个指针，同侧的指针
    let left = 0,right = 0;
    //当前窗口的两个map
    let windowMap = new Map();
    let pMap = new Map();
    let valid = 0;
    //windowMap的长度和pMap当中相同元素的个数
    let res = [];
    for(cosnt char of p) {
        //cbac pMap  c,0,b0,a0
        pMap.set(char,(pMap.get(char) || 0) + 1);
    }
    while(right<sLength){
        let char  = s[right++];
        //char在不在pMap当中存在的
        if(pMap.has(char)){
            windowMap.set(char,(windowMap.get(char) || 0) + 1);
            if(windowMap.get(char) === pMap.get(char)){
                valid++;
            }
            if(right - left === pLength) {
                if(valid === pMap.size) {
                    res.push(left);
                    
                }
                //移动窗口
                let char = s[left++];
                if(pMap.has(char)) {
                    //如果原本在窗口当总，向右移动就会跳出窗口的
                    windowMap.set(char,windowMap.get(char)-1);
                    if(windowMap.get(char) === pMap.get(char)){
                        valid--;
                    }
                }

            }
        }
    }
    return res;
}