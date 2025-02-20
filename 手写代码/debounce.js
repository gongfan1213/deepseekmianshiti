function debounce(func, wait, immediate = false) {
    let timeoutId;
  
    return function (...args) {
      const context = this;
      const later = () => {
        timeoutId = null;
        if (!immediate) func.apply(context, args);
      };
  
      const shouldCallNow = immediate && !timeoutId;
      clearTimeout(timeoutId);
      timeoutId = setTimeout(later, wait);
  
      if (shouldCallNow) func.apply(context, args);
    };
  }
  
  // 使用示例：输入框搜索联想
  const searchInput = document.getElementById('search');
  const fetchSuggestions = debounce(() => {
    console.log('发起搜索请求');
  }, 300);
  
  searchInput.addEventListener('input', fetchSuggestions);
  