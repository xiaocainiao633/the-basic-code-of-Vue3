// the reactivity system

// create a system
let product = { price: 5, quantity: 2 };

// Map
const depsMap = new Map();

// track function
function track(key) {
  // get the dep for the key
  let dep = depsMap.get(key);
  if (!dep) {
    depsMap.set(key, (dep = new Set()));
  }
  // add the effect to the dep
  dep.add(effect);
  // effect is assumed to be defined elsewhere(such as in index.js)
}

// trgger function
function trigger(key) {
  // Get the dep for this key
  let dep = depsMap.get(key);
  if (dep) {
    dep.forEach((effect) => {
      effect();
    });
  }
}

// now we can test this in product
let total = 0;

let effect = () => {
  total = product.price * product.quantity;
};

track("quantity");
effect();
console.log(total);
product.quantity = 3;
console.log(total);
trigger("quantity");
console.log(total);

// another system

// WeakMap
const targetMap = new WeakMap();

// track2 function
function track2(target, key) {
  let depsMap = targetMap.get(target); // product
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()));
  }
  let dep = depsMap.get(key); // quantity
  if (!dep) {
    depsMap.set(key, (dep = new Set()));
  }
  dep.add(effect);
}

function trigger2(target, key) {
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    return;
  }
  let dep = depsMap.get(key);
  if (dep) {
    dep.forEach((effect2) => {
      effect();
    });
  }
}

product = { price: 5, quantity: 2 };
total = 0;
track2(product, "quantity");
effect();
console.log(total);
product.quantity = 3;
console.log(total);
trigger2(product, "quantity");
console.log(total);
// you can see the same result
