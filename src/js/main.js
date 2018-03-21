//****************************************************************************//
//****************Map Data Across the Globe Using D3.js***********************//
//****************************************************************************//

// url for json Data
const url = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/meteorite-strike-data.json"

var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

var projection = d3.geoPatterson()
    .scale(153)
    .translate([width / 2, height / 2])
    .precision(0.1);

var path = d3.geoPath()
    .projection(projection);

svg.append("path")
    .datum(d3.geoGraticule10())
    .attr("class", "graticule")
    .attr("d", path);

d3.json("https://d3js.org/world-50m.v1.json", function(error, world) {
  if (error) throw error;

  svg.insert("path", ".graticule")
      .datum(topojson.feature(world, world.objects.land))
      .attr("class", "land")
      .attr("d", path);

  svg.insert("path", ".graticule")
      .datum(topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; }))
      .attr("class", "boundary")
      .attr("d", path);
});
