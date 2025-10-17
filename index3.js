// proxy + Reflect

let product = { price: 5, quantity: 2 };
let proxiedProduct = new Proxy(product, {
  get() {
    console.log("get");
    return "Not the value";
  },
});

// not the value but the return of get
console.log(proxiedProduct.quantity);

// try new way
let proxiedProduct2 = new Proxy(product, {
  get(target, key) {
    console.log("get", key);
    return target[key];
  },
});
console.log(proxiedProduct2.quantity);

// with Reflect
let proxiedProduct3 = new Proxy(product, {
  get(target, key, receiver) {
    console.log("get", key);
    return Reflect.get(target, key, receiver);
  },
});
console.log(proxiedProduct3.quantity);

// try new handler: set
let proxiedProduct4 = new Proxy(product, {
  get(target, key, receiver) {
    console.log("get", key);
    return Reflect.get(target, key, receiver);
  },
  set(target, key, value, receiver) {
    console.log("set", key, value);
    return Reflect.set(target, key, value, receiver);
  },
});
proxiedProduct4.quantity = 5;
console.log(proxiedProduct4.quantity);

// 接下来可以改造为我们更常见的版本
function reactive(target) {
  const handler = {
    get(target, key, receiver) {
      console.log("get", key);
      return Reflect.get(target, key, receiver);
    },
    set(target, key, value, receiver) {
      console.log("set", key, value);
      return Reflect.set(target, key, value, receiver);
    },
    // other traps
  };
  return new Proxy(target, handler);
}

console.log("----reactive----");
let newproduct = reactive({ price: 5, quantity: 2 });
newproduct.quantity = 10;
console.log(newproduct.quantity);
// 看到这里，可以回顾一下index2.js中的内容，我会创建index3.js来整合
