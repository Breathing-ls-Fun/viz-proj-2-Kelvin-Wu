// set the dimensions and margins of the graph
var margin3 = {top: 50, right: 50, bottom: 50, left: 80},
    width_diff = 1200 - margin3.left - margin3.right,
    height_diff = 700 - margin3.top - margin3.bottom;

// append the svg object to the body of the page
var svg_diff = d3.select("#differential")
  .append("svg")
    .attr("width", width_diff + margin3.left + margin3.right)
    .attr("height", height_diff + margin3.top + margin3.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin3.left + "," + margin3.top + ")");

var sum_data_S = []
if (sessionStorage.sum_data_S){
    const str = sessionStorage.getItem("sum_data_S")
    const parsedobj = JSON.parse(str)
    sum_data_S = parsedobj
}
// console.log('sum data S:', sum_data_S)

var sum_data_W = []
if (sessionStorage.sum_data_W){
    const str = sessionStorage.getItem("sum_data_W")
    const parsedobj = JSON.parse(str)
    sum_data_W = parsedobj
}
// console.log('sum data W:', sum_data_W)

var sum_data_O = []
if (sessionStorage.sum_data_O){
    const str = sessionStorage.getItem("sum_data_O")
    const parsedobj = JSON.parse(str)
    sum_data_O = parsedobj
}
// console.log('sum data O:', sum_data_O)

var sum_data_T = []
if (sessionStorage.sum_data_T){
    const str = sessionStorage.getItem("sum_data_T")
    const parsedobj = JSON.parse(str)
    sum_data_T = parsedobj
}
// console.log('sum data T:', sum_data_T)

var n = ["EST. VALUE IN CURRENCY", 
        "MIN PROB ADJUSTED VALUE", 
        "MAX PROB ADJUSTED VALUE", 
        "AVERAGE PROB ADJUSTED VALUE", 
        "REALISTIC PROB ADJUSTED VALUE", 
        "3 POINT BASED PROB ADJUSTED VALUE", 
        "PERT BASED PROB ADJUSTED VALUE"]

var diff_data = []
// console.log(n.length)
for(let i = 0; i < n.length; i++){
    var obj = {}
    obj["name"] = n[i];
    obj["pos"] = sum_data_S[i]["value"] + sum_data_O[i]["value"] 
    obj["neg"] = sum_data_W[i]["value"] + sum_data_T[i]["value"] 
    obj["dif"] = obj["pos"] + obj["neg"]
    // console.log("diff obj:", obj)
    diff_data.push(obj)
}

console.log('diff data:', diff_data)

var subgroups_d = ['pos', 'neg', 'dif']

svg_diff.selectAll("*").remove();
// Add X axis
var x = d3.scaleBand()
    .domain(n)
    .range([0, width_diff])
    .padding([0.2])
svg_diff.append("g")
    .attr("transform", "translate(0," + height_diff/2 + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "translate(-50,10)rotate(-90)")
    .style("text-anchor", "end");

max_val_d = d3.max(diff_data, function(d){return d["pos"]})
// console.log("max: ", max_val_d)
min_val_d = d3.min(diff_data, function(d){return d["neg"]})
// console.log("min: ", min_val_d)

// Add Y axis
var y = d3.scaleLinear()
    .domain([-1*max_val_d, max_val_d])
    .range([ height_diff, 0 ]);
svg_diff.append("g")
    .call(d3.axisLeft(y));
svg_diff.append("text")
    .attr("text-anchor", "end")
    .attr("transform", "rotate(-90)")
    .attr("y", -margin3.left+20)
    .attr("x", (-height_diff/2)+75)
    .text("Value in Currency ($)");

// Another scale for subgroup position?
var xSubgroup_d = d3.scaleBand()
        .domain(subgroups_d)
        .range([0, x.bandwidth()]) 
        .padding([0.05])

// color palette = one color per subgroup
var colors_d = ['#000000','#ff0000','#FFCC59']
var color_d = d3.scaleOrdinal()
    .domain(subgroups_d)
    .range(colors_d)

// Show the bars
svg_diff.append("g")
    .selectAll("g")
    // Enter in data = loop group per group
    .data(diff_data)
    .enter()
    .append("g")
    .attr("transform", function(d) { return "translate(" + x(d.name) + ",0)"; })
    .selectAll("rect")
    .data(function(d) { return subgroups_d.map(function(key) { return {key: key, value: d[key]}; }); })
    .enter().append("rect")
    .attr("x", function(d) { return xSubgroup_d(d.key); })
    .attr("width", xSubgroup_d.bandwidth())
    .attr("fill", function(d) { return color_d(d.key); })
    .attr("height", function(d) { return height_diff - y(0); }) // always equal to 0
    .attr("y", function(d) { return y(0); })
    .transition()
    .duration(500)
    // .attr("y", function(d) { return y(d.value); })
    .attr("y", function(d) { return y(Math.max(0, d.value)); })
    // .attr("height", function(d) { return height_diff - y(d.value); })
    .attr("height", function(d) { return Math.abs(y(d.value) - y(0)); })
    .delay(function(d,i){ return(i*100)});

