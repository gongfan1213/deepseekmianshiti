//双指针，快指针到达末尾的时候，慢指针的下一个节点就是要删除的节点
//创建虚拟的头结点，让快指针先走n+1不，快指针快到末尾的时候，慢指针刚好指向要删除的节点的前驱，然后修改慢支真的next指向next
/**
 * Definition for singly-linked list.
 * class ListNode {
 *     val: number
 *     next: ListNode | null
 *     constructor(val?: number, next?: ListNode | null) {
 *         this.val = (val===undefined ? 0 : val)
 *         this.next = (next===undefined ? null : next)
 *     }
 * }
 */

function removeNthFromEnd(head: ListNode | null, n: number): ListNode | null {
    // 创建一个虚拟头节点，简化删除头节点的逻辑
    const dummy = new ListNode(0, head);
    
    // 初始化快慢指针，均指向虚拟头节点
    let fast: ListNode | null = dummy;
    let slow: ListNode | null = dummy;

    // 快指针先向前移动 n+1 步（让慢指针最终停留在待删除节点的前驱）
    for (let i = 0; i <= n; i++) {
        fast = fast!.next;
    }

    // 同时移动快慢指针，直到快指针到达链表末尾
    while (fast !== null) {
        fast = fast.next;
        slow = slow!.next;
    }

    // 删除慢指针的下一个节点（即倒数第 n 个节点）
    slow!.next = slow!.next!.next;

    // 返回虚拟头节点的下一个节点（即原链表的头节点）
    return dummy.next;
}
//1.创建虚拟的头结点dumy,指向原先链表的头结点，统一处理删除头结点的逻辑，快指针fast先向前移动n+1步，是的快慢指针之间保持n+1的间距
//慢支真slow随后和快指针同步移动，当快指针到达链表的末尾的时候，恰好停留在等待删除的节点的前驱节点
