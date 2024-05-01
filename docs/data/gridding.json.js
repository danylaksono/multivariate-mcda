import { createGrids } from "../components/gridding.js";
import { fileURLToPath } from "node:url";
import { readFile } from "node:fs/promises";

// Get the data.
const cambridge_boundary_file = await readFile(
  fileURLToPath(
    import.meta.resolve("./prepared-data/cambridge_boundary.geojson")
  ),
  "utf8"
);
const cambridge_boundary = JSON.parse(cambridge_boundary_file);

// Create the grid.
const grid100 = createGrids(cambridge_boundary, 100);

console.warn(grid100);

// Write out csv formatted data.
process.stdout.write(JSON.stringify(grid100));
