```javascript
class EventEmitter {
  constructor() {
    this.events = {};
  }

  /**
   * 订阅事件
   * @param {string} eventName 事件名称
   * @param {function} listener 事件监听器
   * @param {boolean} [once=false] 是否只监听一次
   * @returns {this} 返回 EventEmitter 实例，方便链式调用
   */
  on(eventName, listener, once = false) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }

    this.events[eventName].push({ listener, once });
    return this;
  }

  /**
   * 订阅一次性事件
   * @param {string} eventName 事件名称
   * @param {function} listener 事件监听器
   * @returns {this} 返回 EventEmitter 实例，方便链式调用
   */
  once(eventName, listener) {
    return this.on(eventName, listener, true);
  }

  /**
   * 发布事件
   * @param {string} eventName 事件名称
   * @param  {...any} args 传递给监听器的参数
   * @returns {boolean} 是否成功触发事件
   */
  emit(eventName, ...args) {
    if (!this.events[eventName]) {
      return false;
    }

    //  为了避免在循环中修改数组长度导致的问题，使用倒序循环和 splice
    for (let i = this.events[eventName].length - 1; i >= 0; i--) {
      const { listener, once } = this.events[eventName][i];
      listener.apply(this, args); // 使用 apply 保证 this 指向正确

      if (once) {
        this.events[eventName].splice(i, 1);
      }
    }

    return true;
  }

  /**
   * 取消订阅事件
   * @param {string} eventName 事件名称
   * @param {function} listener 要移除的监听器
   * @returns {this} 返回 EventEmitter 实例，方便链式调用
   */
  off(eventName, listener) {
    if (!this.events[eventName]) {
      return this;
    }

    this.events[eventName] = this.events[eventName].filter(
      (item) => item.listener !== listener
    );
    return this;
  }
}



// 测试用例
const eventEmitter = new EventEmitter();

const listener1 = (data) => {
  console.log("listener1:", data);
};

const listener2 = (data) => {
  console.log("listener2:", data);
};

const onceListener = (data) => {
  console.log("onceListener:", data);
};

eventEmitter.on("test", listener1);
eventEmitter.on("test", listener2);
eventEmitter.once("test", onceListener);

eventEmitter.emit("test", "first emit"); // listener1, listener2, onceListener 都会触发
eventEmitter.emit("test", "second emit"); // listener1, listener2 会触发，onceListener 不会触发

eventEmitter.off("test", listener2); // 移除 listener2
eventEmitter.emit("test", "third emit"); // listener1 会触发，listener2 和 onceListener 不会触发


//测试没有监听器的事件
eventEmitter.emit('noListeners', 'should not show'); // 不会输出任何内容，返回 false

//测试移除不存在的监听器
eventEmitter.off('test', () => console.log('nonexistent listener')); // 不会报错

```


**代码解释和改进说明：**

1. **`once`  功能的实现：**  在 `on` 方法中添加了 `once` 参数，并在 `emit` 方法中根据 `once` 的值来决定是否移除监听器。
2. **倒序循环移除监听器：**  在 `emit` 方法中使用倒序循环和 `splice` 方法移除 `once` 为 `true` 的监听器。这样可以避免在正序循环中移除元素导致索引变化的问题。
3. **`apply` 方法的使用：** 在 `emit` 方法中使用 `apply` 方法调用监听器函数，确保 `this` 指向正确。
4. **链式调用：**  `on`、`once` 和 `off` 方法都返回 `this`，方便链式调用。
5. **错误处理：**  在 `emit` 和 `off` 方法中添加了简单的错误处理，例如，当事件没有监听器时，`emit` 方法返回 `false`；当尝试移除不存在的监听器时，`off` 方法不会报错。
6. **清晰的注释：**  添加了详细的注释，解释每个方法的作用和参数。
7. **测试用例：** 提供了全面的测试用例，涵盖了各种情况，包括多次触发事件、移除监听器、一次性监听器等。


这个改进后的版本更加健壮、易用，并且符合发布订阅模式的最佳实践。它清晰地展示了如何实现带有 `once` 功能的发布订阅模式。


