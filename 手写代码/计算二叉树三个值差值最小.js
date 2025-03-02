class TreeNode {
    constructor(value) {
      this.value = value;
      this.children = [];
    }
  
    addChild(node) {
      this.children.push(node);
    }
  }
  
  const root = new TreeNode(2);
  const node3 = new TreeNode(3);
  const node4 = new TreeNode(4);
  const node1 = new TreeNode(1);
  const node5 = new TreeNode(5);
  const node2 = new TreeNode(2);
  const node6 = new TreeNode(6);
  
  root.addChild(node3);
  root.addChild(node4);
  node3.addChild(node1);
  node3.addChild(node5);
  node4.addChild(node2);
  node4.addChild(node6);
  
  function dfs(root, values) {
    if (!root) return;
    values.push(root.value);
    for (const child of root.children) {
      dfs(child, values);
    }
  }
  
  function getMinDifference(values) {
    const allThreeDigitNumbers = [];
  
    // Generate all possible three-digit numbers
    for (let i = 0; i < values.length; i++) {
      for (let j = 0; j < values.length; j++) {
        if (j === i) continue;
        for (let k = 0; k < values.length; k++) {
          if (k === i || k === j) continue;
          const num = values[i] * 100 + values[j] * 10 + values[k];
          allThreeDigitNumbers.push(num);
        }
      }
    }
  
    // Sort the numbers to find the minimum difference
    allThreeDigitNumbers.sort((a, b) => a - b);
  
    let minDifference = Infinity;
    for (let i = 1; i < allThreeDigitNumbers.length; i++) {
      const difference = allThreeDigitNumbers[i] - allThreeDigitNumbers[i - 1];
      if (difference < minDifference) {
        minDifference = difference;
      }
    }
  
    return minDifference;
  }
  
  // Collect all node values using DFS
  const values = [];
  dfs(root, values);
  
  // Calculate the minimum difference
  const minDifference = getMinDifference(values);
  console.log("The minimum difference is:", minDifference);
  