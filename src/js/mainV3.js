//****************************************************************************//
//****************Map Data Across the Globe Using D3.js***********************//
//****************************************************************************//

(function(){

  var margin = {top: 50, right: 50, bottom: 50, left: 50},
      width = 1200- margin.left - margin.right,
      height = 800 - margin.top - margin.bottom;

  const url = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/meteorite-strike-data.json";
  const urls = ["https://d3js.org/world-50m.v1.json",
  "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/meteorite-strike-data.json"];

  //color scale for meteorites
  var color = d3.scaleThreshold()
    .domain([0,100,1000,10000,50000,100000,5000000,1000000,5000000,30000000])
    .range(["rgb(247,251,255)", "rgb(222,235,247)", "rgb(198,219,239)", "rgb(158,202,225)", "rgb(107,174,214)", "rgb(66,146,198)","rgb(33,113,181)","rgb(8,81,156)","rgb(8,48,107)","rgb(3,19,43)"]);

  // radius scale for meteorites
  var weight = d3.scaleLinear()
    .domain([1000,23000000])
    .range([2,50]);

  // div for tooltip
  var div = d3.select("#map").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);


  // add the svg and group to the container
  var svg = d3.select("#map")
    .append("svg")
    .attr("height", height + margin.top + margin.bottom)
    .attr("width", width + margin.left + margin.right)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top +")");

  // create time formater
  var formatTime = d3.timeFormat("%Y");

  //create a new projection
  var projection = d3.geoMercator()
                    .translate([width / 2, height / 2])
                    .scale(200);

  //create a path (geoPath) passing the projection
  var path =d3.geoPath()
              .projection(projection);

  //create a D3 queue for our async tasks
  var queue = d3.queue();
  // read in world.topojson and
  // read in meteorites landing coordinates
  urls.map(function(url){
    queue.defer(d3.json, url); // add our async tasks from urls array
  });

  // call the awaitAll method to start processing the tasks on the queue
  //once all tasks complete the datasets stored in the jsonDataSets array
  queue.awaitAll(function(error,jsonDataSets) {
    //if (error) throw error;

      var world = jsonDataSets[0];
      var meteorites = jsonDataSets[1];

      // topojson.feature(topology, object)
      // Returns the GeoJSON Feature or FeatureCollection for
      // the specified object in the given topology
      var countries = topojson.feature(world, world.objects.countries).features;
      //var meteorite = topojson.feature(landings, landings.features).features;

        console.log(formatTime(new Date("2010-01-01T00:00:00.000")))
      //console.log(countries[0]);
      //console.log( meterorites);

      // add path for each country
      svg.selectAll(".country")
          .data(countries)
          .enter().append("path")
          .attr("class", "country")
          .attr("d", path);


      // add the meteorites to the svg
      svg.selectAll(".meteorite-spots")
          .data(meteorites.features)
          .enter().append("circle")
          // use weight and color scales to add color and size based on the
          // mass of the meteorite
          .attr("r", function(d) { return weight(d.properties.mass); })
          .style("fill",function(d) { return color(d.properties.mass); })
          .attr("cx", function(d){
            if(d.geometry == null)   return 0;
            // use the projection we created for countries to convert globe
            // corrds to flat screen coordinates
            let coords = projection(d.geometry.coordinates);
            return coords[0];
           })
          .attr("cy", function(d){
            if(d.geometry == null)   return 0;
            let coords = projection(d.geometry.coordinates);
            return coords[1];
          })
          .on("mouseover", function(d) {
            div.transition()
              .duration(200)
              .style("opacity", .9);
            div.html(d.properties.name + "<br/>" + "Mass: " + d.properties.mass +
             "<br/>" + "Year: " + formatTime(new Date(d.properties.year)))
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
          })
          .on("mouseout", function(d) {
            div.transition()
              .duration(500)
              .style("opacity", 0);
          });


  })

})()
