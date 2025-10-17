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
    dep.Map.set(key, (dep = new Set()));
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
