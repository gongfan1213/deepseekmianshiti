function throttle(func, wait, options = { leading: true, trailing: true }) {
    let timeoutId;
    let lastArgs;
    let lastCallTime = 0;
  
    return function (...args) {
      const context = this;
      const now = Date.now();
      const remaining = wait - (now - lastCallTime);
  
      const shouldCall = () => {
        if (now - lastCallTime >= wait) return true; // 超时后立即执行
        if (!options.leading && !options.trailing) return false; // 禁用首尾调用
        return false;
      };
  
      if (shouldCall()) {
        if (options.leading) {
          func.apply(context, args);
        }
        lastCallTime = now;
      } else {
        lastArgs = args;
        if (options.trailing && !timeoutId) {
          timeoutId = setTimeout(() => {
            func.apply(context, lastArgs);
            timeoutId = null;
            lastCallTime = options.leading ? Date.now() : 0;
          }, remaining);
        }
      }
    };
  }
  
  // 使用示例：滚动加载更多内容
  window.addEventListener('scroll', throttle(() => {
    console.log('检查滚动位置，加载数据');
  }, 200));
  