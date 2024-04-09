const selected_parameters = [
  // "code",
  "pv_annualgen", //	Total or mean expected annual electricity generation of the PV array of all buildings in the LSOA
  "ashp_suitable_pct", // Total or mean modelled peak building heat demand of the property, aggregated to LSOA level
  "gshp_suitable_pct", // Total or mean modelled peak building heat demand of the property, aggregated to LSOA level
  "insulation_epcABCD", // Total number or percentage of buildings within the LSOA with EPC rating as A, B, C or D
  "electricity_use", // Total or mean consumption of electricity (kWh per meter) in given period of time
  "gas_use", // Total or mean consumption of gas in given period of time
  "fuel_poverty", // Proportion of households fuel poor (%) within the LSOA
  "depriv_index", // Index of Multiple Deprivation (IMD) Decile
];

const categories = [
  { parameter: "pv_annualgen", category: "lct" },
  { parameter: "ashp_suitable_pct", category: "heat_efficiency" },
  { parameter: "gshp_suitable_pct", category: "heat_efficiency" },
  { parameter: "insulation_epcABCD", category: "heat_efficiency" },
  { parameter: "electricity_use", category: "energy_demand" },
  { parameter: "gas_use", category: "energy_demand" },
  { parameter: "fuel_poverty", category: "socio_demographic" },
  { parameter: "depriv_index", category: "socio_demographic" },
];

const initialWeights = selected_parameters.map(() => 1);

const colours = [
  "green", // Green energy potential -> PV
  "red", // Heat Efficiency -> ashp, ghsp, insulation
  "crimson", // gshp
  "deeppink", // insulation
  "cornflowerblue", // energy demand -> electricity, gas
  "blue", // gas
  "yellow", // socio-demographic -> fuel poverty, deprivation
  "gold", // deprivation
];

const maptypes = [
  //   "StadiaStamenToner",
  //   "StadiaStamenTonerLite",
  //   "StadiaStamenWatercolor",
  //   "StadiaStamenOutdoor",
  //   "StadiaStamenTerrain",
  //   "StadiaAlidade",
  //   "StadiaAlidadeDark",
  //   "StadiaOSMBright",
  "CartoPositron",
  "CartoPositronNoLabel",
  "CartoDark",
  "CartoDBVoyager",
  "CartoDBVoyagerNoLabel",
  "StamenTerrain",
  "StamenToner",
  "StamenTonerHybrid",
  "StamenTonerLite",
  "StamenWatercolor",
  "OSMMapnik",
  "OSMStandard",
  "WikimediaMaps",
];

function canvasPattern() {
  // create the off-screen canvas
  var canvasPattern = document.createElement("canvas");
  canvasPattern.width = 5;
  canvasPattern.height = 5;
  var contextPattern = canvasPattern.getContext("2d");

  // draw pattern to off-screen context
  contextPattern.beginPath();
  contextPattern.strokeStyle = "black"; // Set the color of the hatch lines
  contextPattern.lineWidth = 1; // Set the width of the hatch lines
  contextPattern.moveTo(0, 5);
  contextPattern.lineTo(5, 0);
  contextPattern.stroke();
  return canvasPattern;
}

export {
  selected_parameters,
  categories,
  initialWeights,
  colours,
  canvasPattern,
  maptypes,
};
