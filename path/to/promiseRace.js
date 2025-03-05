function promiseRace(promises) {
    return new Promise((resolve,reject) => {
        if(!Array.isArray(promises)) {
            return reject(new TypeError('arguments must be an array'));
        }
        promises.forEach( promise => {
            Promise.resolve(promise)
            .then(resolve)
            .catch(reject);
        })
    })
}