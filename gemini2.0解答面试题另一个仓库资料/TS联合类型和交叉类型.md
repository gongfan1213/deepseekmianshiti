好的，面试官，关于 TypeScript 中的联合类型（Union Types）和交叉类型（Intersection Types），我将详细介绍它们的定义、用法、区别、应用场景以及一些注意事项：

**1. 联合类型 (Union Types)**

*   **定义：**
    *   联合类型表示一个值可以是多个类型中的一种。
    *   使用 `|` 符号分隔多个类型。
*   **语法：**
    ```typescript
    let variable: Type1 | Type2 | Type3;
    ```
    这表示 `variable` 变量可以是 `Type1`、`Type2` 或 `Type3` 类型。
*   **示例：**

    ```typescript
    let value: string | number;

    value = 'hello'; // OK
    value = 123;     // OK
    value = true;    // Error: Type 'boolean' is not assignable to type 'string | number'.
    ```

*   **类型收窄 (Type Narrowing):**

    在使用联合类型的值时，TypeScript 通常需要我们进行类型收窄，以确保在特定情况下使用正确的类型。

    ```typescript
    function processValue(value: string | number) {
      if (typeof value === 'string') {
        // 在这个代码块中，TypeScript 知道 value 是 string 类型
        console.log(value.toUpperCase());
      } else {
        // 在这个代码块中，TypeScript 知道 value 是 number 类型
        console.log(value.toFixed(2));
      }
    }
    ```
    常见的方法包括： typeof, instanceof, in, 字面量类型, 以及自定义类型保护函数

*   **应用场景：**
    *   表示一个变量或参数可以是多种类型中的一种。
    *   处理可能返回不同类型值的函数。
    *   定义可选属性或参数。

**2. 交叉类型 (Intersection Types)**

*   **定义：**
    *   交叉类型将多个类型合并为一个类型。
    *   新类型具有所有原始类型的特性。
    *   使用 `&` 符号连接多个类型。
*   **语法：**

    ```typescript
    let variable: Type1 & Type2 & Type3;
    ```

    这表示 `variable` 变量同时具有 `Type1`、`Type2` 和 `Type3` 类型的所有成员。

*   **示例：**

    ```typescript
    interface Person {
      name: string;
      age: number;
    }

    interface Employee {
      employeeId: number;
      department: string;
    }

    type EmployeePerson = Person & Employee;

    const employee: EmployeePerson = {
      name: 'John Doe',
      age: 30,
      employeeId: 12345,
      department: 'IT',
    };
    ```

*   **应用场景：**
    *   将多个接口或类型合并为一个类型。
    *   创建具有多个类型特性的对象。
    *   实现 Mixin 模式。

**3. 联合类型与交叉类型的区别**

| 特性         | 联合类型 (Union Types)                                                                                | 交叉类型 (Intersection Types)                                                                                                                                        |
| :----------- | :----------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 含义         | 表示一个值可以是多个类型中的**一种**。                                                                     | 将多个类型**合并**为一个类型，新类型具有所有原始类型的特性。                                                                                                                     |
| 符号         | `|`                                                                                                    | `&`                                                                                                                                                                 |
| 成员         | 只能访问所有类型的**共有成员**（除非进行类型收窄）。                                                               | 可以访问所有类型的**所有成员**。                                                                                                                                               |
| 赋值         | 变量可以被赋值为联合类型中**任意一种类型**的值。                                                                 | 变量必须被赋值为一个对象，该对象**同时满足所有类型**的要求。                                                                                                                    |
| 类型推断     | TypeScript 通常需要进行类型收窄才能确定具体类型。                                                              | TypeScript 可以直接推断出交叉类型的成员。                                                                                                                                    |
| 使用场景     | 表示一个值可以是多种类型中的一种；处理可能返回不同类型值的函数；定义可选属性或参数。                                         | 将多个接口或类型合并为一个类型；创建具有多个类型特性的对象；实现 Mixin 模式。                                                                                              |
| 类比         | 类似于“或”的关系。                                                                                     | 类似于“且”的关系。                                                                                                                                                       |
| 对象属性合并 | 如果联合类型的成员是对象类型，则只能访问这些对象类型的**公共属性**。                                                     | 如果交叉类型的成员是对象类型，则会将这些对象类型的属性**合并**起来。                                                                                                             |
| 冲突处理     | 如果联合类型的成员具有相同的属性名但类型不同，则该属性的类型为这些类型的**联合类型**。                                           | 如果交叉类型的成员具有相同的属性名但类型不同，则该属性的类型为这些类型的**交叉类型**（通常为 `never`，除非类型之间存在父子关系）。                                                  |
| 函数类型     | 如果联合类型的成员是函数类型，则只能使用这些函数类型的**公共参数和返回值类型**进行调用。                                      | 如果交叉类型的成员是函数类型，则会进行函数重载，新类型可以根据不同的参数类型调用不同的函数实现（但通常难以实现）。                                                                 |
| never        | 联合类型中包含`never`，则`never`会被忽略，例如`string | never`等同于`string`                             | 交叉类型中包含`never`，则结果为`never`，例如`string & never`的结果为`never`                                                                                           |

**4. 联合类型与交叉类型的高级用法**

*   **与字面量类型结合：**

    ```typescript
    type Status = 'success' | 'error';
    type StatusCode = 200 | 400 | 500;

    let status: Status = 'success';
    let code: StatusCode = 200;
    ```

*   **与泛型结合：**

    ```typescript
    function merge<T, U>(obj1: T, obj2: U): T & U {
      return { ...obj1, ...obj2 };
    }
    ```

*   **与条件类型结合：**

    ```typescript
    type NonNullable<T> = T extends null | undefined ? never : T;

    type Result = NonNullable<string | null>; // Result 的类型是 string
    ```

*   **可辨识联合 (Discriminated Unions):**
    *  可辨识联合是一种特殊的联合类型，它有一个共同的可辨识属性（通常称为“标签”或“判别式”）。
    * 可以通过检查可辨识属性来缩小类型的范围。
   ```typescript
     interface Square {
          kind: "square";
          size: number;
      }

      interface Rectangle {
          kind: "rectangle";
          width: number;
          height: number;
      }

      interface Circle {
          kind: "circle";
          radius: number;
      }

      type Shape = Square | Rectangle | Circle;
        function area(s: Shape) {
            switch (s.kind) {
                case "square": return s.size * s.size;
                case "rectangle": return s.height * s.width;
                case "circle": return Math.PI * s.radius ** 2;
            }
      }
   ```

**5. 注意事项**

*   **类型收窄：** 在使用联合类型时，通常需要进行类型收窄，以确保在特定情况下使用正确的类型。
*   **避免过度使用交叉类型：** 交叉类型可能会导致类型定义复杂化，应谨慎使用。
*   **注意同名属性的冲突：** 在使用交叉类型时，需要注意同名属性的类型冲突问题。
* **完整性检查** 当使用联合类型时， Typescript 会进行完整性检查，确保所有成员类型都被考虑到，避免遗漏

**总结**

联合类型和交叉类型是 TypeScript 中两种强大的类型工具。联合类型表示一个值可以是多种类型中的一种，常用于处理可选属性、参数或不同类型的返回值。交叉类型将多个类型合并为一个类型，常用于组合接口、创建具有多个类型特性的对象或实现 Mixin 模式。理解它们的区别和用法，可以帮助我们编写更灵活、更健壮、更易于维护的 TypeScript 代码。
