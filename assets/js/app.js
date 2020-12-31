// @TODO: YOUR CODE HERE!

// Set up chart
var svgWidth = 960;
var svgHeight = 500;

var margin = {
    top: 20,
    right: 40,
    bottom: 60,
    left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper
var svg = d3
  .select("body")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import data
  
d3.csv("/assets/data/data.csv").then(function(data){
console.log(data)

data.forEach(function(d){
    d.poverty = +d.poverty
    d.healthcare = +d.healthcare
});

// Create Scales

var xLinearScale = d3.scaleLinear()
.domain([8, d3.max(data, d => d.poverty)])
.range([0, width]);

var yLinearScale = d3.scaleLinear()
.domain([0, d3.max(data, d => d.healthcare)])
.range([height, 0]);

// Create axes

var AxisX = d3.axisBottom(xLinearScale);
var AxisY = d3.axisLeft(yLinearScale);

// Append axes
chartGroup.append("g").attr("transform", `translate(0, ${height})`).call(AxisX);
chartGroup.append("g").call(AxisY);

// Create circles

var circlesGroup = chartGroup.selectAll("circle")
.data(data)
.enter()
.append("circle")
.attr("cx", d => xLinearScale(d.poverty))
.attr("cy", d => yLinearScale(d.healthcare))
.attr("r", "15")
.attr("fill", "red")
.attr("opacity", ".5");


chartGroup.selectAll("text")
    .data(data)
    .enter()
    .append("text")
    .text(d => {return d.abbr})
    .style("font-size", "12px")

// Tool tip

var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.state}<br>Poverty: ${d.poverty}<br>Healthcare: ${d.healthcare}`);
      });

      chartGroup.call(toolTip)

      circlesGroup.on("mouseout", function(data) {
        toolTip.show(data, this);
      })

// Create axes labels

chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("Lacks Healthcare (%)");

chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
    .attr("class", "axisText")
    .text("Poverty (%)");

}).catch(function(error) {
    console.log(error);
  });
  