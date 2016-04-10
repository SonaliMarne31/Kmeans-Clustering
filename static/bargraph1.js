var margin = {top: 30, right: 10, bottom: 10, left: 10},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.scale.linear()
    .range([0, width]);
// add the tooltip area to the webpage
var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

var y = d3.scale.ordinal()
    .rangeRoundBands([0, height], .2);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("top");

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.tsv("/static/SonaliMarne.tsv", type, function(error, data) {
  x.domain(d3.extent(data, function(d) { return d.latitude; })).nice();
  y.domain(data.map(function(d) { return d.time; }));

  svg.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", function(d) { return d.latitude < 0 ? "bar negative" : "bar positive"; })
      .attr("x", function(d) { return x(Math.min(0, d.latitude)); })
      .attr("y", function(d) { return y(d.time); })
      .attr("width", function(d) { return Math.abs(x(d.latitude) - x(0)); })
      .attr("height", y.rangeBand())
      .on("mouseover", function(d) {
          tooltip.transition()
               .duration(200)
               .style("opacity", .9);
          tooltip.html(d.time + "<br/> ( Latitude : "+ d.latitude 
	        + ")")
               .style("left", (d3.event.pageX + 4) + "px")
               .style("top", (d3.event.pageY - 4) + "px");
      })
      .on("mouseout", function(d) {
          tooltip.transition()
               .duration(500)
               .style("opacity", 0);
      });

  svg.append("g")
      .attr("class", "x axis")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
    .append("line")
      .attr("x1", x(0))
      .attr("x2", x(0))
      .attr("y2", height);
});

function type(d) {
  d.latitude = +d.latitude;
  return d;
}
