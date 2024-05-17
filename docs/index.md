---
theme: dashboard
title: Multivariate Glyph Maps
toc: false
sidebar: false
---

```js
import * as d3 from "npm:d3";
import { Mutable } from "npm:@observablehq/stdlib";
import * as statsbreaks from "https://cdn.jsdelivr.net/npm/statsbreaks@1.0.6/dist/index.min.js";
import { glyphMap } from "./components/gridded-glyphs/index.min.js";

import {
  selected_parameters,
  maptypes,
  colours,
  categories,
  canvasPattern,
} from "./components/configs.js";
import {
  calculateScoresWithRank,
  aggregateValues,
  drawHatch,
  quantileBreaks,
  // getColourForGrid,
} from "./components/utils.js";
```

<!-------- Data -------->

```js
const griddedData = FileAttachment("data/griddedData.json").json();
```

<!-------- Plots -------->

<!-------- Input Panels -------->

<div class="grid grid-cols-4" style="margin:5px">
  <div class="card glyphmaps grid-colspan-3" style="padding:3px; height:65vh;">
    ${resize((width, height) => drawDecarbonisationGlyphs({ width, height }))}
  </div>
  <div class="card grid-colspan-1">
    <canvas id="myCanvas" style="padding:50">
    ${overview()}
  </div>
</div>

<!-- Control Panels -->
<div class="grid grid-cols-3" style="margin:0">
  <!-- Card 1 -->
  <div class="card" style="display: flex; justify-content: space-around; padding:1; flex-direction: column; gap: 0rem;">
    <h2>Glyph Settings</h2>
    ${tileInput}
    ${glyphModeInput}
    ${gridSizeInput}
    ${gridTransparencyInput}
    ${glyphTransparencyInput}
    ${showTooltipInput}
    ${showRelativeInput}
    ${discretisationInput}
  </div>
  <!-- Card 2 -->
  <div class="card" style="margin:0" >
    <h2>Parameter Weights</h2>
    <div style="display: flex; align-items: center;"> 
      <svg width="20" height="20" style="margin-right: 5px;">
        <rect width="20" height="20" style="fill:green"/>
      </svg>
      ${inputs.pv_input}
    </div>
    <div style="display: flex; align-items: center;"> 
      <svg width="20" height="20" style="margin-right: 5px;">
        <rect width="20" height="20" style="fill:red"/>
      </svg>
      ${inputs.ashp_input}
    </div>
    <div style="display: flex; align-items: center;"> 
      <svg width="20" height="20" style="margin-right: 5px;">
        <rect width="20" height="20" style="fill:crimson"/>
      </svg>
      ${inputs.gshp_input}
    </div>
    <div style="display: flex; align-items: center;"> 
      <svg width="20" height="20" style="margin-right: 5px;">
        <rect width="20" height="20" style="fill:deeppink"/>
      </svg>
      ${inputs.insulation_input}
    </div>
    <div style="display: flex; align-items: center;"> 
      <svg width="20" height="20" style="margin-right: 5px;">
        <rect width="20" height="20" style="fill:cornflowerblue"/>
      </svg>
      ${inputs.electricity_input}
    </div>
        <div style="display: flex; align-items: center;"> 
      <svg width="20" height="20" style="margin-right: 5px;">
        <rect width="20" height="20" style="fill:blue"/>
      </svg>
      ${inputs.gas_input}
    </div>
      <div style="display: flex; align-items: center;"> 
      <svg width="20" height="20" style="margin-right: 5px;">
        <rect width="20" height="20" style="fill:yellow"/>
      </svg>
      ${inputs.fuel_input}
    </div>
      <div style="display: flex; align-items: center;"> 
      <svg width="20" height="20" style="margin-right: 5px;">
        <rect width="20" height="20" style="fill:gold "/>
      </svg>
      ${inputs.depriv_input}
    </div> 
  </div>
  <!-- Card 3 -->
  <div class="card" style="margin:0">
    <h2>Details on demand</h2>
    ${overlaiddata[1]}
  </div>
</div>

<!-------- Helper Functions -------->

```js
const overlaiddata = Mutable([]);
const updateOverlay = (x) => (overlaiddata.value = x);
```

<!--------- Glyph Main Functions --------->

```js
// TODO: fix glitch issue on the canvas
// await visibility();
function drawDecarbonisationGlyphs({ width, height } = {}) {
  // console.log("drawGlyphs");
  return glyphMap({
    data: grid_scores,
    getLocationFn: (row) => [row.long, row.lat],
    cellSize: gridSize,
    mapType: tile, // "CartoPositronNoLabel", //
    discretisationShape: discretisation,// "grid", //discretisation

    width: width,
    height: height,
    tileWidth: 150,

    glyph: {
      aggrFn: appendRecordsAggrFn,
      postAggrFn: postAggrFn,
      drawFn: interactiveDrawFn("Rose Chart"),
      tooltipTextFn: (cell) => {
        if (cell.averages) {
          // updateOverlay([cell.averages, cell.score]);
          overview([cell.averages, cell.score]);
          // console.log(overlaiddata);
          if (showTooltip) {
            const textBuilder = [];
            for (const variable of selected_parameters) {
              const average = cell.averages[variable] ?? "-";
              const percentage = average ? Math.round(average) + "%" : "-";
              textBuilder.push(`${variable}=${percentage}; <br>`);
            }
            textBuilder.push(`"Score"=${cell.score}; <br>`);
            const text = textBuilder.join("").slice(0, -4); // Remove trailing "; "
            // console.log("text", text);

            return text;
          } else return "";
        }
        // overview();
      },
      // postDrawFn: drawLegend
    },
  });
}

// invalidation.then(() => cancelAnimationFrame(frame));
```

```js
function appendRecordsAggrFn(cell, row, weight, global, panel) {
  // console.log("global", panel.ctx);
  // drawGeoPathsToCanvas(lsoaData, panel.ctx);
  if (!cell.records) cell.records = []; //if the cell doesn't currently have a records property, make one
  cell.records.push(row); //append the record
}

function postAggrFn(cells, cellSize, global, panel) {
  for (const cell of cells) {
    // console.log(cell.record);
    cell.averages = {};
    if (cell.records) {
      // Averages the values for each cell
      // console.log("summarise", reshapeData(aggregatesCell(cell.records)));
      cell.averages = aggregateValues(cell.records, selected_parameters); // cell value aggregation function

      // cell score
      const cellScores = cell.records.map((d) => d.score);
      cell.score = d3.max(cellScores); // get the largest score across all data in the cell

      const historical_score = [];
    }
  }
}
```

<!--------- Interactive Draw Function --------->

```js
function interactiveDrawFn(mode) {
  return function drawFn(cell, x, y, cellSize, ctx, global, panel) {
    if (!cell) return;
    const padding = 2;

    ctx.globalAlpha = 1;

    var grid_long = cellSize - padding * 2;
    var grid_wide = cellSize - padding * 2;

    //draw cell background
    const boundary = cell.getBoundary(padding);
    // console.log("the cell score: ", cell.score);
    // console.log("the colour map: ", colourMap(cell.score));
    ctx.fillStyle = colourMap(cell.score);

    ctx.beginPath();
    ctx.moveTo(boundary[0][0], boundary[0][1]);
    for (let i = 1; i < boundary.length; i++)
      ctx.lineTo(boundary[i][0], boundary[i][1]);
    ctx.closePath();
    ctx.fill();

    ctx.globalAlpha = glyphTransparency;
    if (mode == "Bar Chart") {
      drawBarChart3(
        ctx,
        x,
        y,
        cellSize,
        cell.averages,
        colours,
        colourMap(cell.score),
        padding
      );
      if (showRelative) {
        drawBarChartOverlap(ctx, x, y, cellSize, overlaiddata[0], padding);
      }
    } else if (mode == "Rose Chart") {
      drawNightingaleRoseChart3(
        ctx,
        x,
        y,
        cellSize,
        cell.averages,
        colours,
        padding
      );
      if (showRelative) {
        drawNightingaleRoseOverlap(
          ctx,
          x,
          y,
          cellSize,
          overlaiddata[0],
          // colours,
          padding
        );
      }
    } else if (mode == "Historical Score") {
      drawLineChart(ctx, x, y, cellSize, cell.averages);
    }

    ctx.globalAlpha = 1;
  };
}
```

<!--------- Glyph Drawing Functions --------->

```js
function drawBarChart3(
  ctx,
  x,
  y,
  cellSize,
  data, // Aggregated data
  colours,
  background,
  padding = 0
) {
  const gap = 2; // Gap between categories
  let lastCategory = null;

  // calculate maximum absolute weight for positioning
  const maxAbsoluteWeight = Math.max(...Object.values(weights).map(Math.abs));

  // calculate total width of bars based on weights
  const totalBarWidth = Object.values(weights).reduce(
    (sum, weight) => sum + Math.abs(weight),
    0
  );

  const availableWidth =
    cellSize -
    2 * maxAbsoluteWeight -
    gap * (categories.length - 1) - // + 15; // the 15 px offset, from observable (?)
    2 * padding;

  // Calculate starting position for the first bar from the bottom of the cell
  let currentX = x - availableWidth / 2 + padding - 5; // not sure why observable have certain offset to the canvas
  let barY = y + cellSize / 2 - padding; // Start from the bottom of the cell

  // Iterate over each parameter and draw its bar
  selected_parameters.forEach((parameter, i) => {
    const value = data[parameter]; // Access value from aggregated data
    const color = colours[i];
    const weight = weights[parameter];
    const category = categories.find((c) => c.parameter === parameter).category;

    // Calculate bar width based on weight and total bar width
    let barWidth = (Math.abs(weight) * availableWidth) / totalBarWidth;

    const minBarWidth = 1;
    barWidth = Math.max(barWidth, minBarWidth);

    // Calculate bar height based on value and full cell height
    const barHeight = (value / 100) * (cellSize - 2 * padding); // Use full cell height

    // Add a gap if the category has changed
    if (lastCategory && lastCategory !== category) {
      currentX += gap;
    }
    lastCategory = category;

    // Draw the bar
    ctx.fillStyle = color;
    ctx.fillRect(currentX, barY, barWidth, -barHeight); // Draw solid bar with negative height

    // Draw a thick  border for negative weights
    if (weight < 0) {
      // ctx.save();
      const pattern = ctx.createPattern(canvasPattern, "repeat");
      ctx.fillStyle = pattern;
      ctx.fillRect(currentX, barY, barWidth, -barHeight);
      // ctx.fill();
      // ctx.restore();

      // stroke
      ctx.lineWidth = 1;
      ctx.strokeStyle = "white"; // white border on negative weight
      ctx.strokeRect(currentX - padding, barY, barWidth, -barHeight);
    }

    // Update starting position for the next bar
    currentX += barWidth;
  });
}

function drawBarChartOverlap(
  ctx,
  x,
  y,
  cellSize,
  data, // Aggregated data
  // No colours array needed
  // background,
  padding = 0
) {
  const gap = 2; // Gap between categories
  let lastCategory = null;

  // Calculate maximum absolute weight for positioning
  const maxAbsoluteWeight = Math.max(...Object.values(weights).map(Math.abs));

  // Calculate total width of bars based on weights
  const totalBarWidth = Object.values(weights).reduce(
    (sum, weight) => sum + Math.abs(weight),
    0
  );

  const availableWidth =
    cellSize -
    2 * maxAbsoluteWeight -
    gap * (categories.length - 1) -
    2 * padding;

  // Calculate starting position for the first bar from the bottom of the cell
  let currentX = x - availableWidth / 2 + padding - 5;
  let barY = y + cellSize / 2 - padding; // Start from the bottom of the cell

  // Iterate over each parameter and draw its bar
  selected_parameters.forEach((parameter, i) => {
    const value = data[parameter]; // Access value from aggregated data
    const weight = weights[parameter];
    const category = categories.find((c) => c.parameter === parameter).category;

    // Calculate bar width based on weight and total bar width
    let barWidth = (Math.abs(weight) * availableWidth) / totalBarWidth;

    const minBarWidth = 1;
    barWidth = Math.max(barWidth, minBarWidth);

    // Calculate bar height based on value and full cell height
    const barHeight = (value / 100) * (cellSize - 2 * padding); // Use full cell height

    // Add a gap if the category has changed
    if (lastCategory && lastCategory !== category) {
      currentX += gap;
    }
    lastCategory = category;

    // Draw the bar outline (stroke only)
    ctx.strokeStyle = "grey";
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.rect(currentX, barY, barWidth, -barHeight); // Negative height for bottom-up bars
    ctx.stroke();

    // Update starting position for the next bar
    currentX += barWidth;
  });
}

function drawNightingaleRoseChart3(
  ctx,
  x,
  y,
  cellSize,
  data, // Aggregated data
  colours,
  padding = 2
) {
  let radius = (cellSize - 2 * padding) / 2;

  // Calculate center of the chart
  let centerX = x; //+ radius;
  let centerY = y; //+ radius;

  // Calculate angle per section
  const segmentAngle = (2 * Math.PI) / 8; // Fixed angle for 8 sections

  let startingAngle = Math.PI;
  const gapAngle = (2 * Math.PI) / 180; //0.5 * segmentAngle;

  // Iterate over each data type (parameter)
  selected_parameters.forEach((parameter, i) => {
    // Access the single value for the current parameter
    const value = data[parameter]; // Directly access value from aggregated data

    // Calculate section start and end angles
    const startAngle = i * segmentAngle - startingAngle;
    const endAngle = (i + 1) * segmentAngle;
    // const startAngle = (startingAngle + i * segmentAngle) % (2 * Math.PI);
    // const endAngle = (startAngle + segmentAngle) % (2 * Math.PI);

    // Calculate inner and outer radius based on data value and full radius
    const innerRadius = 0; // Set inner radius to 0 for all segments
    const outerRadius = (value / 100) * radius;

    // Set fill style with the parameter's color
    // ctx.fillStyle = "white";

    // Begin path
    if (
      // Math.abs(weights[parameter]) !== 0 &&
      Math.abs(weights[parameter]) > 0.05
    ) {
      /// if zero, skip the drawing altogether
      ctx.beginPath();

      // Draw the segment arc
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.lineTo(centerX, centerY);
      ctx.closePath();

      // ctx.fill();

      // Draw a white stroke between segments
      // ctx.strokeStyle = "white";
      // ctx.lineWidth = 0.4;
      // ctx.stroke();

      // Calculate pie segment width based on weight (use angular units)
      const weightAngle =
        (Math.abs(weights[parameter]) * segmentAngle) /
        Math.max(...Object.values(weights).map(Math.abs));

      // Calculate center angle of the pie segment
      const midAngle = (startAngle + endAngle) / 2;

      // Offset for pie segment arc
      const offsetAngle = 0;

      // Draw the pie segment with the color
      ctx.fillStyle = colours[i];
      ctx.beginPath();
      ctx.arc(
        centerX,
        centerY,
        outerRadius,
        midAngle - weightAngle / 2 - offsetAngle + gapAngle,
        midAngle + offsetAngle + weightAngle / 2 - gapAngle
      );
      ctx.lineTo(centerX, centerY);
      ctx.closePath();
      ctx.fill();

      // If the weight is negative, draw the pattern on top
      if (weights[parameter] < 0) {
        const pattern = ctx.createPattern(canvasPattern, "repeat");
        ctx.fillStyle = pattern;
        ctx.beginPath();
        ctx.arc(
          centerX,
          centerY,
          outerRadius,
          midAngle - weightAngle / 2 - offsetAngle + gapAngle,
          midAngle + offsetAngle + weightAngle / 2 - gapAngle
        );
        ctx.lineTo(centerX, centerY);
        ctx.closePath();
        ctx.fill();
      }
    }
  });
}

function drawNightingaleRoseOverlap(
  ctx,
  x,
  y,
  cellSize,
  data, // Aggregated data
  // No colours array needed
  padding = 2
) {
  let radius = (cellSize - 2 * padding) / 2;

  // Calculate center of the chart
  let centerX = x; //+ radius;
  let centerY = y; //+ radius;

  // Calculate angle per section
  const segmentAngle = (2 * Math.PI) / 8; // Fixed angle for 8 sections

  let startingAngle = Math.PI;
  const gapAngle = (2 * Math.PI) / 180; // 0.5 * segmentAngle (adjust gap size);

  // Iterate over each data type (parameter)
  selected_parameters.forEach((parameter, i) => {
    // Access the single value for the current parameter
    const value = data[parameter]; // Directly access value from aggregated data

    // Calculate section start and end angles
    const startAngle = i * segmentAngle - startingAngle;
    const endAngle = (i + 1) * segmentAngle;

    // Calculate inner and outer radius based on data value and full radius
    const innerRadius = 0; // Set inner radius to 0 for all segments
    const outerRadius = (value / 100) * radius;

    // Set consistent stroke color for wireframes
    ctx.strokeStyle = "grey";

    // Calculate pie segment width based on weight (use angular units)
    const weightAngle =
      (Math.abs(weights[parameter]) * segmentAngle) /
      Math.max(...Object.values(weights).map(Math.abs));

    // Calculate center angle of the pie segment
    const midAngle = (startAngle + endAngle) / 2;

    // Offset for pie segment arc
    const offsetAngle = 0;

    // Draw the pie segment arc (stroke only)
    ctx.beginPath();
    ctx.lineWidth = 0.5;
    ctx.arc(
      centerX,
      centerY,
      outerRadius,
      midAngle - weightAngle / 2 - offsetAngle + gapAngle,
      midAngle + offsetAngle + weightAngle / 2 - gapAngle
    );
    ctx.lineTo(centerX, centerY);
    ctx.closePath();
    ctx.stroke();
  });
}

function drawLineChart(ctx, x, y, cellSize, values) {
  // Calculate boundary based on cell center and size
  const boundary = [
    x - cellSize / 2,
    y - cellSize / 2,
    x + cellSize / 2,
    y + cellSize / 2,
  ];

  // Define margins within the cell
  const margin = 2; // padding value

  // Calculate actual drawing area within the cell
  const width = cellSize - 2 * margin;
  const height = cellSize - 2 * margin;

  const xScale = d3
    .scaleLinear()
    .domain([0, historical_weights[selected_parameters[0]].length])
    .range([margin, width - margin]);

  const yScale = d3
    .scaleLinear()
    .domain([-95, 95]) //y-ranges
    .range([height - margin, margin]);

  // Define line generator with curve
  const line = d3
    .line()
    .curve(d3.curveBasis)
    .x((d) => d.x)
    .y((d) => d.y);

  // Draw lines for each key-data series
  for (let i = 0; i < selected_parameters.length; i++) {
    const color = colours[i];
    const dataPoints = historical_weights[selected_parameters[i]].map(
      (value, index) => ({
        x: xScale(index) + boundary[0], // Offset x-coordinates to cell position
        y: yScale(value * values[selected_parameters[i]]) + boundary[1], // Offset y-coordinates to cell position
      })
    );

    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke(new Path2D(line(dataPoints)));
  }
}
```

<!--------- Overview --------->

```js
// function overview(data) {
//   console.log("Overview function called");
//   console.log("overview data", data[0]);
// }
function overview(data) {
  // updateOverlay([data[0], data[1]]);
  const [w, h] = [250, 250];
  const canvas = document.querySelector("#myCanvas");
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = data && data[1] ? colourMap(data[1]) : "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // console.log("ovddata", overlaiddata[0]);

  // drawLineChart(ctx, reshapedData);
  const x = canvas.width / 2; // / 2 - 25; //30; // observable awkwardly adds these random boundaries to every canvas?
  const y = canvas.height / 2; // / 2 - 25;

  // drawLineChart(ctx, x, y, 300, overlaiddata);
  if (data) {
    if (glyphMode == "Bar Chart") {
      // drawBarChart3(ctx, x, y, 200, overlaiddata[0], colours, 0);
    } else if (glyphMode == "Rose Chart") {
      drawNightingaleRoseChart3(ctx, x, y, 250, data[0], colours, 0);
    } else if (glyphMode == "Historical Score") {
      // drawLineChart(ctx, x, y, 250, overlaiddata[0]);
    }
  }

  if (data) {
    ctx.font = "12px Calibri";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.fillText("Overall Score: " + data[1].toFixed(2), x, 245);
  }
  return canvas;
}
// function overview(data) {
//   const [w, h] = [250, 250];
//   // const ctx = DOM.context2d(w, h);
//   const canvas = document.querySelector("#myCanvas");
//   const ctx = canvas.getContext("2d");
//   // const canvas = ctx.canvas;
//   // ctx.fillStyle = "lightgrey";
//   ctx.fillStyle =
//     overlaiddata && overlaiddata[1] ? colourMap(overlaiddata[1]) : "white";
//   ctx.fillRect(0, 0, canvas.width, canvas.height);

//   // console.log("ovddata", overlaiddata[0]);

//   // drawLineChart(ctx, reshapedData);
//   const x = canvas.width; // / 2 - 25; //30; // observable awkwardly adds these random boundaries to every canvas?
//   const y = canvas.height; // / 2 - 25;

//   // drawLineChart(ctx, x, y, 300, overlaiddata);
//   if (overlaiddata) {
//     if (glyphMode == "Bar Chart") {
//       // drawBarChart3(ctx, x, y, 200, overlaiddata[0], colours, 0);
//     } else if (glyphMode == "Rose Chart") {
//       drawNightingaleRoseChart3(ctx, x, y, 250, overlaiddata[0], colours, 0);
//     } else if (glyphMode == "Historical Score") {
//       // drawLineChart(ctx, x, y, 250, overlaiddata[0]);
//     }
//   }

//   if (overlaiddata) {
//     ctx.font = "12px Calibri";
//     ctx.fillStyle = "black";
//     ctx.textAlign = "center";
//     ctx.fillText("Overall Score: " + overlaiddata[1].toFixed(2), x, 245);
//   }
//   return canvas;
// }
```

<!--------- Inputs Settings --------->

```js
const tileInput = Inputs.select(maptypes, {
  label: "Basemap",
  value: "CartoPositronNoLabel",
});

const tile = Generators.input(tileInput);

const glyphModeInput = Inputs.select(
  ["Bar Chart", "Rose Chart", "Historical Score"],
  {
    label: "Glyph Mode",
    value: "Rose Chart",
  }
);

//testing
// Object.assign(glyphModeInput, {
//   // oninput: (event) => event.isTrusted && event.stopImmediatePropagation(),
//   onchange: (event) => {
//     console.log("Event Called");
//     // decarbonisationGlyph.setGlyph({
//     //   drawFn: interactiveDrawFn(glyphMode),
//     // });
//   },
//   // event.currentTarget.dispatchEvent(new Event("input")),
// });
// console.log("glyphModeInput.value", glyphModeInput.value);

const glyphMode = Generators.input(glyphModeInput);

const gridSizeInput = Inputs.radio([15, 30, 45, 60], {
  value: 30,
  label: "Grid Size",
});

const gridSize = Generators.input(gridSizeInput);

const gridTransparencyInput = Inputs.range([0, 1], {
  value: 0.5,
  label: "Grid transparency",
  step: 0.05,
});

const gridTransparency = Generators.input(gridTransparencyInput);

const glyphTransparencyInput = Inputs.range([0, 1], {
  value: 0.9,
  label: "Glyph transparency",
  step: 0.05,
});

const glyphTransparency = Generators.input(glyphTransparencyInput);

const showTooltipInput = Inputs.toggle({
  label: "Show Tooltips?",
  value: false,
});

const showTooltip = Generators.input(showTooltipInput);

const showRelativeInput = Inputs.toggle({
  label: "Show relative score?",
  value: false,
});

const showRelative = Generators.input(showRelativeInput);

const discretisationInput = Inputs.radio(["grid", "hex"], {
  value: "grid",
  label: "Discretisation Shape",
});

const discretisation = Generators.input(discretisationInput);
```

<!--------- Weight Inputs --------->

```js
function createInput(name, label) {
  const the_input = Inputs.range([-1, 1], {
    label: label,
    step: 0.05,
    value: 1,
  });
  the_input.number.style["max-width"] = "50px";
  the_input.querySelector("label").style["min-width"] = "160px";
  Object.assign(the_input, {
    oninput: (event) => event.isTrusted && event.stopImmediatePropagation(),
    onchange: (event) => event.currentTarget.dispatchEvent(new Event("input")),
  });

  return { [name]: the_input };
}

const names = [
  "pv_input",
  "ashp_input",
  "gshp_input",
  "insulation_input",
  "electricity_input",
  "gas_input",
  "fuel_input",
  "depriv_input",
];

const labels = [
  "Photovoltaic Solar Potential",
  "Air Source Heat Pump",
  "Ground Source Heat Pump",
  "Building Insulation",
  "Electricity demand",
  "Gas demand",
  "Fuel Poverty",
  "Multideprivation Index",
];

let inputs = {};
names.forEach((name, index) => {
  inputs = { ...inputs, ...createInput(name, labels[index]) };
});

const pv_inputData = Generators.input(inputs.pv_input);
const ashp_inputData = Generators.input(inputs.ashp_input);
const gshp_inputData = Generators.input(inputs.gshp_input);
const insulation_inputData = Generators.input(inputs.insulation_input);
const electricity_inputData = Generators.input(inputs.electricity_input);
const gas_inputData = Generators.input(inputs.gas_input);
const fuel_inputData = Generators.input(inputs.fuel_input);
const depriv_inputData = Generators.input(inputs.depriv_input);
```

<!-------- Data Calculations -------->

```js
const weights = {
  pv_annualgen: pv_inputData,
  ashp_suitable_pct: ashp_inputData,
  gshp_suitable_pct: gshp_inputData,
  insulation_epcABCD: insulation_inputData,
  electricity_use: electricity_inputData,
  gas_use: gas_inputData,
  fuel_poverty: fuel_inputData,
  depriv_index: depriv_inputData,
};

const grid_scores = calculateScoresWithRank(
  griddedData,
  selected_parameters,
  // initialWeights
  Object.values(weights)
);
```

```js
const scores = grid_scores.map((d) => d.score);

function getColourForGrid(value, domain, colorScheme) {
  // console.log("getColourforgrid value", value);
  const color = d3
    .scaleThreshold()
    .domain(domain)
    .range(d3[`scheme${colorScheme}`][domain.length + 1]);

  // console.log(color);
  return color(value);
}

function colourMap(value, transparent = true) {
  try {
    // const color = getColourForGrid(
    //   value,
    // statsbreaks.breaks(scores, {
    //   method: "quantile", // choropleth method
    //   nb: 6, // number of class
    //   minmax: true,
    //   precision: 2,
    // }),
    //   "BuPu"
    // );
    const color = getColourForGrid(
      value,
      quantileBreaks(scores, 6, true, 2),
      "BuPu"
    );
    // Apply alpha transparency using a D3 color object
    const d3Color = d3.color(color);
    // console.log(d3Color);
    if (transparent) {
      d3Color.opacity = gridTransparency;
    }
    return d3Color.toString(); // Return the color string with opacity
  } catch (error) {
    console.log("error occured during style mapping");
    // console.error(error);
    return "gray";
  }
}

// display(discr);
```
