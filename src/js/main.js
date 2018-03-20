//****************************************************************************//
//****************Map Data Across the Globe Using D3.js***********************//
//****************************************************************************//

// url for json Data
const url = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/meteorite-strike-data.json"

//add the svg to a canvas
var svg = d3.select("body")
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .append('g')
            .attr('class', 'map');
