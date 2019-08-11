---
title: immutable-readonly-pattern-in-typescript
date: 2019-07-26 15:07:59
tags: typescript, design-pattern, immutable
---

No matter how small a project is, there are bound to be a few data classes which are responsible to represent the information itself. It is usually referred as Plain-Old-Java-Object (POJO), entity, data transfer object (DTO), or model. Now, as the project grows, we want to be able to expose a some properties from the object but not all of them. For example, a response object from server to client that masked away sensitive information, or even established a contract between function caller so they can read from certain fields but not allow to change them in order to protect object's integrity. How do we achieve this?

## Immutable Interface
Immutable means that something unchangeable. Once an object is created, it hold on to that value until it is wiped from memory.

One such immutable type in typescript is `string`.

```typescript
let a = "A"
let b = a

a = "C"

console.log(a) // C
console.log(b) // A
```

I will not discuss in detail about immutability, as there are many comprehensive articles out there on the internet. 

## ReadOnly, Please!
But immutability does not prevent the value being replaced! How can we protect the object integrity?

To achieve this, we use the `readonly` keyword on the property:
```typescript
class A {
	readonly a: string = "A"
}

let a = new A()
A.a = "B" // compilation error
```

Any mutation on the object value will trigger complain from your compiler.

## Example: User information
Let's go with this example: we have a simple User entity object:
```typescript
class User{
	public name: string
	public password: string

	constructor(name: string, password: string){
		this.name = name
		this.password = password
	}
}
```
Let's say we have a controller that handle request from caller to read `User` information:
```typescript
class UserController{
	public getUser() {
		const user = new User("kfwong", "#icebearforpresident")

		return user;
	}
}
```
Hold on, we are sending the password back to the caller! We can fix this with a readonly, immutable interface:

```typescript
interface ReadOnlyUser{
	readonly name: string
	readonly password: string
}

class User implements ReadOnlyUser{ // let User entity implements the readonly interface
	...
}
```

Now in our `UserController`:

```typescript
class UserController{
	public getUser(): ReadOnlyUser {
		const user: ReadOnlyUser = new User("kfwong", "#icebearforpresident")

		return user;
	}
}
```

As we restrict read/write access to sensitive `password` field with `ReadOnlyUser` interface, the caller will not be able to access this information.

## Limitation

### Casting to mutable type
Of course, the caller can always do a simple cast to mutate the object fields:
```typescript
const user: User = (User) readonlyUser;
```

### JSON.stringify
You'd normally expect JSON.stringify to read from the fields exposed by the interface only, but in fact the actual object fields are exposed in the singified form:
```typescript
const user: ReadOnlyUser = new User("kfwong", "#icebearforpresident")
console.log(user) // {"name":"kfwong", "password":"#icebearforpresident"}
```

### Deeply nested properties
`readonly` can only protect direct reference on the variable. If the variable is an object or class that contains other properties, these nested fields can still be modified:
```typescript

class Address{
	public postcode: string
}
class User{
	readonly address: Address
	...
}

let user = new User(...);
user.address.postcode = "123456" // ok, no compilation errors
```

Look into `Object.freeze()` to resolve this problem.

## Alternatives
### `get` & `set` accessors in TypeScript
It is possible to make use of accessors to achieve the same result, but it may become more complex to maintain as the fields increases.