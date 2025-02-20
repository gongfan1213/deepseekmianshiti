function deepClone(obj, map = new WeakMap()) {
    if (obj === null || typeof obj !== 'object') return obj
    
    // 处理循环引用
    if (map.has(obj)) return map.get(obj)
    
    let clone = Array.isArray(obj) ? [] : {}
    map.set(obj, clone)
    
    // 处理Symbol属性
    const symKeys = Object.getOwnPropertySymbols(obj)
    symKeys.forEach(symKey => {
        clone[symKey] = deepClone(obj[symKey], map)
    })
    
    // 处理普通属性
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            clone[key] = deepClone(obj[key], map)
        }
    }
    return clone
}
