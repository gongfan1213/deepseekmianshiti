function sortUniqueIPs(ipArray) {
    // 1. 统计 IP 出现次数 ‌:ml-citation{ref="2,3" data="citationList"}
    const ipCounts = {};
    ipArray.forEach(ip => {
      ipCounts[ip] = (ipCounts[ip] || 0) + 1;
    });
  
    // 2. 获取去重后的 IP 列表 ‌:ml-citation{ref="2,3" data="citationList"}
    const uniqueIps = Object.keys(ipCounts);
  
    // 3. 将 IP 转换为可排序的格式（如 192.168.1.1 → 192168001001）‌:ml-citation{ref="1" data="citationList"}
    const padIP = ip => ip.split('.').map(seg => seg.padStart(3, '0')).join('');
  
    // 4. 排序：按次数降序，次数相同则按 IP 自然顺序升序 ‌:ml-citation{ref="1,2" data="citationList"}
    uniqueIps.sort((a, b) => {
      // 主排序：次数降序
      const countDiff = ipCounts[b] - ipCounts[a];
      if (countDiff !== 0) return countDiff;
      // 次排序：IP 自然顺序升序
      return padIP(a).localeCompare(padIP(b));
    });
  
    return uniqueIps;
  }
  
  // 测试用例
  const ipArray = ["192.168.1.1", "10.0.0.1", "192.168.1.1", "10.0.0.1", "10.0.0.1"];
  console.log(sortUniqueIPs(ipArray)); // 输出: ["10.0.0.1", "192.168.1.1"]
  