// Ref的示例 以及compouted的实现思路

let user = {
  firstName: "John",
  lastName: "Doe",
  get fullName() {
    return this.firstName + " " + this.lastName;
  },
  set fullName(value) {
    [this.firstName, this.lastName] = value.split(" ");
  },
};

console.log(user.fullName); // John Doe
user.fullName = "Jane Smith";
console.log(user.fullName);
// 这段代码是js中存取器属性的用法示例，和响应式系统无关

let activeEffect = null;

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

function ref(raw) {
  const r = {
    get value() {
      track(r, "value");
      return raw;
    },
    set value(newValue) {
      if (raw !== newValue) {
        raw = newValue;
      }
      trigger(r, "value");
    },
  };
  return r;
}

// 避免冗余，computed的实现也放到这里
function computed(getter) {
  let result = ref();
  effect(() => {
    result.value = getter();
  });
  return result;
}

// 我们的数据可以改为：
let product = reactive({ price: 5, quantity: 2 });
let salePrice = computed(() => product.price * 0.9);
let total = computed(() => product.price * product.quantity);

console.log(salePrice.value);
