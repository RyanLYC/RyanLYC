### TypeScript 常用内置工具类

1. Omit 省略/剔除:剔除 已定义对象中 自己不需要的一部分形成新的定义类型。

```ts
interface UserObj {
  readonly name: string; // readonly 只读属性 只能初始化定义 不能二次赋值
  age: number;
  id: number;
  sex: 0 | 1;
  address: string;
  weight: number;
}

// 剔除省略自己不需要的
type Person = Omit<UserObj, "age" | "sex" | "address" | "weight">;

// 此时Person 等同于 Person1

interface Person1 {
  readonly name: string;
  id: number;
}
```

2. Pick 采集:采集 已定义对象中 自己需要的一部分形成新的定义类型。

```ts
interface UserObj {
  readonly name: string;
  age: number;
  id: number;
  sex: 0 | 1;
  address: string;
  weight: number;
}

// 采集需要的
type Person = Pick<UserObj, "name" | "id">;

// 此时Person 等同于 Person1
interface Person1 {
  readonly name: string;
  id: number;
}
```

3. Partial : 可把定义好的对象（包含 必选+可选项）类型全部转化为可选项

```ts
type Partial<T> = {
  [P in keyof T]?: T[P];
};
```

```ts
// 已有定义类型Person
interface Person {
  name: string;
  age: number;
  id: number;
  sex: 0 | 1;
  address: string;
  weight: number;
}

// 使用方法
const newObj: Partial<Person> = {
  name: "张三", // 假如只需要一项 Partial的便捷性 可以不需要从新定义类型
};

// Partial<Person>等同于 NewPerson
interface NewPerson {
  name?: string;
  age?: number;
  id?: number;
  sex?: 0 | 1;
  address?: string;
  weight?: number;
}
```

4. Required (必选的): Required 和 Partial 刚好相反,

```ts
/**
 * Make all properties in T required
 */
type Required<T> = {
  [P in keyof T]-?: T[P];
};
```

5. Readonly (转化只读)

```ts
/**
 * Make all properties in T readonly
 */
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};
```

```ts
interface Person {
  readonly name: string; // 只有这一项有readonly
  age: number;
  id?: number;
}

// 使用方法
const newObj: Readonly<Person> = {
  name: "张三",
  age: 1,
  id: 1,
};
// newObj.name = '李四'; // 异常 因为有readonly只读属性，只能初始化声明，不能赋值。

// Readonly<Person> 等同于 NewPerson
interface NewPerson {
  readonly name: string;
  readonly age: number;
  readonly id?: number;
}
```

6. Extract (提取/包括) 一般用于处理联合类型

```ts
// Extract实现源码 原理很简单
type Extract<T, U> = T extends U ? T : never;
```

```ts
// 处理联合类型
type Test1 = "1" | "2" | "3";

const obj: Extract<Test1, "1" | "2"> = "1"; // 1,2 OK 赋值3就会error
```

7. Exclude (排除/不包括) 和 Extract 正好相反，也是用于处理联合类型

```ts
// Exclude源码
type Exclude<T, U> = T extends U ? never : T;
```

```ts
// 处理联合类型
type Test1 = "1" | "2" | "3";

const obj: Exclude<Test1, "1" | "2"> = "3"; // 3 OK 赋值1,2就会error
```

8. ReturnType (函数的类型推导返回)

```ts
// ReturnType源码
/**
 * Obtain the return type of a function type
 */
type ReturnType<T extends (...args: any) => any> = T extends (
  ...args: any
) => infer R
  ? R
  : any;
```

```ts
// 正确用法
const myFun = () => ({
  name: "zhangsan",
  age: 233,
  sex: "1",
  tel: 123456789,
  fun: () => {
    return 233;
  },
  arr: [1, 2, 3, 4, 5, 6],
});

type Test2 = ReturnType<typeof myFun>; // OK 鼠标放到Test2上可以发现 已推导出了myFun函数的返回类型。

// 错误用法
const someValue = 42;
type InvalidReturnType = ReturnType<typeof someValue>; // error错误！someValue 不是一个函数。
```

9. NonNullable (类型中排除 null 和 undefined)

```ts
// 源码
/**
 * Exclude null and undefined from T
 */
type NonNullable<T> = T & {}; // 源码的这一句写的很有意思，泛型参数T和{}的交集就默认排除了`null` 和 `undefined`
```

```ts
type MaybeString = string | null | undefined;

const value: MaybeString = getSomeStringValue(); // 假设这个函数可能返回一个字符串、null 或 undefined

// 使用 NonNullable 确保 value 不会是 null 或 undefined
const nonNullableValue: NonNullable<MaybeString> = value!; // 使用 ! 断言操作符，或者通过其他方式确保值不为 null 或 undefined

// 现在，nonNullableValue 的类型是 string，因为我们已经排除了 null 和 undefined
console.log(nonNullableValue.length); // 这是安全的，因为我们知道 nonNullableValue 一定是字符串

// 其实就是某些场景绝对为了排除null,undefined的类型才用的
```
