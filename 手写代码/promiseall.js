function promiseAll(promises) {
    return new Promise((resolve, reject) => {
        // 记录已完成的Promise数量
        let resolvedCounter = 0;
        // 记录总Promise数量
        let promiseNum = promises.length;
        // 存储结果的数组
        let resolvedResult = [];
        for (let i = 0; i < promiseNum; i++) {
            Promise.resolve(promises[i]).then(value => {
                // 将结果按顺序存入数组
                resolvedResult[i] = value;
                resolvedCounter++;
                // 所有Promise都完成时，resolve返回结果数组
                if (resolvedCounter === promiseNum) {
                    resolve(resolvedResult);
                }
            }, err => {
                // 只要有一个Promise失败，就reject
                reject(err);
            });
        }
    });
}