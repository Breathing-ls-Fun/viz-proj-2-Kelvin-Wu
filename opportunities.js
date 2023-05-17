// set the dimensions and margins of the graph
var margin = {top: 50, right: 50, bottom: 200, left: 80},
    width = 600 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg1 = d3.select("#opportunity")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// Parse the Data
d3.csv("Opportunity Analysis Data.csv?t="+Date.now(), function(data) {
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

    // List of subgroups = header of the csv files = soil condition here
    var subgroups = rows

    // List of groups = species here = value of the first column called group -> I show them on the X axis
    var groups = names
    
    // draw graph initially
    redrawS("linear")
    
    // //radio button
    // d3.selectAll(("input[name='scale']")).on("change", function() {
    //     // console.log(this.value)
    //     redrawS(this.value)
    // });

    function redrawS(s) {
        svg1.selectAll("*").remove();
        // Add X axis
        var x = d3.scaleBand()
            .domain(groups)
            .range([0, width])
            .padding([0.2])
        svg1.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-50)")
            .style("text-anchor", "end");

        max_val = d3.max(data, function(d){return d["EST. VALUE IN CURRENCY"]})

        // Add Y axis
        if (s == 'linear'){
            var y = d3.scaleLinear()
                .domain([0, max_val*1.1])
                .range([ height, 0 ]);
            svg1.append("g")
                    .call(d3.axisLeft(y));
            svg1.append("text")
                .attr("text-anchor", "end")
                .attr("transform", "rotate(-90)")
                .attr("y", -margin.left+20)
                .attr("x", -margin.top)
                .text("Value in Currency ($)");
        }
        else if(s == 'log'){
            var y = d3.scaleLog()
                .base(2)
                .domain([1, max_val*1.1])
                .range([ height, 0 ]);
            svg1.append("g")
                .call(d3.axisLeft(y));
            svg1.append("text")
            .attr("text-anchor", "end")
            .attr("transform", "rotate(-90)")
            .attr("y", -margin.left+20)
            .attr("x", -margin.top)
            .text("Value in Currency ($)")
        }
        
        // Another scale for subgroup position?
        var xSubgroup = d3.scaleBand()
                    .domain(subgroups)
                    .range([0, x.bandwidth()]) 
                    .padding([0.05])

        // color palette = one color per subgroup
        var color = d3.scaleOrdinal()
                .domain(subgroups)
                .range(['#78ad9f', '#ffbabe', '#5577ff', '#f04520', '#6e13f4', '#8594a8'])

        // Show the bars
        svg1.append("g")
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
            .attr("width", xSubgroup.bandwidth())
            .attr("fill", function(d) { return color(d.key); })
            .attr("height", function(d) { return height - y(1); }) // always equal to 0
            .attr("y", function(d) { return y(1); })
            .transition()
            .duration(800)
            .attr("y", function(d) { return y(d.value); })
            .attr("height", function(d) { return height - y(d.value); })
            .delay(function(d,i){ return(i*100)});
        }

    })