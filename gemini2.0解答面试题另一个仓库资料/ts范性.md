好的，面试官，关于 TypeScript 中的泛型（Generics），我将从以下几个方面进行详细介绍：

**1. 泛型的概念与作用**

*   **什么是泛型？**

    泛型是 TypeScript 中的一种强大的类型工具，它允许我们在定义函数、接口、类或类型别名时不预先指定具体的类型，而是在使用时再指定类型。泛型可以理解为“类型参数”，就像函数的参数一样，可以在函数调用时传入具体的值。

*   **泛型的作用：**

    *   **代码复用：** 泛型可以让我们编写出更通用的代码，这些代码可以处理多种不同的类型，而无需为每种类型都编写 আলাদা的代码。
    *   **类型安全：** 泛型可以在编译时检查类型错误，避免在运行时出现类型相关的错误。
    *   **提高代码可读性和可维护性：** 泛型可以使代码更易于理解和维护，因为它可以清楚地表达出代码的意图和类型之间的关系。

**2. 泛型的基本用法**

*   **泛型函数：**

    ```typescript
    function identity<T>(arg: T): T {
      return arg;
    }

    let myString = identity<string>('hello'); // 明确指定类型为 string
    let myNumber = identity(123);           // 类型推断，TypeScript 自动推断类型为 number
    ```

    *   `<T>`：在函数名后面使用 `<T>` 来声明一个类型参数 `T`。`T` 可以是任何有效的标识符（通常使用 `T`、`U`、`K`、`V` 等）。
    *   `arg: T`：表示函数的参数 `arg` 的类型是 `T`。
    *   `: T`：表示函数的返回值类型也是 `T`。
    *   `identity<string>('hello')`：在调用函数时，可以使用 `<类型>` 来显式地指定类型参数。
    *   `identity(123)`：如果省略类型参数，TypeScript 会根据传入的参数自动推断类型。

*   **泛型接口：**

    ```typescript
    interface GenericIdentityFn<T> {
      (arg: T): T;
    }

    function identity<T>(arg: T): T {
      return arg;
    }

    let myIdentity: GenericIdentityFn<number> = identity;
    ```

*   **泛型类：**

    ```typescript
    class GenericNumber<T> {
      zeroValue: T;
      add: (x: T, y: T) => T;
    }

    let myGenericNumber = new GenericNumber<number>();
    myGenericNumber.zeroValue = 0;
    myGenericNumber.add = function(x, y) {
      return x + y;
    };
    ```

*   **泛型类型别名：**

    ```typescript
    type Nullable<T> = T | null;

    let myString: Nullable<string> = 'hello';
    let myNullString: Nullable<string> = null;
    ```

**3. 泛型约束 (Generic Constraints)**

有时，我们需要限制泛型参数的类型范围。可以使用 `extends` 关键字来约束泛型参数：

```typescript
interface Lengthwise {
  length: number;
}

function loggingIdentity<T extends Lengthwise>(arg: T): T {
  console.log(arg.length); // OK，因为 T 肯定有 length 属性
  return arg;
}

loggingIdentity({ length: 10, value: 3 }); // OK
loggingIdentity(3); // Error: Argument of type 'number' is not assignable to parameter of type 'Lengthwise'.
```

*   `T extends Lengthwise`：表示类型参数 `T` 必须实现 `Lengthwise` 接口，即必须具有 `length` 属性。

**4. 在泛型约束中使用类型参数**

```typescript
function getProperty<T, K extends keyof T>(obj: T, key: K) {
  return obj[key];
}

let x = { a: 1, b: 2, c: 3, d: 4 };

getProperty(x, 'a'); // OK
getProperty(x, 'm'); // Error: Argument of type '"m"' is not assignable to parameter of type '"a" | "b" | "c" | "d"'.
```

*   `K extends keyof T`：表示类型参数 `K` 必须是类型 `T` 的键之一。

**5. 泛型默认值 (Generic Defaults)**

可以为泛型参数指定默认类型：

```typescript
function createArray<T = number>(length: number, value: T): Array<T> {
  let result: T[] = [];
  for (let i = 0; i < length; i++) {
    result[i] = value;
  }
  return result;
}

let numArray = createArray(3, 0);     // number[]
let strArray = createArray<string>(3, 'x'); // string[]
```

*   `<T = number>`：表示类型参数 `T` 的默认类型是 `number`。

**6. 多类型参数**

泛型可以有多个类型参数：

```typescript
function swap<T, U>(tuple: [T, U]): [U, T] {
  return [tuple[1], tuple[0]];
}

let swapped = swap([7, 'seven']); // [string, number]
```

**7. 泛型与内置类型**

TypeScript 的许多内置类型都使用了泛型，例如：

*   `Array<T>`
*   `Promise<T>`
*   `Map<K, V>`
*   `Set<T>`

**8. 泛型的常见应用场景**

*   **编写可重用的函数、类或接口：** 泛型可以让我们编写出更通用的代码，这些代码可以处理多种不同的类型。
*   **创建类型安全的集合：** 泛型可以用于创建类型安全的数组、列表、映射等数据结构。
*   **封装 API：** 泛型可以用于封装 API，使其更易于使用和理解。
*   **实现设计模式：** 泛型可以用于实现一些设计模式，如工厂模式、策略模式等。

**9. 泛型的高级用法**
*   **条件类型中的泛型：**

    ```typescript
    type ReturnType<T> = T extends (...args: any[]) => infer R ? R : any;
    ```
    `ReturnType<T>` 可以获取函数类型 `T` 的返回值类型。

* **映射类型中的泛型:**

    ```typescript
    type Readonly<T> = {
        readonly [P in keyof T]: T[P];
    };
    ```
    `Readonly<T>` 可以将类型 `T` 的所有属性变为只读。

**10. 泛型工具类型**
Typescript 内置了一些工具类型来简化常见的类型操作。
*   `Partial<T>`: 将类型 `T` 的所有属性变为可选。
*   `Required<T>`: 将类型 `T` 的所有属性变为必选。
*   `Readonly<T>`: 将类型 `T` 的所有属性变为只读。
*   `Pick<T, K>`: 从类型 `T` 中选取一组属性 `K`。
*   `Omit<T, K>`: 从类型 `T` 中排除一组属性 `K`。
*   `Record<K, T>`: 创建一个对象类型，键为 `K`，值为 `T`。
*   `Exclude<T, U>`: 从类型 `T` 中排除可以赋值给类型 `U` 的类型。
*   `Extract<T, U>`: 从类型 `T` 中提取可以赋值给类型 `U` 的类型。
*   `NonNullable<T>`: 从类型 `T` 中排除 `null` 和 `undefined`。
*   `Parameters<T>`: 获取函数类型 `T` 的参数类型，返回一个元组类型。
*   `ConstructorParameters<T>`: 获取构造函数类型 `T` 的参数类型，返回一个元组类型。
*   `ReturnType<T>`: 获取函数类型 `T` 的返回值类型。
*   `InstanceType<T>`: 获取构造函数类型 `T` 的实例类型。

**总结**

泛型是 TypeScript 中一项强大的功能，它允许我们编写出更通用、更类型安全、更易于维护的代码。通过泛型，我们可以将类型作为参数传递给函数、接口、类或类型别名，从而实现代码的复用和类型检查。掌握泛型的基本用法、泛型约束、泛型默认值、多类型参数以及泛型与内置类型的结合使用，可以帮助我们编写出更优雅、更健壮的 TypeScript 代码。
