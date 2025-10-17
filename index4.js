// track and trigger
const targetMap = new WeakMap();
function track(target, key) {
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()));
  }
  let dep = depsMap.get(key);
  if (!dep) {
    depsMap.set(key, (dep = new Set()));
  }
  dep.add(effect);
}

function trigger(target, key) {
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    return;
  }
  let dep = depsMap.get(key);
  if (dep) {
    dep.forEach((effect) => {
      effect();
    });
  }
}

// reactive
function reactive(target) {
  const handler = {
    get(target, key, receiver) {
      console.log("get", key);
      let result = Reflect.get(target, key, receiver);
      track(target, key);
      return result;
    },
    set(target, key, value, receiver) {
      console.log("set", key, value);
      let oldValue = target[key];
      let result = Reflect.set(target, key, value, receiver);
      if (oldValue !== result) {
        trigger(target, key);
      }
      return result;
    },
  };
  return new Proxy(target, handler);
}

let product = reactive({ price: 5, quantity: 2 });
let total = 0;
// we can throw track and trigger
let effect = () => {
  total = product.price * product.quantity;
};
effect();
console.log(total);
product.quantity = 3;
console.log(total);

// 到现在，代码还是有一些问题，在index5.js中进行一些优化
