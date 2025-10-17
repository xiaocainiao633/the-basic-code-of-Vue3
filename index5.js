// 可以进行一些优化，如果像这样：
// console.log("Update quantity to =" + product.quantity);
// 我们只想在effect中使用quantity时才进行追踪，而不是每次get都追踪
// 所以可以进行一些优化
// 设计思路是：添加一个activeEffect变量，标识正在运行中的effect
let activeEffect = null;

function effect(eff) {
  activeEffect = eff;
  activeEffect();
  activeEffect = null;
}

// 看看track有什么变化：

const targetMap = new WeakMap();
function track(target, key) {
  if (activeEffect) {
    let depsMap = targetMap.get(target);
    if (!depsMap) {
      targetMap.set(target, (depsMap = new Map()));
    }
    let dep = depsMap.get(key);
    if (!dep) {
      depsMap.set(key, (dep = new Set()));
    }
    dep.add(activeEffect);
  }
}
// 接下来会进行一些较为高级的测试，但不会像写测试用例那样严谨
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
      // 不能简单地比较result，因为result只是Reflect.set的返回值，表示设置是否成功
      if (oldValue !== value) {
        trigger(target, key);
      }
      return result;
    },
  };
  return new Proxy(target, handler);
}

let product = reactive({ price: 5, quantity: 2 });
let total = 0;
let salePrice = 0;

effect(() => {
  total = product.price * product.quantity;
});

effect(() => {
  salePrice = product.price * 0.9;
});

console.log(`total=${total}, salePrice=${salePrice}`);
product.quantity = 3;
console.log(`total=${total}, salePrice=${salePrice}`);
product.price = 10;
console.log(`total=${total}, salePrice=${salePrice}`);

// salePrice不具备响应式
// 因为salePrice不是reactive对象的属性，所以不会被track到
// 所以我们可以用ref
let salePriceRef = ref(0);
effect(() => {
  total = salePrice.value * product.quantity;
});
// 考虑如何定义ref呢
