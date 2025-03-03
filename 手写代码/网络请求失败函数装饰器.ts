type RetryOptions = {
    maxRetries?: number;     // 最大重试次数，默认3次
    delay?: number;         // 重试间隔(ms)，默认1000ms
    shouldRetry?: (error: any) => boolean; // 自定义重试条件判断
  };
  
  /**
   * 网络请求重试装饰器
   * @param options 重试配置选项
   */
  function retry(options: RetryOptions = {}) {
    // 合并默认配置
    const { maxRetries = 3, delay = 1000, shouldRetry = isRetriableError } = options;
  
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
      const originalMethod = descriptor.value;
  
      // 包装原始方法，加入重试逻辑
      descriptor.value = async function (...args: any[]) {
        let retries = 0;
        
        while (retries <= maxRetries) {
          try {
            return await originalMethod.apply(this, args); // 保留原方法的this上下文
          } catch (error) {
            if (retries === maxRetries || !shouldRetry(error)) {
              throw error; // 达到最大次数或不满足重试条件时抛出错误
            }
            
            retries++;
            console.warn(`Request failed, retrying (${retries}/${maxRetries})...`);
            
            // 等待指定延迟时间
            await new Promise(resolve => setTimeout(resolve, delay));
          }
        }
        
        throw new Error('Exceeded maximum retry attempts');
      };
  
      return descriptor;
    };
  }
  
  // 默认错误重试条件：网络错误或5xx服务器错误
  function isRetriableError(error: any): boolean {
    return (
      error instanceof TypeError ||  // 网络错误（如跨域、连接失败）
      (error.response?.status >= 500 && error.response?.status < 600) // 5xx错误
    );
  }
  
  /==&zwnj;****====****&zwnj;====&zwnj;****====****&zwnj;====&zwnj;** 使用示例 **&zwnj;====&zwnj;****====****&zwnj;====&zwnj;****====****&zwnj;==/
  class ApiService {
    private attemptCount = 0;
  
    @retry({ maxRetries: 2, delay: 500 })
    async fetchData(url: string) {
      this.attemptCount++;
      
      // 模拟60%概率失败
      if (this.attemptCount <= 2) {
        throw { response: { status: 503 } }; // 模拟服务器错误
      }
      
      return { data: 'success' };
    }
  }
  
  // 测试调用
  async function test() {
    const api = new ApiService();
    
    try {
      const result = await api.fetchData('/api/data');
      console.log('Result:', result);
    } catch (error) {
      console.error('Final error:', error);
    }
  }
  
  test(); 
  // 输出：
  // Request failed, retrying (1/2)...
  // Request failed, retrying (2/2)...
  // Result: { data: 'success' }
  