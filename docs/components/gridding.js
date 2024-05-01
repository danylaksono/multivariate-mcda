import * as turf from "@turf/turf";

function createGrids(boundary, size = 100) {
  var extent = turf.bbox(boundary);
  var cellSize = size;
  var options = {
    units: "meters",
    mask: turf.multiPolygon(boundary.features[0].geometry.coordinates),
  };

  var grid = turf.pointGrid(extent, cellSize, options);

  // Add lat and long attributes to each point
  turf.featureEach(grid, (feature) => {
    const coords = feature.geometry.coordinates;
    feature.properties.lat = coords[1];
    feature.properties.long = coords[0];
  });

  return grid;
}

export { createGrids };
