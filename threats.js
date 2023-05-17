// set the dimensions and margins of the graph
var margin2 = {top: 160, right: 50, bottom: 50, left: 80},
    width = 600 - margin2.left - margin2.right,
    height = 500 - margin2.top - margin2.bottom;

// append the svg object to the body of the page
var svg3 = d3.select("#threat")
  .append("svg")
    .attr("width", width + margin2.left + margin2.right)
    .attr("height", height + margin2.top + margin2.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin2.left + "," + margin2.top + ")");

// Parse the Data
d3.csv("Threat Analysis Data.csv?t="+Date.now(), function(data2) {
    var cols = [data2.columns]
    console.log("data: ", data2)
    sessionStorage.origcount_T = data2.length;
    console.log("keys cnt: ", sessionStorage.origcount_T)


    var names = [data2.columns[4], data2.columns[10], data2.columns[11], data2.columns[12], data2.columns[13], data2.columns[14], data2.columns[15]]
    // console.log(names)

    var stored = []
    if (sessionStorage.submitcount_T){
        for(var i=1; i < +sessionStorage.submitcount_T+1; i++){
            const str = sessionStorage.getItem("T"+i.toString())
            const parsedobj = JSON.parse(str)
            stored.push(parsedobj)
            console.log("parsed OBJs: ", parsedobj)
        }
        console.log("stored OBJs: ", stored)
    }

    const data = data2.concat(stored)
    console.log("data2: ", data)

    var rows = d3.map(data, function(d){return(d['PARAM NAME'])}).keys()
    // console.log(rows)

    var a = []

    for(let i = 0; i < names.length; i++){
        var obj = {}
        obj["name"] = names[i];
        for(let j = 0; j < rows.length; j++){
            obj[rows[j]] = data[j][names[i]]
        }
        a.push(obj)
    }

    sessionStorage.origin_t = a
    console.log(a)

    data.forEach(function(d) {
        d["EST. VALUE IN CURRENCY"] = +d["EST. VALUE IN CURRENCY"];
        });

    // List of subgroups 
    var subgroups = rows

    // List of groups
    var groups = names

    // draw graph initially
    redrawT("linear")

    //radio button
    d3.selectAll(("input[name='scaleT']")).on("change", function() {
        // console.log(this.value)
        redrawT(this.value)
    });

    function redrawT(s) {
        svg3.selectAll("*").remove();

        // Add X axis
        var x = d3.scaleBand()
                .domain(groups)
                .range([0, width])
                .padding([0.2])
        svg3.append("g")
                .attr("transform", "translate(0,0)")
                .call(d3.axisTop(x))
                .selectAll("text")
                .attr("transform", "translate(0,0)rotate(50)")
                .style("text-anchor", "end");
        
        min_val = d3.min(data, function(d){return d["EST. VALUE IN CURRENCY"]})
        max_val = d3.max(data, function(d){return d["EST. VALUE IN CURRENCY"]})

        // Add Y axis
        if (s == 'linear'){
            var y = d3.scaleLinear()
                    .domain([min_val*1.1, 0])
                    .range([ height, 0 ]);
            svg3.append("g")
                    .call(d3.axisLeft(y));
            svg3.append("text")
            .attr("text-anchor", "end")
            .attr("transform", "rotate(-90)")
            .attr("y", -margin2.left+20)
            .attr("x", -margin2.top+120)
            .text("Value in Currency ($)")
        }
        else if(s == 'log'){
        var y = d3.scaleLog()
                .base(2)
                .domain([min_val*1.1,-1])
                .range([ height, 0 ]);
            svg3.append("g")
                .call(d3.axisLeft(y));
            svg3.append("text")
                .attr("text-anchor", "end")
                .attr("transform", "rotate(-90)")
                .attr("y", -margin2.left+20)
                .attr("x", -margin2.top+120)
                .text("Value in Currency ($)")
        }

        // Another scale for subgroup position?
        var xSubgroup = d3.scaleBand()
                        .domain(subgroups)
                        .range([0, x.bandwidth()]) 
                        .padding([0.05])

        // color palette = one color per subgroup
        var colors = ['#889944','#65778a','#0973ff', '#6834de', '#d34469', '#667345']
        var color = d3.scaleOrdinal()
                    .domain(subgroups)
                    .range(colors)

        // Show the bars
        svg3.append("g")
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
            .attr("y", function(d) { return 0; })
            .attr("width", xSubgroup.bandwidth())
            .attr("fill", function(d) { return color(d.key); })
            .transition()
            .ease(d3.easeLinear)
            .duration(500)
            .delay(function(d,i){ return(i*100)})
            .attr("height", function(d) { return y(d.value); });
        
        var legendElement = svg3.append("g")
            .attr("class", "legend__container")
            .attr("transform", `translate(${width/4}, ${margin.bottom+60})`) // set our group position to the end of the chart
            .selectAll("g.legend__element")
            .data(xSubgroup.domain()) // use the scale domain as data
            .enter()
            .append("g")
            .attr("transform", function(d, i) {
                return `translate(0, ${i * 15})`; // provide an offset for each element found in the domain
            });

        legendElement.append("text")
        .attr("x", 15)
        .attr("font-size", "14px")
        .text(d => d);

        legendElement.append("rect")
            .attr("x", 0)
            .attr("y", -10)
            .attr("width", 10)
            .attr("height", 10)
            .attr("fill", function(d, i) {
                return colors[i%colors.length]; // use the same category color that we previously used in rects
            });
        }
    })