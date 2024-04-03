---
title: Example report
---

# Testing mutables

```js
const count = Mutable(0);
const increment = (x) => (count.value = x);
```

The current value of x is ${count}.

```js
const button = html`<button>Increment <i> x </i></button>`;
button.onclick = () => {
  console.log(count);
  const whatnow = 25;
  increment(whatnow);
}; // x.set(x.value + 1);

display(button);
```
