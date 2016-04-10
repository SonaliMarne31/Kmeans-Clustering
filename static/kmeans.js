var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

//X-Axis values
var xAxisValues = function(d) { return d.Xaxis;}, 
    xAxisScale = d3.scale.linear().range([0, width]), 
    xAxisMappingValues = function(d) { return xAxisScale(xAxisValues(d));}, 
    xAxis = d3.svg.axis().scale(xAxisScale).orient("bottom");

//Y-Axis Values
var yAxisValues = function(d) { return d.Yaxis;}, 
    yAxisScale = d3.scale.linear().range([height, 0]), 
    yAxisMappingValues = function(d) { return yAxisScale(yAxisValues(d));}, 
    yAxis = d3.svg.axis().scale(yAxisScale).orient("left");

// setup fill color
var colorValue = function(d) { return d.Cluster;},
    color = d3.scale.category10();

// add the graph canvas to the body of the webpage
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// add the tooltip area to the webpage
var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// load data
d3.csv("/static/kmeans.csv", function(error, data) {

  // change string (from CSV) into number format
  data.forEach(function(d) {
    d.Xaxis = +d.Xaxis;
    d.Yaxis = +d.Yaxis;
    //console.log(d);
  });

  // don't want dots overlapping axis, so add in buffer to data domain
  xAxisScale.domain([d3.min(data, xAxisValues)-1, d3.max(data, xAxisValues)+1]);
  yAxisScale.domain([d3.min(data, yAxisValues)-1, d3.max(data, yAxisValues)+1]);

  // x-axis
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .append("text")
      .attr("class", "label")
      .attr("x", width)
      .attr("y", -6)
      .style("text-anchor", "end")
      .text("Sepal Length (cms)");

  // y-axis
  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Sepal Width (cms)");

  // draw dots
  svg.selectAll(".dot")
      .data(data)
    .enter().append("circle")
      .attr("class", "dot")
      .attr("r", 2.5)
      .attr("cx", xAxisMappingValues)
      .attr("cy", yAxisMappingValues)
      .style("fill", function(d) { return color(colorValue(d));}) 
      .on("mouseover", function(d) {
          tooltip.transition()
               .duration(200)
               .style("opacity", .9);
          tooltip.html(d["Cluster"] + "<br/> (" + xAxisValues(d) 
	        + ", " + yAxisValues(d) + ")")
               .style("left", (d3.event.pageX + 4) + "px")
               .style("top", (d3.event.pageY - 4) + "px");
      })
      .on("mouseout", function(d) {
          tooltip.transition()
               .duration(500)
               .style("opacity", 0);
      });

  // draw legend
  var legend = svg.selectAll(".legend")
      .data(color.domain())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  // draw legend colored rectangles
  legend.append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

  // draw legend text
  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d;})
});
