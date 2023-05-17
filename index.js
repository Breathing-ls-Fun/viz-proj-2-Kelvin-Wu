// set the dimensions and margins of the graph
var margin = {top: 50, right: 50, bottom: 200, left: 50},
    width = 600 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg2 = d3.select("#weakness")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// Parse the Data
d3.csv("Weakness Analysis Data.csv", function(data) {
    var cols = [data.columns] 
    
    var rows = d3.map(data, function(d){return(d['PARAM NAME'])}).keys()
    // console.log(rows)

    var names = [data.columns[4], data.columns[10], data.columns[11], data.columns[12], data.columns[13], data.columns[14], data.columns[15]]
    // console.log(names)
      
    var a = []

    for(let i = 0; i < names.length; i++){
        var obj = {}
        obj["name"] = names[i];
        for(let j = 0; j < rows.length; j++){
            obj[rows[j]] = data[j][names[i]]
        }
        a.push(obj)
    }

    data.forEach(function(d) {
        d["EST. VALUE IN CURRENCY"] = +d["EST. VALUE IN CURRENCY"];
        });

    // List of subgroups 
    var subgroups = rows

    // List of groups
    var groups = names

    // Add X axis
    var x = d3.scaleBand()
            .domain(groups)
            .range([0, width])
            .padding([0.2])
    svg2.append("g")
            .attr("transform", "translate(0,0)")
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("transform", "translate(10,-15)rotate(50)")
            .style("text-anchor", "end");
    
    min_val = d3.min(data, function(d){return d["EST. VALUE IN CURRENCY"]})
    max_val = d3.max(data, function(d){return d["EST. VALUE IN CURRENCY"]})

    // Add Y axis
    var y = d3.scaleLinear()
            .domain([min_val*1.1, 0])
            .range([ height, 0 ]);
    svg2.append("g")
            .call(d3.axisLeft(y));

    // Another scale for subgroup position?
    var xSubgroup = d3.scaleBand()
                    .domain(subgroups)
                    .range([0, x.bandwidth()]) 
                    .padding([0.05])

    // color palette = one color per subgroup
    var color = d3.scaleOrdinal()
                .domain(subgroups)
                .range(['#e41a1c','#377eb8','#4daf4a', '#444444', '#ffbabe', 'babeff'])

    // Show the bars
    svg2.append("g")
        .selectAll("g")
        // Enter in data = loop group per group
        .data(a)
        .enter()
        .append("g")
        .attr("transform", function(d) { return "translate(" + x(d.name) + ",0)"; })
        .selectAll("rect")
        .data(function(d) { return subgroups.map(function(key) { return {key: key, value: d[key]}; }); })
        .enter().append("rect")
        .attr("x", function(d) { return xSubgroup(d.key); })
        .attr("y", function(d) { return y(d.value); })
        .attr("width", xSubgroup.bandwidth())
        .attr("height", function(d) { return height - y(d.value); })
        .attr("fill", function(d) { return color(d.key); });

    })