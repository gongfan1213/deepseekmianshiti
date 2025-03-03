//flatten
let arr = [1,2,[3,4,5,[6,7],8],9,10,[11,[12,13]]];
const flatten =function(arr){
    while(arr.some(v=>Array.isArray(v))){
        arr = [].concat(...arr);
    }
    return arr;
};
console.log(flatten(arr));
const flatten = function(arr) {
    return [].concat(...arr.map(v=>Array.isArray(v)?flatten(v):v));
}
return [].concat(arr.map(v=>Array.isArray(v)?flatten(v):v));