//****************************************************************************//
//****************Map Data Across the Globe Using D3.js***********************//
//****************************************************************************//


(function(){

  var margin = {top: 50, right: 50, bottom: 50, left: 50},
      width = 900 - margin.left - margin.right,
      height = 800 - margin.top - margin.bottom;

  const url = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/meteorite-strike-data.json";
  const urls = ["https://d3js.org/world-50m.v1.json",
  "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/meteorite-strike-data.json"];
  var svg = d3.select("#map")
            .append("svg")
            .attr("height", height + margin.top + margin.bottom)
            .attr("width", width + margin.left + margin.right)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top +")");

  //create a new projection
  var projection = d3.geoMercator()
                    .translate([width / 2, height / 2])
                    .scale(200);

  //create a path (geoPath) passing the projection
  var path =d3.geoPath()
              .projection(projection);

  // read in world.topojson
  // read in capitals
  var queue = d3.queue();

  urls.map(function(url){
    queue.defer(d3.json, url);
  });

  queue.awaitAll(function(error,jsonDataSets) {
    //if (error) throw error;

      var world = jsonDataSets[0];
      var meterorites = jsonDataSets[1];
      // topojson.feature(topology, object)
      // Returns the GeoJSON Feature or FeatureCollection for
      // the specified object in the given topology
      var countries = topojson.feature(world, world.objects.countries).features;
      //var meteorite = topojson.feature(landings, landings.features).features;


      console.log(countries[0]);
      console.log( meterorites);

      // add path for each country
      svg.selectAll(".country")
          .data(countries)
          .enter().append("path")
          .attr("class", "country")
          .attr("d", path)
          .on('mouseover', function(d) {
            // add the class

            d3.select(this).classed("selected", true)
          })
          .on('mouseout', function(d) {
            // add the class
            d3.select(this).classed("selected", false)
          })


      svg.selectAll(".meteorite-spots")
          .data(meterorites.features)
          .enter().append("circle")
          .attr("r", 2)
          .attr("cx", function(d){
            if(d.geometry == null)   return 0;
            let coords = projection(d.geometry.coordinates);
            return coords[0];
           })
          .attr("cy", function(d){
            if(d.geometry == null)   return 0;
            let coords = projection(d.geometry.coordinates);
            return coords[1];
           });

  })


  // d3.json("https://d3js.org/world-50m.v1.json", function(error1, data) {
  //    if (error1) throw error1;
  //   d3.json(url, function(error2, landings) {
  //
  //
  //       // topojson.feature(topology, object)
  //       // Returns the GeoJSON Feature or FeatureCollection for
  //       // the specified object in the given topology
  //       var countries = topojson.feature(data, data.objects.countries).features;
  //       //var meteorite = topojson.feature(landings, landings.features).features;
  //
  //
  //       console.log(countries[0]);
  //       //console.log(landings.features);
  //
  //       // add path for each country
  //       svg.selectAll(".country")
  //           .data(countries)
  //           .enter().append("path")
  //           .attr("class", "country")
  //           .attr("d", path)
  //           .on('mouseover', function(d) {
  //             // add the class
  //
  //             d3.select(this).classed("selected", true)
  //           })
  //           .on('mouseout', function(d) {
  //             // add the class
  //             d3.select(this).classed("selected", false)
  //           })
  //
  //
  //       // svg.selectAll(".meteorite-spots")
  //       //     .data(landings.features)
  //       //     .enter().append("circle")
  //       //     .attr("r", 2)
  //       //     .attr("cx", function(d){
  //       //       let coords = projection(d.geometry.coordinates);
  //       //       return coords[0];
  //       //      })
  //       //     .attr("cy", function(d){
  //       //       let coords = projection(d.geometry.coordinates);
  //       //       return coords[1];
  //       //      });
  //
  //   });
  // });


})()
