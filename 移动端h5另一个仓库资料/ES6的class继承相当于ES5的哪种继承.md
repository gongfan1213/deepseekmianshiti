面试官您好！ES6 的 `class` 继承在功能上最接近于 ES5 的**组合继承**，但 `class` 语法提供了更简洁、更清晰、更面向对象的继承方式，并解决了一些组合继承的缺点。

下面我将详细对比 ES6 `class` 继承和 ES5 组合继承：

**1. ES5 组合继承**

组合继承结合了原型链继承和借用构造函数继承的优点：

*   **原型链继承：** 子类的原型指向父类的实例，实现原型方法的继承。
*   **借用构造函数继承：** 在子类的构造函数中调用父类的构造函数，实现实例属性的继承。

```javascript
// 父类
function Animal(name) {
  this.name = name;
  this.colors = ['white', 'black']; // 实例属性
}

// 父类的原型方法
Animal.prototype.getName = function() {
  return this.name;
};

// 子类
function Dog(name, age) {
  // 借用构造函数继承：继承实例属性
  Animal.call(this, name);
  this.age = age;
}

// 原型链继承：继承原型方法
Dog.prototype = new Animal(); // 这里有坑，下面会讲
Dog.prototype.constructor = Dog; // 修复 constructor 指向

Dog.prototype.getAge = function() {
  return this.age;
};

// 使用
const dog1 = new Dog('Buddy', 3);
const dog2 = new Dog('Lucy', 1);

dog1.colors.push('brown');

console.log(dog1.colors); // ["white", "black", "brown"]
console.log(dog2.colors); // ["white", "black"]  (dog2 不受影响，因为 colors 是实例属性)
console.log(dog1.getName()); // "Buddy"
console.log(dog1.getAge()); // 3
```

**组合继承的缺点：**

*   **父类构造函数被调用两次：** 一次是在创建子类原型时 (`Dog.prototype = new Animal();`)，另一次是在子类构造函数中 (`Animal.call(this, name);`)。这会导致子类实例的原型上存在一份多余的父类实例属性。
*   **代码冗余：** 需要手动设置子类原型和 `constructor` 属性。
*   **不够优雅：** 语法不够简洁，不够面向对象。

**2. ES6 `class` 继承**

ES6 的 `class` 语法提供了更简洁、更清晰的继承方式：

```javascript
// 父类
class Animal {
  constructor(name) {
    this.name = name;
    this.colors = ['white', 'black']; // 实例属性
  }

  getName() {
    return this.name;
  }
}

// 子类
class Dog extends Animal {
  constructor(name, age) {
    super(name); // 调用父类构造函数
    this.age = age;
  }

  getAge() {
    return this.age;
  }
}

// 使用
const dog1 = new Dog('Buddy', 3);
const dog2 = new Dog('Lucy', 1);

dog1.colors.push('brown');

console.log(dog1.colors); // ["white", "black", "brown"]
console.log(dog2.colors); // ["white", "black"] (dog2 不受影响)
console.log(dog1.getName()); // "Buddy"
console.log(dog1.getAge()); // 3
```

**`class` 继承的优点：**

*   **简洁：** 使用 `extends` 关键字实现继承，语法更简洁。
*   **清晰：** 使用 `class` 和 `constructor` 定义类和构造函数，更符合面向对象的编程风格。
*   **`super` 关键字：** 使用 `super` 关键字调用父类构造函数和方法，更方便。
*   **避免了组合继承的缺点：** 父类构造函数只会被调用一次，不会产生多余的实例属性。
*   **自动设置原型和 `constructor`：** 不需要手动设置子类原型和 `constructor` 属性。
*    **支持静态方法**

**3. 原理对比**

虽然 `class` 语法更简洁，但其底层实现仍然是基于原型链的。

*   **`class` 声明的本质：** `class` 实际上是一个语法糖，它仍然是基于函数的。
*   **`extends` 关键字的作用：**
    *   设置子类的原型：`SubClass.prototype.__proto__ === SuperClass.prototype`。
    *   设置子类构造函数的原型: `SubClass.__proto__ === Superclass` 这使得子类可以继承父类的静态方法。
*   **`super` 关键字的作用：**
    *   在子类构造函数中，`super(args)` 相当于 `SuperClass.call(this, args)`，调用父类构造函数。
    *   在子类方法中，`super.method()` 相当于 `SuperClass.prototype.method.call(this, args)`，调用父类原型上的方法。

**4. 总结**

ES6 的 `class` 继承在功能上最接近于 ES5 的组合继承，但 `class` 语法提供了更简洁、更清晰、更面向对象的继承方式，并解决了一些组合继承的缺点。`class` 继承的底层实现仍然是基于原型链的，但通过语法糖的形式，使得继承更加易用和易于理解。

可以这样理解：

*   **组合继承是 `class` 继承的“底层实现”**（或者说，`class` 继承是对组合继承的封装和优化）。
*   **`class` 继承是组合继承的“语法糖”**（或者说，`class` 继承提供了一种更高级、更方便的使用组合继承的方式）。
