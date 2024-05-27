---
theme: dashboard
title: Data Processing
toc: false
sidebar: true
---

# Data Processing

Create grids testing

## Gridding 1

```js
// const gridded = FileAttachment("data/griddedData.json").json();
// display(Inputs.table(gridded));
```

## Gridding 2

```js
const gridded2 = await FileAttachment("data/gridding.json").json();
display(gridded2);
```

There are two types of data for gridded-glyphmap:

1. data with their original coordinates intact
2. gridded data by geographic region

For the former, no need to do anything. the data can be merged as it is into a single product.
for the latter, a gridding process is needed to convert the data into a format that can be used by the glyphmap.
