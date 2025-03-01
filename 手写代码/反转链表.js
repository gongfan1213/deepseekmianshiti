//1.迭代法,prev,current,next逐个反转节点的指向，
//2.递归法，递归到链表的末尾，从后往前反转每个节点的指向，
class ListNode {
    constructor(val,next =null) {
        this.val = val;
        this.next = next;
    }
}
function reverseList(head) {
    let prev = null;
    let curr = head;
    while(curr) {
        const next = curr.next;
        curr.next = prev;
        prev = curr;
        curr = next;
    }
    return prev;
}
//递归法
//1.递归终止条件，当前节点或者下一个节点为空返回
//2.递归到链表末尾，逐层返回的时候反转指针
function reverseListRecursive(head) {
    if(!head || !head.next) return head;
    const newHead = reverseListRecursive(head.next);
    head.next.next = head;
    head.next = null;
}

// 构建链表 1->2->3->4->5
const node5 = new ListNode(5);
const node4 = new ListNode(4, node5);
const node3 = new ListNode(3, node4);
const node2 = new ListNode(2, node3);
const head = new ListNode(1, node2);

// 测试迭代法
console.log(reverseList(head)); // 输出 5->4->3->2->1

// 测试递归法（需重新构建链表）
console.log(reverseListRecursive(head)); // 输出 5->4->3->2->1

// 边界测试：空链表
console.log(reverseList(null)); // null

// 边界测试：单节点链表
console.log(reverseList(new ListNode(1))); // 1
