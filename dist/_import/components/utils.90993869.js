import * as d3 from "../../_npm/d3@7.9.0/_esm.js";

function drawHatch(ctx, x, y, width, height, angle = 45) {
  const radAngle = (angle * Math.PI) / 180;
  const spacing = 4;

  ctx.lineWidth = 1;
  ctx.strokeStyle = "lightgrey";

  for (let i = 0; i <= height; i += spacing) {
    const startX = x;
    const startY = y - i;
    const endX = startX + width;
    const endY = startY;

    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
  }
}

function calculateScoresWithRank(lsoaData, params, weights) {
  const scoredItems = lsoaData.map((item) => {
    const score = params.reduce((acc, param, index) => {
      const value = item[param];
      const weight = weights[index];

      return acc + value * weight;
    }, 0);

    return { ...item, score };
  });

  scoredItems.sort((a, b) => b.score - a.score);

  let currentRank = 1;
  let currentScore = scoredItems[0].score;

  scoredItems.forEach((item) => {
    if (item.score !== currentScore) {
      currentRank++;
      currentScore = item.score;
    }
    item.rank = currentRank;
  });

  return scoredItems;
}

function aggregateValues(data, selectedParameters) {
  const aggregates = {}; // Initialize an empty object to store results

  // Loop through each parameter in the selected list
  for (const parameter of selectedParameters) {
    // Initialize an accumulator variable for the sum
    let sum = 0;

    // Loop through each object in the data array
    for (const item of data) {
      // Add the current parameter value to the sum
      sum += item[parameter];
    }

    // Calculate the average for the parameter
    const average = sum / data.length;

    // Store the average in the aggregates object
    aggregates[parameter] = average;
  }

  return aggregates;
}

function getColourForGrid(value, domain, colorScheme) {
  const color = d3
    .scaleThreshold()
    .domain(domain)
    .range(d3[`scheme${colorScheme}`][domain.length + 1]);

  console.log(color);
  return color(value);
}

function quantileBreaks(values, numClasses, minmax = true, precision = 2) {
  // Sort the values in ascending order
  const sortedValues = values.slice().sort((a, b) => a - b);

  // Calculate the quantile step
  const step = sortedValues.length / numClasses;

  // Initialize the breaks array
  const breaks = [];

  // Calculate the break values
  for (let i = 0; i < numClasses; i++) {
    const index = Math.floor((i + 1) * step);
    const breakValue = sortedValues[index - 1];
    breaks.push(breakValue);
  }

  // Add the minimum and maximum values if minmax is true
  if (minmax) {
    breaks.unshift(sortedValues[0]);
    breaks.push(sortedValues[sortedValues.length - 1]);
  }

  // Round the break values to the specified precision
  const roundedBreaks = breaks.map((value) => Number(value.toFixed(precision)));

  return roundedBreaks;
}

export {
  drawHatch,
  getColourForGrid,
  calculateScoresWithRank,
  aggregateValues,
  quantileBreaks,
};
